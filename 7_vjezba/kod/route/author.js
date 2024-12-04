const Router = require('@koa/router');
const authorRepo = require('../repo/author');

const router = new Router();

// GET /authors
router.get('/authors', async (ctx) => {
  ctx.body = await authorRepo.get();
});

// GET /authors/:authorId
router.get('/authors/:authorId', async (ctx) => {
  const authorId = ctx.params.authorId;
  ctx.body = await authorRepo.getById(authorId);
});

// POST /authors
router.post('/authors', async (ctx) => {
  const body = ctx.request.body;
  ctx.body = await authorRepo.create(body);
});

// PUT /authors/:authorId
router.put('/authors/:authorId', async (ctx) => {
  const authorId = ctx.params.authorId;
  const body = ctx.request.body;
  ctx.body = await authorRepo.update(authorId, body);
});

// DELETE /authors/:authorId
router.delete('/authors/:authorId', async function (ctx) {
  const authorId = ctx.params.authorId;
  ctx.body = await authorRepo.remove(authorId);
});

module.exports = router;
