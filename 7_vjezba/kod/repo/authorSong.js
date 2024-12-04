const db = require('../db');
const { getById: getAuthorById } = require('./author');
const { getById: getSongById } = require('./song');

async function getByAuthorId(authorId) {
  return db('authors_songs')
    .innerJoin('songs', 'authors_songs.song_id', 'songs.id')
    .innerJoin('authors', 'authors_songs.author_id', 'authors.id')
    .select(
      'authors_songs.*',
      'songs.name as song_name',
      'authors.name as author_name'
    )
    .where({ author_id: authorId });
}

async function create(authorId, songId) {
  const authorExists = await getAuthorById(authorId);
  if (!authorExists) {
    throw new Error(`Author with id ${authorId} does not exist.`);
  }

  const songExists = await getSongById(songId);
  if (!songExists) {
    throw new Error(`Song with id ${songId} does not exist.`);
  }

  await db('authors_songs').insert({
    author_id: authorId,
    song_id: songId,
  });

  return db('authors_songs')
    .where({ author_id: authorId, song_id: songId })
    .first();
}

async function remove(authorId, songId) {
  return db('authors_songs')
    .where({ author_id: authorId, song_id: songId })
    .del();
}

module.exports = {
  getByAuthorId,
  create,
  remove,
};
