/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('albums').del();
  await knex('albums').insert([
    { id: 1, name: 'Album 1' },
    { id: 2, name: 'Album 2' },
    { id: 3, name: 'Album 3' },
    { id: 4, name: 'Album 4' },
    { id: 5, name: 'Album 5' },
  ]);
};
