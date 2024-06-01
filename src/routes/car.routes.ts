import { Router } from "express";
import { getCars, getCarById, createCar, updateCar, deleteCar, softDeleteCar } from "../controllers/CarsController";
import { authorize } from "../middlewares/auth";

const router = Router();

router.get("/", getCars);
router.get("/:id", getCarById)
router.post("/create", authorize,createCar);
router.put("/:id", authorize, updateCar);
router.delete("/:id", authorize, softDeleteCar);

export default router;