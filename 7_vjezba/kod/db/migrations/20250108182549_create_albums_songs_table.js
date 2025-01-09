/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('albums_songs', (table) => {
    table.integer('album_id').unsigned().notNullable();
    table.integer('song_id').unsigned().notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());

    table.primary(['album_id', 'song_id']);

    table.foreign('album_id').references('id').inTable('albums');
    table.foreign('song_id').references('id').inTable('songs');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('albums_songs');
};
