import StudentCourses from "../../models/StudentCourses.js";

export const getCoursesByStudentId = async (req, res) => {
    try {
        const { studentId } = req.params;

        const studentBoughtCourses = await StudentCourses.findOne({
            userId: studentId
        });

        if (!studentBoughtCourses) return res.status(404).json({
            success: false,
            message: "No courses found!"
        });

        res.status(200).json({
            success: true,
            message: "Student bought courses successfully fetched!",
            data: studentBoughtCourses.courses
        });

    } catch (error) {
        console.error(error, "Error getting student courses by their ID!");
        res.status(500).json({
            success: false,
            message: "Error getting students courses by their ID!",
            error: error.message
        });
    }
}