import { Router } from "express";
import { getDrafts } from "./controller";
import { uploadPdf } from "../../global/middlewares/multer-upload";

const router = Router();

router.post("/upload", uploadPdf.array("files", 5), getDrafts);

export default router;
