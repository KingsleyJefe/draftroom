import { Router } from "express";
import { signup } from "./controller.js";
import { createUserSchema } from "./dto.js";
import { validate } from "../../global/middlewares/validator.js";

const router = Router();

router.post("/sign-up", validate(createUserSchema), signup);

export default router;
