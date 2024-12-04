/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('authors').del();
  await knex('authors').insert([
    { id: 1, name: 'Author 1' },
    { id: 2, name: 'Author 2' },
    { id: 3, name: 'Author 3' },
    { id: 4, name: 'Author 4' },
    { id: 5, name: 'Author 5' },
  ]);
};
