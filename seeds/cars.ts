import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("cars").del();

  // Inserts seed entries
  await knex("cars").insert([
    {
      name: "Toyota",
      price: "Rp700.000",
      image: "https://images.bisnis.com/thumb/posts/2019/03/31/906567/supra-baru.jpg?w=450&h=237", //change image url from your image cloudinary
      start_rent: new Date("2024-05-18 15:56:00"),
      finish_rent: new Date("2024-05-18 15:56:00"),
      availability: true,
      created_by: 2,
    },
  ]);
}
