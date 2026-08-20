const path = require("path");
const crypto = require("crypto");
const multer = require("multer");

const createImageUpload = ({ folder, maxFileSizeMb = 5, maxFiles = 5 }) => {

    const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
    const ALLOWED_EXT = [".jpg", ".jpeg", ".png", ".webp"];

    const imageFileFilter = (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        const ok = ALLOWED_TYPES.includes(file.mimetype) && ALLOWED_EXT.includes(ext);
        if (!ok) return cb(new Error("UNSUPPORTED_FILE_TYPE"));
        cb(null, true);
    };

    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            const destPath = path.join(__dirname, "..", "..", "uploads", folder);
            cb(null, destPath);
        },
        filename: (req, file, cb) => {
            const ext = path.extname(file.originalname).toLowerCase();
            cb(null, `${crypto.randomUUID()}${ext}`);
        },
    });

    return multer({
        storage,
        fileFilter: imageFileFilter,
        limits: { fileSize: maxFileSizeMb * 1024 * 1024, files: maxFiles },
    });
};

module.exports = createImageUpload;