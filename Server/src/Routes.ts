import { Router } from "express";
import AuthRoutes from "./Entities/Auth/routes.js";
import DraftsRoutes from "./Entities/Drafts/routes";

const router = Router();

router.use("/auth", AuthRoutes);

router.use("/drafts", DraftsRoutes);

export default router;
