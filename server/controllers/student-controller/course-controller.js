import Course from '../../models/Course.js';
import StudentCourses from '../../models/StudentCourses.js';
import { filterCourses, sortByFiltering } from '../../services/course-filter-service.js';

export const getAllStudentViewCourses = async (req, res) => {
    try {

        const { category = [], level = [], primaryLanguage = [], sortBy = "price-lowtohigh" } = req.query;

        const filters = {};

        if (category.length) filters.category = { $in: category.split(',') };
        if (level.length) filters.level = { $in: level.split(',') };
        if (primaryLanguage.length) filters.primaryLanguage = { $in: primaryLanguage.split(',') };

        const sortParam = {};

        switch (sortBy) {
            case "price-lowtohigh":
                sortParam.pricing = 1;
                break;

            case "price-hightolow":
                sortParam.pricing = -1;
                break;

            case "title-atoz":
                sortParam.title = 1;
                break;

            case "title-ztoa":
                sortParam.title = -1;
                break;

            default:
                sortParam.pricing = 1;
                break;
        }

        const coursesList = await Course.find(filters).sort(sortParam);

        res.status(200).json({
            success: true,
            message: "Courses list was successfully fetched!",
            data: coursesList
        });

    } catch (error) {
        console.error(error, "Error getting all students");
        res.status(500).json({
            success: false,
            message: "Error getting all students!"
        });
    }
}

export const getStudentViewCourseDetails = async (req, res) => {
    try {
        const { id } = req.params;

        const courseDetails = await Course.findById(id);

        if (!courseDetails) return res.status(404).json({
            success: false,
            message: "Course details not found",
            data: null
        });

        res.status(200).json({
            success: true,
            message: "Course details fetched successfully",
            data: courseDetails,
        });
    } catch (error) {
        console.error(error, "Error getting all student courses details");
        res.status(500).json({
            success: false,
            message: "Error getting all student courses details!"
        });
    }
}

export const checkCoursePurchaseInfo = async (req, res) => {
    try {
        const { id, studentId } = req.params;

        const studentCourses = await StudentCourses.findOne({
            userId: studentId
        });

        const ifStudentAlreadyBoughtCurrentCourse = studentCourses?.courses?.findIndex((course) => course?.courseId == id) > -1;

        res.status(200).json({
            success: true,
            message: "Course details fetched successfully",
            data: ifStudentAlreadyBoughtCurrentCourse
        });
    } catch (error) {
        console.error(error, "Error in checkCoursePurchaseInfo");
        res.status(500).json({
            success: false,
            message: "Error occured in checkCoursePurchaseInfo",
            error: error.message
        });
    }
}