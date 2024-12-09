const Router = require('@koa/router');
const Joi = require('joi');
const validationMiddleware = require('../middleware/validate');
const authorRepo = require('../repo/author');

const router = new Router();

// GET /authors
router.get('/authors', async (ctx) => {
  ctx.body = await authorRepo.get();
});

// GET /authors/:authorId
router.get(
  '/authors/:authorId',
  validationMiddleware.params({
    authorId: Joi.number().integer().required(),
  }),
  async (ctx) => {
    const authorId = ctx.params.authorId;
    ctx.body = await authorRepo.getById(authorId);
  }
);

// POST /authors
router.post(
  '/authors',
  validationMiddleware.body({
    name: Joi.string().required(),
  }),
  async (ctx) => {
    const body = ctx.request.body;
    ctx.body = await authorRepo.create(body);
  }
);

// PUT /authors/:authorId
router.put(
  '/authors/:authorId',
  validationMiddleware.params({
    authorId: Joi.number().integer().required(),
  }),
  validationMiddleware.body({
    name: Joi.string().required(),
  }),
  async (ctx) => {
    const authorId = ctx.params.authorId;
    const body = ctx.request.body;
    ctx.body = await authorRepo.update(authorId, body);
  }
);

// DELETE /authors/:authorId
router.delete(
  '/authors/:authorId',
  validationMiddleware.params({
    authorId: Joi.number().integer().required(),
  }),
  async function (ctx) {
    const authorId = ctx.params.authorId;
    ctx.body = await authorRepo.remove(authorId);
  }
);

module.exports = router;
