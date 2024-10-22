import axios from "axios";

// create axios instance
export const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL
});

// create axios intercepter instance
axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = JSON.parse(sessionStorage.getItem('accessToken'));

        // if (!accessToken) {
        //     console.error('Authorization token missing!');
        //     return Promise.reject(new Error('Authorization token missing'));
        // }

        config.headers.Authorization = `Bearer ${accessToken}`;
        return config;
    },
    (err) => {
        console.error("Error getting token from session storage :: ", err);
        return Promise.reject(err);
    }
)