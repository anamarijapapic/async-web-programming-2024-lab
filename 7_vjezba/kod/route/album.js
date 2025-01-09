const Router = require('@koa/router');
const Joi = require('joi');
const authMiddlewareJwtCheck = require('../middleware/auth');
const validationMiddleware = require('../middleware/validate');
const albumRepo = require('../repo/album');

const router = new Router();

// GET /albums
router.get('/albums', async (ctx) => {
  ctx.body = await albumRepo.get();
});

// GET /albums/:albumId
router.get(
  '/albums/:albumId',
  validationMiddleware.params({
    albumId: Joi.number().integer().required(),
  }),
  async (ctx) => {
    const albumId = ctx.params.albumId;
    ctx.body = await albumRepo.getById(albumId);
  }
);

// POST /albums
router.post(
  '/albums',
  authMiddlewareJwtCheck,
  validationMiddleware.body({
    name: Joi.string().required(),
  }),
  async (ctx) => {
    const body = ctx.request.body;
    ctx.body = await albumRepo.create(body);
  }
);

module.exports = router;
