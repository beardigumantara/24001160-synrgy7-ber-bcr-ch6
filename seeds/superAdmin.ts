import { Knex } from "knex";
import bycriptjs from "bcryptjs";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("users").del();

    // Inserts seed entries
    const hashpassword = await bycriptjs.hash("superadmin", 10);
    await knex("users").insert([
        {
            name: "Super Admin",
            email: "superadmin@gmail.com",
            password: hashpassword,
            role: "superadmin",
        }
    ]);
};
