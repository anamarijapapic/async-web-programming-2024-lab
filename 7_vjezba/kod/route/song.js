const Router = require('@koa/router');
const songRepo = require('../repo/song');

const router = new Router();

// GET /songs
router.get('/songs', async (ctx) => {
  ctx.body = await songRepo.get();
});

// GET /songs/:songId
router.get('/songs/:songId', async (ctx) => {
  const songId = ctx.params.songId;
  ctx.body = await songRepo.getById(songId);
});

// POST /songs
router.post('/songs', async (ctx) => {
  const body = ctx.request.body;
  ctx.body = await songRepo.create(body);
});

// PUT /songs/:songId
router.put('/songs/:songId', async (ctx) => {
  const songId = ctx.params.songId;
  const body = ctx.request.body;
  ctx.body = await songRepo.update(songId, body);
});

// DELETE /songs/:songId
router.delete('/songs/:songId', async function (ctx) {
  const songId = ctx.params.songId;
  ctx.body = await songRepo.remove(songId);
});

module.exports = router;
