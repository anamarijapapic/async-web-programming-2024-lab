const db = require('../db');
const { getById: getAlbumById } = require('./album');
const { getById: getSongById } = require('./song');

async function getByAlbumId(albumId) {
  return db('albums_songs')
    .innerJoin('songs', 'albums_songs.song_id', 'songs.id')
    .innerJoin('albums', 'albums_songs.album_id', 'albums.id')
    .innerJoin('authors_songs', 'albums_songs.song_id', 'authors_songs.song_id')
    .innerJoin('authors', 'authors_songs.author_id', 'authors.id')
    .select(
      'albums_songs.*',
      'albums.name as album_name',
      'songs.name as song_name',
      'authors.name as author_name'
    )
    .where({ album_id: albumId });
}

async function create(albumId, songId) {
  const albumExists = await getAlbumById(albumId);
  if (!albumExists) {
    throw new Error(`Album with id ${albumId} does not exist.`);
  }

  const songExists = await getSongById(songId);
  if (!songExists) {
    throw new Error(`Song with id ${songId} does not exist.`);
  }

  await db('albums_songs').insert({
    album_id: albumId,
    song_id: songId,
  });

  return db('albums_songs')
    .where({ album_id: albumId, song_id: songId })
    .first();
}

module.exports = {
  getByAlbumId,
  create,
};
