import axios from "axios";
import { decryptData } from "./secureStorage";

const apiBaseURL = import.meta.env.VITE_BASE_URL;

const api = axios.create({
    baseURL: apiBaseURL
});

// Token getters
 const getAccessToken = () => {
  const encryptedToken = localStorage.getItem('accessToken');
  return encryptedToken ? decryptData(encryptedToken) : null;
};

 const getRefreshToken = () => {
  const encryptedToken = localStorage.getItem('refreshToken');
  return encryptedToken ? decryptData(encryptedToken) : null;
};

const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('channelId');
    localStorage.removeItem('outletId');
    localStorage.removeItem('authChannels');
    localStorage.removeItem('currentOutletId');
    localStorage.removeItem('navigateTable');
    localStorage.removeItem('tableLayout');
    localStorage.removeItem('outletIds');
    localStorage.removeItem("tableChairs");
    localStorage.removeItem('coreui-free-react-admin-template-theme');
    window.location.href = "/login";
};

let isRefreshing = false;
let refreshSubscribers = [];

const subscribeTokenRefresh = (callback) => {
    refreshSubscribers.push(callback);
};

const onRefreshed = (newToken) => {
    refreshSubscribers.forEach((callback) => callback(newToken));
    refreshSubscribers = [];
};

const noAuthRoutes = ["/adminauth/login"];

api.interceptors.request.use(
    (config) => {
        if (!noAuthRoutes.includes(config.url)) {
            const token = getAccessToken();
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => {
        const contentType = response.headers["content-type"];
        if (!contentType?.includes("application/json")) return response;

        if (response.data && !response.data.isValid) {
            alert(response.data?.errorMessage || "Something went wrong");
            return Promise.reject(new Error(response.data?.errorMessage || "Invalid response"));
        }

        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        const isTokenExpired =
            error.response?.status === 401 &&
            error.response?.statusText === "Unauthorized" &&
            !originalRequest._retry;

        if (!isTokenExpired) return Promise.reject(error);

        originalRequest._retry = true;

        if (isRefreshing) {
            return new Promise((resolve) => {
                subscribeTokenRefresh((newToken) => {
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                    resolve(api(originalRequest));
                });
            });
        }

        isRefreshing = true;

        try {
            const refreshToken = getRefreshToken();
            const oldAccessToken = getAccessToken();

            if (!refreshToken) {
                handleLogout();
                return Promise.reject(new Error("No refresh token available"));
            }

            const refreshResponse = await axios.post(
                `${apiBaseURL}adminauth/refresh-token`,
                { refreshToken, accessToken: oldAccessToken },
                {
                    headers: {
                        Authorization: `Bearer ${oldAccessToken}`
                    }
                }
            );

            const newAccessToken = refreshResponse.data?.data?.accessToken;

            if (newAccessToken) {
                localStorage.setItem("accessToken", newAccessToken);
                onRefreshed(newAccessToken);

                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return api(originalRequest);
            } else {
                handleLogout();
                return Promise.reject(new Error("Failed to get new access token"));
            }
        } catch (refreshError) {
            handleLogout();
            return Promise.reject(refreshError);
        } finally {
            isRefreshing = false;
        }
    }
);

export default api;
