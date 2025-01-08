const Router = require('@koa/router');
const Joi = require('joi');
const CustomError = require('../customError');
const authMiddlewareJwtCheck = require('../middleware/auth');
const validationMiddleware = require('../middleware/validate');
const resourceLockRepo = require('../repo/resourceLock');
const authorRepo = require('../repo/author');
const songRepo = require('../repo/song');

const router = new Router();

// GET /resource-locks
router.get('/resource-locks', async (ctx) => {
  ctx.body = await resourceLockRepo.get();
});

// GET /resource-locks/:resourceLockId
router.get(
  '/resource-locks/:resourceLockId',
  validationMiddleware.params({
    resourceLockId: Joi.number().integer().required(),
  }),
  async (ctx) => {
    const resourceLockId = ctx.params.resourceLockId;
    ctx.body = await resourceLockRepo.getById(resourceLockId);
  }
);

// POST /resource-locks
router.post(
  '/resource-locks',
  authMiddlewareJwtCheck,
  validationMiddleware.body({
    resource_type: Joi.string().valid('author', 'song'),
    resource_id: Joi.number().integer().required(),
  }),
  async (ctx) => {
    const userId = ctx.state.user.id;
    if (!userId) {
      throw new CustomError(401, 'User not authenticated');
    }

    const resourceType = ctx.request.body.resource_type;
    const resourceId = ctx.request.body.resource_id;
    // Check if resource exists
    if (
      (resourceType === 'author' && !(await authorRepo.getById(resourceId))) ||
      (resourceType === 'song' && !(await songRepo.getById(resourceId)))
    ) {
      throw new CustomError(
        404,
        `Not found: ${resourceType} with id ${resourceId}`
      );
    }

    ctx.body = await resourceLockRepo.create(resourceType, resourceId, userId);
  }
);

// DELETE /resource-locks/:resourceId -> resourceId is ambiguous (could be authorId or songId)
// DELETE /resource-locks/:resourceLockId
router.delete(
  '/resource-locks/:resourceLockId',
  authMiddlewareJwtCheck,
  validationMiddleware.params({
    resourceLockId: Joi.number().integer().required(),
  }),
  async (ctx) => {
    const userId = ctx.state.user.id;
    if (!userId) {
      throw new CustomError(401, 'User not authenticated');
    }

    const resourceLockId = ctx.params.resourceLockId;

    // Users can only remove their own records from the resource_locks table
    const resourceLock = await resourceLockRepo.getById(resourceLockId);
    if (resourceLock.user_id !== userId) {
      throw new CustomError(403, 'Lock does not belong to the current user');
    }

    ctx.body = await resourceLockRepo.remove(resourceLockId);
  }
);

module.exports = router;
