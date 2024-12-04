/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('songs').del();
  await knex('songs').insert([
    { id: 1, name: 'Song 1' },
    { id: 2, name: 'Song 2' },
    { id: 3, name: 'Song 3' },
    { id: 4, name: 'Song 4' },
    { id: 5, name: 'Song 5' },
  ]);
};
