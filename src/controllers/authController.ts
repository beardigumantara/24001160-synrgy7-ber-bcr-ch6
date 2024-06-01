import bycriptjs from 'bcryptjs';
import { getAllUsers, getUserId, postUser, putUser, removeUser, getUserByEmail } from '../services/usersService';
import jwt from 'jsonwebtoken';
import { log } from 'console';
import { UsersModel } from '../models/UsersModel';

const SALT : number = 10;

const createToken = (payload: any) => {
    return jwt.sign(payload, process.env.JWT_SECRET_KEY || "secret");  
}

export const getAll = async (req: any, res: any) => {
    const users = await getAllUsers();

    res.status(200).json({
        message: "Get all users",
        users,
    });
}

export const getUserById = async (req: any, res: any) => {
    try {
        const getId: number = Number(req.params.id);
        const user = await getUserId(getId);
        res.status(200).json({
            message: "Get specific user by id",
            user,
        });
    } catch (error) {
        res.status(404).json({
            message: "Data Not Found"
        });
    }
}

export const register = async (req: any, res: any) => {
    try {
        const defaultRole = "member";
        const {name, email, password} = req.body;
        const hashpassword = await bycriptjs.hash(password, SALT);
        const user = await postUser({
            name,
            email,
            password: hashpassword,
            role: defaultRole,
        });

        res.status(201).json({
            message: "User created successfully",
            user,
        });
    } catch (error) {
        res.status(400).json({
            message: "Error creating user",
            error,
        });
    }
}

export const updateUser = async (req: any, res: any) => {
    try {
        const {name, email, password, role} = req.body;
        const checkUser = req.user;
        if (checkUser.role !== "superadmin") {
            return res.status(403).json({
                message: "Forbidden access",
            });
        }
        const getId: number = Number(req.params.id);
        const hashpassword = await bycriptjs.hash(password, SALT);
        const user = await putUser(getId, {
            name,
            email,
            password: hashpassword,
            role,
        });

        res.status(200).json({
            message: "User updated successfully",
            user,
        });
    } catch (error) {
        res.status(400).json({
            message: "Error updating user",
            error,
        });
    }
}

export const changePassword = async (req: any, res: any) => {
    try {
        const {password} = req.body;
        const getId: number = Number(req.params.id);
        const hashpassword = await bycriptjs.hash(password, SALT);
        const user = await putUser(getId, {
            password: hashpassword,
        });

        res.status(200).json({
            message: "Password updated successfully",
            user,
        });
    } catch (error) {
        res.status(400).json({
            message: "Error updating password",
            error,
        });
    }
}

export const deleteUser = async (req: any, res: any) => {
    try {
        const getId: number = Number(req.params.id);
        const user = await removeUser(getId);

        res.status(200).json({
            message: "User deleted successfully",
            user,
        });
    } catch (error) {
        res.status(400).json({
            message: "Error deleting user",
            error,
        });
    }
} 

export const login = async (req: any, res: any) => {
    try {
        const {email, password} = req.body;
        const user = await getUserByEmail(email);
        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        const isPasswordMatch = await bycriptjs.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Password not match",
            });
        }

        const token = createToken({
            id: user.id,
            email: user.email,
            role: user.role,
        });

        res.status(200).json({
            message: "Login successfully",
            token,
        });
    } catch (error) {
        res.status(400).json({
            message: "Error login",
            error,
        });
    }
}

export const whoami = async (req: any, res: any) => {
    res.status(200).json({
        message: "Who am I",
        user: req.user,
    });
}

export const authorize = async (req: any, res: any, next: Function) => {
  try {
      const bearerToken = req.headers.authorization;
      if (!bearerToken) {
          return res.status(401).json({ message: "Unauthorized" });
      }

      const token = bearerToken.split("Bearer ")[1];
      if (!token) {
          return res.status(401).json({ message: "Unauthorized" });
      }

      const tokenPayload = jwt.verify(token, process.env.JWT_SECRET_KEY || "secret") as UsersModel;
      const user = await getUserByEmail(tokenPayload.email);
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
      req.user = user;
      console.log("tokenPayload", tokenPayload);
      
      next();
  } catch (error) {
      console.log(error);
      res.status(401).json({
          message: "Unauthorized",
      });
  }
};
