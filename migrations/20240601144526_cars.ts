import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable("cars", (table) => {
    table.renameColumn('user_id', 'created_by');
    table.integer('updated_by', 10).nullable().references('id').inTable("users");
    table.integer('deleted_by', 10).nullable().references('id').inTable("users");
    table.timestamp("deleted_at").defaultTo(null);
  });
}


export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable("cars", (table) => {
    table.renameColumn('created_by', 'user_id');
    table.dropColumn('updated_by');
    table.dropColumn('deleted_by');
    table.dropColumn('deleted_at');
  });
}

