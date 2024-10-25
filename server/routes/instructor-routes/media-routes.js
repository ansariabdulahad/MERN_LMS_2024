import { Router } from 'express';
import multer from 'multer';
import fs from 'fs';
import { deleteMediaFromCloudinary, uploadMediaTocloudinary } from '../../helpers/cloudinary.js';
import path from 'path';

const router = Router();
const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('file'), async (req, res) => {
    try {
        const { path } = req.file;
        const result = await uploadMediaTocloudinary(path);

        fs.unlinkSync(path); // remove temporary file

        res.status(201).json({
            success: true,
            message: "File uploaded successfully",
            data: result
        });

    } catch (error) {
        // Ensure temporary file is deleted in case of errors
        if (req.file) fs.unlinkSync(req.file.path);

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
})

export default router;