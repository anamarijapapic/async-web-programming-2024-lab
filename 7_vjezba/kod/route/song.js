const Router = require('@koa/router');
const Joi = require('joi');
const authMiddlewareJwtCheck = require('../middleware/auth');
const validationMiddleware = require('../middleware/validate');
const songRepo = require('../repo/song');

const router = new Router();

// GET /songs
router.get('/songs', async (ctx) => {
  ctx.body = await songRepo.get();
});

// GET /songs/:songId
router.get(
  '/songs/:songId',
  validationMiddleware.params({
    songId: Joi.number().integer().required(),
  }),
  async (ctx) => {
    const songId = ctx.params.songId;
    ctx.body = await songRepo.getById(songId);
  }
);

// POST /songs
router.post(
  '/songs',
  authMiddlewareJwtCheck,
  validationMiddleware.body({
    name: Joi.string().required(),
  }),
  async (ctx) => {
    const body = ctx.request.body;
    ctx.body = await songRepo.create(body);
  }
);

// PUT /songs/:songId
router.put(
  '/songs/:songId',
  authMiddlewareJwtCheck,
  validationMiddleware.params({
    songId: Joi.number().integer().required(),
  }),
  validationMiddleware.body({
    name: Joi.string().required(),
  }),
  async (ctx) => {
    const songId = ctx.params.songId;
    const body = ctx.request.body;
    ctx.body = await songRepo.update(songId, body);
  }
);

// DELETE /songs/:songId
router.delete(
  '/songs/:songId',
  authMiddlewareJwtCheck,
  validationMiddleware.params({
    songId: Joi.number().integer().required(),
  }),
  async function (ctx) {
    const songId = ctx.params.songId;
    ctx.body = await songRepo.remove(songId);
  }
);

module.exports = router;
