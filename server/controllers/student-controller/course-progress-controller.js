import CourseProgress from '../../models/CourseProgress.js';
import Course from '../../models/Course.js';
import StudentCourses from '../../models/StudentCourses.js';

// mark current lecture as finished or viewed
export const markCurrentLectureAsViewed = async (req, res) => {
    try {

    } catch (error) {
        console.error(error, "Error while marking current lecture as viewed");
        res.status(500).json({
            success: false,
            message: 'Error while marking current lecture as viewed',
            error: error.message
        });
    }
}

// get current course progress
export const getCurrentCourseProgress = async (req, res) => {
    try {
        const { userId, courseId } = req.params;

        // get purchased course
        const studentPurchasedCourses = await StudentCourses.findOne({ userId });

        // check course is actually purchased or not
        const isCurrentCoursePurchasedByCurrentUserOrNot =
            studentPurchasedCourses?.courses?.findIndex((item) => item?.courseId == courseId) > -1;

        if (!isCurrentCoursePurchasedByCurrentUserOrNot) return res.status(200).json({
            success: true,
            message: 'You need to purchase this course to access it!',
            data: {
                isPurchased: false,
            }
        });

        // check course progress
        const currentUserCourseProgress = await CourseProgress.findOne({ userId, courseId });

        if (!currentUserCourseProgress || currentUserCourseProgress?.lecturesProgress?.length === 0) {
            const course = await Course.findById(courseId);

            if (!course) {
                return res.status(404).json({
                    success: false,
                    message: "Course not found!"
                });
            }

            return res.status(200).json({
                success: true,
                message: "No progress found, you can start watching the course.",
                data: {
                    courseDetails: course,
                    progress: [],
                    isPurchased: true,
                }
            });
        }

        // send details if lecture has progress
        const courseDetails = await Course.findById(courseId);

        res.status(200).json({
            success: true,
            message: "Course details",
            data: {
                courseDetails,
                progress: currentUserCourseProgress?.lecturesProgress,
                completed: currentUserCourseProgress?.completed,
                completionDate: currentUserCourseProgress?.completionDate,
                isPurchased: true
            }
        });

    } catch (error) {
        console.error(error, "Error occurred while getting current course progress");
        res.status(500).json({
            success: false,
            message: 'Error while getting current course progress',
            error: error.message
        });
    }
}

// reset course progress
export const resetCurrentCourseProgress = async (req, res) => {
    try {

    } catch (error) {
        console.error(error, "Error reseting course progress");
        res.status(500).json({
            success: false,
            message: 'Error while reseting course progress',
            error: error.message
        });
    }
}