/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('authors_songs').del();
  await knex('authors_songs').insert([
    { author_id: 1, song_id: 1 },
    { author_id: 2, song_id: 2 },
    { author_id: 3, song_id: 3 },
  ]);
};
