import axios from "axios";

const apiBaseURL = import.meta.env.VITE_BASE_URL;

//Create Axios instance
const api = axios.create({
    baseURL: apiBaseURL
});

//Function to get token from Storage
const getAccessToken = () => localStorage.getItem('accessToken');
const getRefreshToken = () => localStorage.getItem('refreshToken');

//Function to remove tokens and redirect to login

const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    window.location.href = '/login';
};

let isRefreshing = false;
let refreshSubscribers = [];

//Function to subscribe to token refresh
const subscribeTokenRefresh = (callback) => {
    refreshSubscribers.push(callback);
}

//Function to subscribe all the tokens with new Token
const onRefreshed = (newToken) => {
    refreshSubscribers.forEach((callback) => callback(newToken));
    refreshSubscribers = [];
}

//List of endpoints where token is NOT required
const noAuthRoutes = ['/Auth/login'];

api.interceptors.request.use(
    (config) => {
        //Skip adding token for specific routes
        if (!noAuthRoutes.includes(config.url)) {
            const token = getAccessToken();
            if (token) {
                config.headers.Authorization = `Bearer ${token}`
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => {
        if (!response.data.isValid) {
            alert(response.errorMessage || 'Something went wrong');
            return Promise.reject(new Error(response.errorMessage || 'Invalid response'));
        }
        return response; 
    },
    async (error) => {
        const originalRequest = error.config;

        console.log('Response Interceptor', error);

        if (error.response?.status === 401 && error.response?.data === 'Token Expired' && !originalRequest._retry) {
            originalRequest._retry = true;

            if (!isRefreshing) {
                isRefreshing = true;
                try {
                    const refreshToken = getRefreshToken();
                    const accessToken = getAccessToken();

                    if (!refreshToken) {
                        handleLogout();
                        return Promise.reject(new Error('No refresh token available'));
                    }

                    const refreshResponse = await api.post("Auth/refresh-token",
                        { refreshToken, accessToken }, {
                        headers: {
                            Authorization: `Bearer ${accessToken}`, 
                        },
                    });
                    const newAccessToken = refreshResponse.data.data;
                    localStorage.setItem('accessToken', newAccessToken);

                    //notify all quueued request with the new token
                    onRefreshed(newAccessToken);
                }
                catch (refreshError) {
                    if (refreshError.response?.status === 401) {
                        handleLogout();
                    }
                    return Promise.reject(refreshError);
                }
                finally {
                    isRefreshing = false;
                }
            }
            return new Promise((resolve) => {
                subscribeTokenRefresh((newToken) => {
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                    resolve(api(originalRequest));
                });
            });
        }
        return Promise.reject(error);
    }
);

export default api;

