const db = require('../db');

async function get() {
  return db('albums').select();
}

async function getById(albumId) {
  return db('albums').where({ id: albumId }).first();
}

async function create(body) {
  const createdAlbumId = (
    await db('albums').insert({
      name: body.name,
    })
  )?.[0];

  return getById(createdAlbumId);
}

module.exports = {
  get,
  getById,
  create,
};
