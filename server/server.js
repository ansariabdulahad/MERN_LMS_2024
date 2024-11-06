import { config } from 'dotenv';
import express from 'express';
import cors from 'cors';

import { mongoDbConnection } from './utils/db.js';

import authRoutes from './routes/auth-routes/index.js';
import mediaRoutes from './routes/instructor-routes/media-routes.js';
import instructorCourseRoutes from './routes/instructor-routes/course-routes.js';
import studentViewCourseRoutes from './routes/student-routes/course-routes.js';
import studentViewOrderRoutes from './routes/student-routes/order-routes.js';
import studentCoursesRoutes from './routes/student-routes/student-courses-routes.js';
import studentCourseProgressRoutes from './routes/student-routes/course-progress-routes.js';

// dotenv configuration
config();

const { PORT = 5000, CLIENT_URL } = process.env;
const app = express();

// middlewares
app.use(cors({
    origin: CLIENT_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// routers configuration
app.use('/api/auth', authRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/instructor/course', instructorCourseRoutes);
app.use('/api/student/course', studentViewCourseRoutes);
app.use('/api/student/order', studentViewOrderRoutes);
app.use('/api/student/courses-bought', studentCoursesRoutes);
app.use('/api/student/course-progress', studentCourseProgressRoutes);

// error handling
app.use((err, req, res, next) => {
    console.log(err.stack || err);
    res.status(500).json({
        success: false,
        message: "ERROR FROM SERVER, SOMETHING WENT WRONG!",
        error: err.stack || err.message || err
    });
});

// mongodb connection & server listening
mongoDbConnection()
    .then(() => {
        app.listen(PORT, (err) => {
            if (err) console.error(err);
            console.log(`Server listening on ${PORT}`);
        })
    }).catch((err) => {
        console.error(err);
    });