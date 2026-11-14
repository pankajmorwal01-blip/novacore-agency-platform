const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Storage configuration with filename sanitization
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Strip unsafe characters and directory traversal patterns
    const cleanOriginalName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const extension = path.extname(cleanOriginalName).toLowerCase();
    const baseName = path.basename(cleanOriginalName, extension).substring(0, 50);
    cb(null, `${baseName}-${uniqueSuffix}${extension}`);
  },
});

// File filter for allowed extensions and MIME types
const fileFilter = (req, file, cb) => {
  const allowedExtensions = /jpeg|jpg|png|webp|svg|pdf|doc|docx|txt|zip|tar|gz/;
  const extName = allowedExtensions.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimeType =
    file.mimetype.startsWith('image/') ||
    file.mimetype.startsWith('application/pdf') ||
    file.mimetype.startsWith('application/msword') ||
    file.mimetype.includes('officedocument') ||
    file.mimetype.includes('zip') ||
    file.mimetype.includes('compressed') ||
    file.mimetype.startsWith('text/');

  if (extName && mimeType) {
    cb(null, true);
  } else {
    cb(
      new Error(
        'Invalid file type. Allowed files include Images (PNG, JPG, WEBP), Documents (PDF, DOCX, TXT), and Archives (ZIP).'
      ),
      false
    );
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 15 * 1024 * 1024, // 15MB limit
  },
  fileFilter,
});

module.exports = upload;

