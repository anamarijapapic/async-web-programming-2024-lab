const { expect } = require('chai');
const resourceLockRepo = require('../repo/resourceLock');

describe('Resource Lock Routes', () => {
  let createdResourceLock;

  before(async () => {
    // authorId = 4, userId = 1 (from the seed)
    createdResourceLock = await resourceLockRepo.create('author', 4, 1);
  });

  describe('GET /resource-locks', () => {
    it('should fetch all resource locks', async () => {
      const response = await global.api.get('/resource-locks').expect(200);

      expect(response.body).to.be.an('array');
      expect(Object.keys(response.body[0])).to.deep.equal([
        'id',
        'resource_type',
        'resource_id',
        'user_id',
        'created_at',
      ]);
    });
  });

  describe('GET /resource-locks/:resourceId', () => {
    it('should fetch all locks for the resource', async () => {
      const response = await global.api
        .get(`/resource-locks/${createdResourceLock.id}`)
        .expect(200);

      expect(response.body).to.deep.equal(createdResourceLock);
    });
  });

  describe('POST /resource-locks', () => {
    const resourceType = 'author';
    const resourceId = 5; // should be created in the seed

    it('should require authorization', async () => {
      await global.api.post(`/resource-locks`).expect(401);
    });

    it('should create a new resource lock', async () => {
      const response = await global.api
        .post(`/resource-locks`)
        .auth(global.authToken, { type: 'bearer' })
        .send({ resource_type: resourceType, resource_id: resourceId })
        .expect(200);

      expect(response.body.resource_type).to.equal(resourceType);
      expect(response.body.resource_id).to.equal(resourceId);
    });
  });

  describe('DELETE /resource-locks/:resourceId', () => {
    it('should require authorization', async () => {
      await global.api
        .delete(`/resource-locks/${createdResourceLock.id}`)
        .expect(401);
    });

    it('should delete the resource lock', async () => {
      const response = await global.api
        .delete(`/resource-locks/${createdResourceLock.id}`)
        .auth(global.authToken, { type: 'bearer' })
        .expect(200);

      expect(response.body > 0).to.be.true;
      const fetchedResourceLock = await resourceLockRepo.getById(
        createdResourceLock.id
      );
      expect(fetchedResourceLock).to.be.undefined;
    });
  });
});
