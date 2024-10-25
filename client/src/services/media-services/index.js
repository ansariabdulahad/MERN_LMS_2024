import { axiosInstance } from "@/api/axiosInstance";

// upload media service
export const mediaUploadService = async (formData, onProgressCallback) => {
    const { data } = await axiosInstance.post(
        '/api/media/upload',
        formData,
        {
            onUploadProgress: (progressEvent) => {
                const percentCompleted = Math.floor(
                    (progressEvent.loaded * 100) / progressEvent.total
                );
                onProgressCallback(percentCompleted);
            }
        }
    );
    return data;
}