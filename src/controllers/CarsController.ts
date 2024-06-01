import { Request, Response } from "express";
import { mUpload } from "../middlewares/multer";
import cloudinary from "../config/cloudinary";
import { getAllCars, getCarId, postCar, putCar, removeCar } from "../services/carsSevice";
import { UsersModel } from "../models/UsersModel";

export const getCars =  async (req: Request, res: Response) => {
  const cars = await getAllCars();

  res.status(200).json({
    message: "Get all cars",
    cars,
  });
}

export const getCarById = async (req: Request, res: Response) => {
  try {
    const getId: number = Number(req.params.id);
    const car = await getCarId(getId);
    res.status(200).json({
      message: "Get specific car by id",
      car,
    });
  } catch (error) {
    res.status(404).json({
      message: "Data Not Found"
     });
  }
}

export const createCar = [mUpload.single('image'), async (req: any, res: any) => {
  try {
    const fileBase64 = req.file?.buffer.toString('base64');
    const file = `data:${req.file?.mimetype};base64,${fileBase64}`;

    const result = await cloudinary.uploader.upload(file, {
      folder: 'bcr',
      use_filename: true,
    });
    const {name, price, start_rent, finish_rent, availability} = req.body;
    const checkUser = req.user as UsersModel;

    // Create a new car entry with the Cloudinary image URL
    const car = await postCar({
      name,
      price,
      image: result.url,
      start_rent,
      finish_rent,
      availability,
      created_by: checkUser.id,
    });

    console.log({car});
    

    // Respond with the created car details
    res.status(201).json({
      message: "Car created successfully",
      car,
    });
  } catch (error) {
    res.status(400).json({
      message: "Error creating car",
      error,
    });
  }
}];

export const updateCar = [mUpload.single('image'), async (req: any, res: any) => {
  try {
    const fileBase64 = req.file?.buffer.toString('base64');
    const file = `data:${req.file?.mimetype};base64,${fileBase64}`;

    const result = await cloudinary.uploader.upload(file, {
      folder: 'bcr',
      use_filename: true,
    });
    const {name, price, start_rent, finish_rent, availability} = req.body;
    const getId: number = Number(req.params.id);
    
    const existingCar = await getCarId(getId);
    if (!existingCar) {
      return res.status(404).json({ message: "Car not found" });
    }
    const checkUser = req.user as UsersModel;
    if (checkUser.role !== "superadmin") {
      return res.status(403).json({
          message: "Forbidden access",
      });
    }
    const car = await putCar(getId, {
      name,
      price,
      image: result.url,
      start_rent,
      finish_rent,
      availability,
      updated_by: checkUser.id,
    });
    
    res.status(200).json({
      message: "Update a car",
      car,
    });
  } catch (error) {
    res.status(400).json({
      message: "Error updating car",
      error,
    });
  }
}];

export const softDeleteCar = async (req: any, res: any) => {
  try {
    const getId: number = Number(req.params.id);
    
    const existingCar = await getCarId(getId);
    if (!existingCar) {
      return res.status(404).json({ message: "Car not found" });
    }
    const checkUser = req.user as UsersModel;
    if (checkUser.role !== "superadmin") {
      return res.status(403).json({
          message: "Forbidden access",
      });
    }
    const car = await putCar(getId, {
      deleted_by: checkUser.id,
      deleted_at: new Date(),
    });
    
    res.status(200).json({
      message: "Deleted a car",
      car,
    });
  } catch (error) {
    res.status(400).json({
      message: "Error deleting car",
      error,
    });
  }
}

export const deleteCar = async (req: Request, res: Response) => {
  try {
    const getId: number = Number(req.params.id);
    const car = await removeCar(getId);
    res.status(200).json({
      message: "Delete a car",
      car,
    });
  } catch (error) {
    res.status(404).json({
      message: "Data Not Found"
    });
  }
}