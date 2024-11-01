import { axiosInstance } from "@/api/axiosInstance"

export const fetchStudentViewCourseListService = async (query) => {
    const { data } = await axiosInstance.get(`/api/student/course/get?${query}`);
    return data;
}

export const fetchStudentViewCourseDetailsService = async (courseId) => {
    const { data } = await axiosInstance.get(`/api/student/course/details/${courseId}`);
    return data;
}