import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable("cars", (table) => {
    table.dropForeign("user_id");
    table
      .foreign("created_by")
      .references("users.id");
  });
}


export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable("cars", (table) => {
    table.dropForeign("created_by");
    table
      .foreign("user_id")
      .references("users.id");
  });
}

