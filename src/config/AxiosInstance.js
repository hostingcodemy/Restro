import axios from "axios";
const baseURL = import.meta.env.VITE_BASE_URL;

const axiosInstance = axios.create({
    baseURL: baseURL,
    headers: { "Content-Type": "application/json" }
})

const refreshToken = async () => {
    try {
        const refreshToken = localStorage.getItem("refreshToken");
        const accessToken = localStorage.getItem('accessToken');

        const response = await axios.post(
            baseURL + "Auth/refresh-token",
            { refreshToken, accessToken },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );
        console.log('refresh-response ', response)
        const newAccessToken = response.data.accessToken;
        localStorage.setItem("accessToken", newAccessToken);
        return newAccessToken;
    } catch (error) {
        console.error("Refresh token failed", error);
        throw error;
    }
}

axiosInstance.interceptors.request.use((config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
})

axiosInstance.interceptors.response.use((response) => response,
    async (error) => {

        if (error.response.status === 401 && error.response.data === "Token Expired") {
            try {
                const response = await refreshToken();

                console.log(response)

                //   error.config.headers.Authorization=`Bearer ${newAccessToken}`;
                //   return axiosInstance(error.config);
            } catch (error) {
                // window.location.href="/"
            }
        }
        return Promise.reject(error);
    }
)

export default axiosInstance;