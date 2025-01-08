const resourceLockRepo = require('../repo/resourceLock');

async function pessimisticLockCheck(ctx, next) {
  const userId = ctx.state.user.id;
  if (!userId) {
    ctx.throw(401, 'User not authenticated');
  }

  let resourceId;
  const resourceType = ctx.request.path.split('/')[1].slice(0, -1);
  if (resourceType === 'author') {
    resourceId = ctx.params.authorId;
  } else if (resourceType === 'song') {
    resourceId = ctx.params.songId;
  }

  // Check if resource is locked
  const resourceLocks = await resourceLockRepo.getByResource(
    resourceType,
    resourceId
  );

  const isResourceLocked = resourceLocks.length > 0;

  // Allow access to the resource if it is not locked
  if (!isResourceLocked) {
    await next();
    return;
  }

  // Multiple users can lock the same resource
  // Deadlocks are possible => trying to resolve them by giving priority to the first lock (FIFO)
  if (isResourceLocked) {
    const resourceLock = resourceLocks[0]; // Give priority to the first lock
    if (resourceLock.user_id !== userId) {
      ctx.throw(423, 'Resource locked!'); // 423 Locked
    }

    // Allow access to the resource if the current user has locked it first
    // The user should release the lock after the operation is done
  }

  await next();
}

module.exports = pessimisticLockCheck;
