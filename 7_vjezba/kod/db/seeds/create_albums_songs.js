/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('albums_songs').del();
  await knex('albums_songs').insert([
    { album_id: 1, song_id: 1 },
    { album_id: 2, song_id: 2 },
    { album_id: 3, song_id: 3 },
  ]);
};
