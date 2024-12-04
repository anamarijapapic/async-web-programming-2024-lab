/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('authors_songs', (table) => {
    table.integer('author_id').unsigned().notNullable();
    table.integer('song_id').unsigned().notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());

    table.primary(['author_id', 'song_id']);

    table.foreign('author_id').references('id').inTable('authors');
    table.foreign('song_id').references('id').inTable('songs');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('authors_songs');
};
