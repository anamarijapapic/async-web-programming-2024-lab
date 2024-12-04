const db = require('../db');

async function get() {
  return db('songs').select();
}

async function getById(songId) {
  return db('songs').where({ id: songId }).first();
}

async function create(body) {
  const createdSongId = (
    await db('songs').insert({
      name: body.name,
    })
  )?.[0];

  return getById(createdSongId);
}

async function update(songId, body) {
  await db('songs').where({ id: songId }).update({
    name: body.name,
  });

  return getById(songId);
}

async function remove(songId) {
  return db('songs').where({ id: songId }).del();
}

module.exports = {
  get,
  getById,
  create,
  update,
  remove,
};
