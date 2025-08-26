const path = require("path");
const fs = require("fs");
const multer = require("multer");

const uploadPath = path.join(__dirname, "..", "uploads", "profile");
fs.mkdirSync(uploadPath, { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueSuffix =
      Date.now() + "-" + Math.round(Math.random() * 1e9) + ext;
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

const uploadMiddleware = multer({ storage: storage });

module.exports = { uploadMiddleware };