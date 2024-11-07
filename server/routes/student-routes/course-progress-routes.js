import { Router } from 'express';
import { getCurrentCourseProgress, markCurrentLectureAsViewed, resetCurrentCourseProgress } from '../../controllers/student-controller/course-progress-controller.js';

const router = Router();

router.get('/get/:userId/:courseId', getCurrentCourseProgress);
router.post('/mark-lecture-viewed', markCurrentLectureAsViewed);
router.post('/reset-progress', resetCurrentCourseProgress);

export default router;