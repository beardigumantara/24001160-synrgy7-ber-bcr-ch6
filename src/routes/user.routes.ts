import { Router } from "express";
import { register, authorize, login, deleteUser, getAll, getUserById, updateUser, whoami, changePassword } from "../controllers/authController";

const router = Router();

router.post("/auth/register", register);
router.post("/auth/login", login);
router.get("/whoami", authorize, whoami);
router.delete("/user/:id", authorize, deleteUser);
router.put("/user/:id", authorize, updateUser);
router.put("/user/:id", authorize, changePassword);
router.get("/", getAll);

export default router;