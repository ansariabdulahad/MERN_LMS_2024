import { connect } from 'mongoose';

export const mongoDbConnection = async () => {
    try {
        await connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error(error);
        process.exit(0);
    }
}