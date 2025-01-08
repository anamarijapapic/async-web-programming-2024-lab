const db = require('../db');

async function get() {
  return db('resource_locks').select();
}

async function getById(resourceLockId) {
  return db('resource_locks').where({ id: resourceLockId }).first();
}

async function getByResource(resourceType, resourceId) {
  return db('resource_locks').where({
    resource_type: resourceType,
    resource_id: resourceId,
  });
}

async function create(resourceType, resourceId, userId) {
  const createdResourceLockId = (
    await db('resource_locks').insert({
      resource_type: resourceType,
      resource_id: resourceId,
      user_id: userId,
    })
  )?.[0];

  return getById(createdResourceLockId);
}

async function remove(resourceLockId) {
  return db('resource_locks').where({ id: resourceLockId }).del();
}

module.exports = {
  get,
  getById,
  getByResource,
  create,
  remove,
};
