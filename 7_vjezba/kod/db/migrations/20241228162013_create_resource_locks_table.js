/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('resource_locks', (table) => {
    table.increments('id');
    table.enu('resource_type', ['author', 'song']).notNullable(); // enum column, (aliased to enu, as enum is a reserved word in JavaScript)
    table.integer('resource_id').unsigned().notNullable();
    table.integer('user_id').unsigned().notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());

    // resource_id is a FK that references the id column in either the authors or songs table
    table.foreign('resource_id').references('id').inTable('authors');
    table.foreign('resource_id').references('id').inTable('songs');
    table.foreign('user_id').references('id').inTable('users');

    // A user can only lock a resource once
    table.unique(['resource_type', 'resource_id', 'user_id']);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('resource_locks');
};
