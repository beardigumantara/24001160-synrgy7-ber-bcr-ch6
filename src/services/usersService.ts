import e from "express";
import { get, create,getById, deleteUser, update, getByEmail } from "../repositories/usersRepositories";

export const getAllUsers = () => {
  return get();
}

export const getUserId = (id: number) => {
  return getById(id);
}

export const getUserByEmail = (email: string) => {
  return getByEmail(email);
}

export const postUser = (user: any) => {
  return create(user);
}

export const putUser = (id: number, user: any) => {
  return update(id, user);
}

export const removeUser = (id: number) => {
  return deleteUser(id);
}
