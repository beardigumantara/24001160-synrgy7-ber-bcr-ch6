import { UsersModel } from '../models/UsersModel';
import { getUserByEmail } from '../services/usersService';
import jwt from 'jsonwebtoken';

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
