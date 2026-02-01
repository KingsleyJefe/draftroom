import { Router } from "express";
import { getDrafts } from "./controller.js";
import { uploadPdf } from "../../global/middlewares/multer-upload.js";

const router = Router();

router.post("/upload", uploadPdf.array("files", 5), getDrafts);

export default router;
