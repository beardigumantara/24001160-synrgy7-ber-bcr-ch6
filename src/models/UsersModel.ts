import { Model, ModelObject } from "objection";

export class UsersModel extends Model {
  id!: number;
  name!:string;
  email!:string;
  password!:string;
  token?:string;
  role!:string;
  created_at?:Date | string | null;
  updated_at?:Date | string | null;
  deleted_at?:Date | string | null;

  static get tableName(){
   return "users"
  }

  $beforeInsert() {
    this.created_at = new Date();
    this.updated_at = new Date();
  }

  $beforeUpdate() {
    this.updated_at = new Date();
  }

  $beforeDelete() {
    this.deleted_at = new Date();
  }
}

export type Users = ModelObject<UsersModel>