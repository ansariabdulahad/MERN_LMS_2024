import { model, Schema } from 'mongoose';

const LectureProgressSchema = new Schema({
    lectureId: String,
    viewed: Boolean,
    dateViewed: Date
});

const CourseProgressSchema = new Schema({
    userId: String,
    courseId: String,
    completed: Boolean,
    completionDate: Date,
    lecturesProgress: [LectureProgressSchema]
}, { timestamps: true });

export default model('CourseProgress', CourseProgressSchema);