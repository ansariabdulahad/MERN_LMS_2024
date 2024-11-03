import { model, Schema } from 'mongoose';

const StudentCoursesSchema = new Schema({
    userId: String,
    courses: [
        {
            courseId: String,
            title: String,
            instructorId: String,
            instructorName: String,
            dateOfPurchase: Date,
            courseImage: String
        }
    ]
}, {timestamps: true});

export default model('StudentCourses', StudentCoursesSchema);