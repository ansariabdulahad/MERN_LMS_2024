import { model, Schema } from 'mongoose';

const LectureSchema = new Schema({
    title: String,
    videoUrl: String,
    public_id: String,
    freePreview: Boolean
}, { timestamps: true });

const CourseSchema = new Schema({
    instructorId: String,
    instructorName: String,
    date: Date,
    title: String,
    category: String,
    level: String,
    primaryLanguage: String,
    subtitle: String,
    description: String,
    image: String,
    welcomeMessage: String,
    pricing: Number,
    objectives: String,
    students: [
        {
            studentId: String,
            studentName: String,
            studentEmail: String
        }
    ],
    curriculum: [LectureSchema], // Array of Lecture schemas
    isPublished: Boolean
}, { timestamps: true });

export default model('Course', CourseSchema);