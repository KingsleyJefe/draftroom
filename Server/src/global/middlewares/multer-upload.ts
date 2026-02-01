import multer from "multer";
const storage = multer.memoryStorage();

export const uploadPdf = multer({
  storage,
  limits: {
    files: 5, // max 5
    fileSize: 20 * 1024 * 1024, // 20MB each
  },
  fileFilter: (req, file, cb) => {
    const isPdf =
      file.mimetype === "application/pdf" ||
      file.originalname.toLowerCase().endsWith(".pdf");

    if (!isPdf) return cb(new Error("Only PDF files are allowed"));
    cb(null, true);
  },
});
