import { Router } from 'express';
import { getAllStudentViewCourses, getStudentViewCourseDetails } from '../../controllers/student-controller/course-controller.js';

const router = Router();

router.get('/get', getAllStudentViewCourses);
router.get('/get/details/:id/:studentId', getStudentViewCourseDetails);

export default router;