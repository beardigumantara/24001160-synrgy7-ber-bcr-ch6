import { UsersModel } from "../models/UsersModel";

export const get = () => {
  return UsersModel.query();
}

export const getById = (id: number) => {
  return UsersModel.query().findById(id).throwIfNotFound();
}

export const getByEmail = async (email: string) => {
  const user = await UsersModel.query().where("email", email);
  if(user.length === 0) {
    throw new Error("User not found");
  }
  return user[0]; 
}

export const create = (user: any) => {
  return UsersModel.query().insert(user).returning("*");
}

export const update = (id: number, user: any) => {
  return UsersModel.query().findById(id).patch(user).returning("*");
}

export const deleteUser = (id: number) => {
  return UsersModel.query().deleteById(id).throwIfNotFound().returning("*");
}