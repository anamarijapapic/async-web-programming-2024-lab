const db = require('../db');

async function get() {
  return db('authors').select();
}

async function getById(authorId) {
  return db('authors').where({ id: authorId }).first();
}

async function create(body) {
  const createdAuthorId = (
    await db('authors').insert({
      name: body.name,
    })
  )?.[0];

  return getById(createdAuthorId);
}

async function update(authorId, body) {
  await db('authors').where({ id: authorId }).update({
    name: body.name,
  });

  return getById(authorId);
}

async function remove(authorId) {
  return db('authors').where({ id: authorId }).del();
}

module.exports = {
  get,
  getById,
  create,
  update,
  remove,
};
