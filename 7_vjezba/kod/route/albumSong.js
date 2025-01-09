const Router = require('@koa/router');
const Joi = require('joi');
const authMiddlewareJwtCheck = require('../middleware/auth');
const validationMiddleware = require('../middleware/validate');
const albumSongsRepo = require('../repo/albumSong');

const router = new Router();

// GET /albums/:albumId/songs
router.get(
  '/albums/:albumId/songs',
  validationMiddleware.params({
    albumId: Joi.number().integer().required(),
  }),
  async (ctx) => {
    const albumId = ctx.params.albumId;
    ctx.body = await albumSongsRepo.getByAlbumId(albumId);
  }
);

// POST /albums/:albumId/songs/:songId
router.post(
  '/albums/:albumId/songs/:songId',
  authMiddlewareJwtCheck,
  validationMiddleware.params({
    albumId: Joi.number().integer().required(),
    songId: Joi.number().integer().required(),
  }),
  async (ctx) => {
    const albumId = ctx.params.albumId;
    const songId = ctx.params.songId;
    ctx.body = await albumSongsRepo.create(albumId, songId);
  }
);

module.exports = router;
