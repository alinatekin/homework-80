import multer from 'multer';
import path from 'path';
import crypto from 'crypto';
import fs from 'fs';

const imageDir = './public/images';
if (!fs.existsSync(imageDir)) {
    fs.mkdirSync(imageDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, imageDir);
    },
    filename: (req, file, cb) => {
        const extension = path.extname(file.originalname);
        cb(null, crypto.randomUUID() + extension);
    }
});

export const imagesUpload = multer({ storage });