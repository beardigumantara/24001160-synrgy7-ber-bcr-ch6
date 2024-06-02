import { Router } from "express";
import { register, login, deleteUser, getAll, getUserById, updateRoleUser, whoami, changePassword } from "../controllers/authController";
import { authorize } from "../middlewares/auth";

const router = Router();

router.post("/auth/register", register);
router.post("/auth/login", login);
router.get("/whoami", authorize, whoami);
router.delete("/:id", authorize, deleteUser);
router.put("/:id", authorize, updateRoleUser);
router.put("/changepass/:id", authorize, changePassword);
router.get("/", getAll);
router.get("/:id", getUserById);

export default router;