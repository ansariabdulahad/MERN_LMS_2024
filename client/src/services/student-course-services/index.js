import { axiosInstance } from "@/api/axiosInstance"

export const fetchStudentViewCourseListService = async (query) => {
    const { data } = await axiosInstance.get(`/api/student/course/get?${query}`);
    return data;
}

export const fetchStudentViewCourseDetailsService = async (courseId) => {
    const { data } = await axiosInstance.get(`/api/student/course/get/details/${courseId}`);
    return data;
}

export const checkCoursePurchaseInfoService = async (courseId, studentId) => {
    const { data } = await axiosInstance.get(`/api/student/course/purchase-info/${courseId}/${studentId}`);
    return data;
}

export const createPaymentService = async (formData) => {
    const { data } = await axiosInstance.post('/api/student/order/create', formData);
    return data;
}

export const captureAndFinalizePaymentService = async (paymentId, payerId, orderId) => {
    const { data } = await axiosInstance.post('/api/student/order/capture',
        { paymentId, payerId, orderId }
    );
    return data;
}

export const fetchStudentBoughtCoursesService = async (studentId) => {
    const { data } = await axiosInstance.get(`/api/student/courses-bought/get/${studentId}`);
    return data;
}

export const getCurrentCourseProgressService = async (userId, courseId) => {
    const { data } = await axiosInstance.get(`/api/student/course-progress/get/${userId}/${courseId}`);
    return data;
}

export const markLectureAsViewedService = async (userId, courseId, lectureId) => {
    const { data } = await axiosInstance.post(`/api/student/course-progress/mark-lecture-viewed`,
        { userId, courseId, lectureId }
    );
    return data;
}

export const resetCourseProgressService = async (userId, courseId) => {
    const { data } = await axiosInstance.post(`/api/student/course-progress/reset-progress`,
        { userId, courseId }
    );
    return data;
}