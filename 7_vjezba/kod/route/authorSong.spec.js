const { expect } = require('chai');
const authorSongRepo = require('../repo/authorSong');

describe('Author Song Routes', () => {
  let createdAuthorSong;

  before(async () => {
    // authorId = 4, songId = 4 (from the seed)
    createdAuthorSong = await authorSongRepo.create(4, 4);
  });

  describe('GET /authors/:authorId/songs', () => {
    it('should fetch all songs by author', async () => {
      const response = await global.api
        .get(`/authors/${createdAuthorSong.author_id}/songs`)
        .expect(200);

      console.log(response.body);
      expect(response.body).to.be.an('array');
      expect(response.body.length > 0).to.be.true;
      expect(Object.keys(response.body[0])).to.deep.equal([
        'author_id',
        'song_id',
        'created_at',
        'author_name',
        'song_name',
      ]);
    });
  });

  describe('POST /authors/:authorId/songs/:songId', () => {
    it('should create a new author - song relation', async () => {
      const authorId = 5; // should be created in the seed
      const songId = 5; // should be created in the seed
      const response = await global.api
        .post(`/authors/${authorId}/songs/${songId}`)
        .expect(200);

      expect(response.body.author_id).to.equal(authorId);
      expect(response.body.song_id).to.equal(songId);
    });
  });

  describe('DELETE /authors/:authorId/songs/:songId', () => {
    it('should delete the author - song relation', async () => {
      const response = await global.api
        .delete(
          `/authors/${createdAuthorSong.author_id}/songs/${createdAuthorSong.song_id}`
        )
        .expect(200);

      expect(response.body > 0).to.be.true;
    });
  });
});
