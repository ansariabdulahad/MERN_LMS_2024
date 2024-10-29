import { axiosInstance } from "@/api/axiosInstance"

export const fetchInstructorCourseListService = async () => {
    const { data } = await axiosInstance.get('/api/instructor/course/get');
    return data;
}

export const addNewCourseService = async (formData) => {
    const { data } = await axiosInstance.post('/api/instructor/course/add', formData);
    return data;
}

export const fetchInstructorCourseDetailsService = async (id) => {
    const { data } = await axiosInstance.get(`/api/instructor/course/details/${id}`);
    return data;
}

export const updateCourseByIdService = async (id, formData) => {
    const { data } = await axiosInstance.put(`/api/instructor/course/update/${id}`, formData);
    return data;
}
