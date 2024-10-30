import { Router } from 'express';
import multer from 'multer';
import fs from 'fs';
import { deleteMediaFromCloudinary, uploadMediaTocloudinary } from '../../helpers/cloudinary.js';
import path from 'path';

const router = Router();
const UPLOAD_DIR = path.resolve('uploads');

if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR);
}

const upload = multer({ dest: UPLOAD_DIR });

// make helper function to clupup files after each upload
const removeFile = (path) => {
    try {
        fs.unlinkSync(path);
    } catch (error) {
        console.error(`Error deleting ${path}: `, error);
    }
}

router.post('/upload', upload.single('file'), async (req, res) => {
    try {
        const { path } = req.file;
        const result = await uploadMediaTocloudinary(path);

        removeFile(path); // remove temporary file

        res.status(201).json({
            success: true,
            message: "File uploaded successfully",
            data: result
        });

    } catch (error) {
        // Ensure temporary file is deleted in case of errors
        if (req.file) removeFile(req.file.path);

        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error uploading file"
        });
    }
});

router.delete('/delete/:id', async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) return res.status(400).json({
            success: false,
            message: "Asset Id is required!"
        });

        await deleteMediaFromCloudinary(id);

        res.status(200).json({
            success: true,
            message: "File deleted successfully",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error deleting file"
        });
    }
});

// bulk upload feature
router.post('/bulk-upload', upload.array('files', 10), async (req, res) => {
    try {
        const uploadPromises = req.files.map((fileItem) => uploadMediaTocloudinary(fileItem.path).finally(() => {
            removeFile(fileItem.path);
        }));
        const result = await Promise.all(uploadPromises);

        res.status(201).json({
            success: true,
            message: "All files uploaded successfully!",
            data: result
        });
    } catch (error) {
        if (req.files) req.files.forEach((fileItem) => removeFile(fileItem.path));
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error uploading bulk files!"
        });
    }
})

export default router;