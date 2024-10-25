import { config } from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';

config();

const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;

cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET
});

export const uploadMediaTocloudinary = async (filePath) => {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            resource_type: 'auto'
        });
        return result;
    } catch (error) {
        console.error(error);
        throw new Error("Error from uploadMediaTocloudinary :: ", error);
    }
}

export const deleteMediaFromCloudinary = async (publicId) => {
    try {
        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        console.error(error);
        throw new Error("Error from deleteMediaFromCloudinary :: ", error);
    }
}