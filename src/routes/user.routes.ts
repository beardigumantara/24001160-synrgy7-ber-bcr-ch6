import { Router } from "express";
import { register, authorize, login, deleteUser, getAll, getUserById, updateUser, whoami } from "../controllers/authController";

const router = Router();

router.post("/auth/register", register);
router.post("/auth/login", login);
router.get("/whoami", authorize, whoami);
router.get("/", getAll);

export default router;