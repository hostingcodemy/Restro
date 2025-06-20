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
    window.location.href = '/';
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
const noAuthRoutes = ['/adminauth/login'];

api.interceptors.request.use(
    (config) => {
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
        const contentType = response.headers['content-type'];

        if (!contentType?.includes('application/json')) {
            return response;
        }

        if (!response.data?.isValid) {
            alert(response.data?.errorMessage || 'Something went wrong');
            return Promise.reject(new Error(response.data?.errorMessage || 'Invalid response'));
        }

        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 &&
            error.response?.data === 'Token Expired' &&
            !originalRequest._retry) {

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

                    const refreshResponse = await api.post("adminauth/refresh-token",
                        { refreshToken, accessToken }, {
                        headers: {
                            Authorization: `Bearer ${accessToken}`, 
                        },
                    });

                    const newAccessToken = refreshResponse.data.data;
                    localStorage.setItem('accessToken', newAccessToken);
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

