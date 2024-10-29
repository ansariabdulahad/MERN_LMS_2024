import Course from '../../models/Course.js';

// Add New Course
export const addNewCourse = async (req, res) => {
    try {
        const { title, instructorId, description, pricing } = req.body;

        // Validate required fields
        if (!title || !instructorId || !description || !pricing) {
            return res.status(400).json({
                success: false,
                message: "Required fields are missing!"
            });
        }

        const newlyCreatedCourse = new Course(req.body);
        const savedCourse = await newlyCreatedCourse.save();

        res.status(201).json({
            success: true,
            message: "Course added successfully",
            data: savedCourse
        });
    } catch (error) {
        console.error("Error adding course:", error.message);
        res.status(500).json({
            success: false,
            message: "Error occurred while adding new course!",
            error: error.message
        });
    }
};

// Get All Courses
export const getAllCourses = async (req, res) => {
    try {
        const coursesList = await Course.find({}).lean();

        if (!coursesList.length) {
            return res.status(404).json({
                success: false,
                message: "No courses found!"
            });
        }

        res.status(200).json({
            success: true,
            message: "Courses list retrieved successfully",
            data: coursesList
        });
    } catch (error) {
        console.error("Error getting courses:", error.message);
        res.status(500).json({
            success: false,
            message: "Error occurred while getting all courses!",
            error: error.message
        });
    }
};

// Get Course Details by ID
export const getCourseDetailsById = async (req, res) => {
    try {
        const { id } = req.params;
        const courseDetails = await Course.findById(id).lean();

        if (!courseDetails) {
            return res.status(404).json({
                success: false,
                message: "Course not found!"
            });
        }

        res.status(200).json({
            success: true,
            message: "Course details retrieved successfully",
            data: courseDetails
        });
    } catch (error) {
        console.error("Error getting course details:", error.message);
        res.status(500).json({
            success: false,
            message: "Error occurred while getting course details!",
            error: error.message
        });
    }
};

// Update Course by ID
export const updateCourseById = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedCourseData = req.body;

        const updatedCourse = await Course.findByIdAndUpdate(
            id,
            updatedCourseData,
            { new: true, runValidators: true }
        ).lean();

        if (!updatedCourse) {
            return res.status(404).json({
                success: false,
                message: "Course not found!"
            });
        }

        res.status(200).json({
            success: true,
            message: "Course updated successfully!",
            data: updatedCourse
        });
    } catch (error) {
        console.error("Error updating course:", error.message);
        res.status(500).json({
            success: false,
            message: "Error occurred while updating course!",
            error: error.message
        });
    }
};
