const Router = require('@koa/router');
const authorSongsRepo = require('../repo/authorSong');

const router = new Router();

// GET /authors/:authorId/songs
router.get('/authors/:authorId/songs', async (ctx) => {
  const authorId = ctx.params.authorId;
  ctx.body = await authorSongsRepo.getByAuthorId(authorId);
});

// POST /authors/:authorId/songs/:songId
router.post('/authors/:authorId/songs/:songId', async (ctx) => {
  const authorId = ctx.params.authorId;
  const songId = ctx.params.songId;
  ctx.body = await authorSongsRepo.create(authorId, songId);
});

// DELETE /authors/:authorId/songs/:songId
router.delete('/authors/:authorId/songs/:songId', async (ctx) => {
  const authorId = ctx.params.authorId;
  const songId = ctx.params.songId;
  ctx.body = await authorSongsRepo.remove(authorId, songId);
});

module.exports = router;
