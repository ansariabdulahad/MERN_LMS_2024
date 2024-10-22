import { axiosInstance } from "@/api/axiosInstance"

export const registerService = async (formData) => {
    const { data } = await axiosInstance.post(
        '/api/auth/register',
        {
            ...formData,
            role: 'user'
        }
    );
    return data;
};

export const loginService = async (formData) => {
    const { data } = await axiosInstance.post('/api/auth/login', formData);
    return data;
}

export const checkAuthService = async () => {
    const { data } = await axiosInstance.get('/api/auth/check-auth');
    return data;
}