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

// upload media service
export const mediaDeleteService = async (id) => {
    const { data } = await axiosInstance.delete(`/api/media/delete/${id}`);
    return data;
}

// upload bulk media service
export const mediaBulkUploadService = async (formData, onProgressCallback) => {
    const { data } = await axiosInstance.post('/api/media/bulk-upload', formData,
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