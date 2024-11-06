import { Router } from 'express';
import { getCurrentCourseProgress } from '../../controllers/student-controller/course-progress-controller.js';

const router = Router();

router.get('/get/:userId/:courseId', getCurrentCourseProgress);

export default router;