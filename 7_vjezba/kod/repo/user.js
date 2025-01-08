const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SALT_ROUNDS = 10;

function hashPassword(password) {
  return bcrypt.hash(password, SALT_ROUNDS);
}

function comparePasswords(password, hash) {
  return bcrypt.compare(password, hash);
}

function generateToken(user) {
  return jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: '3h',
  });
}

async function get() {
  return db('users').select();
}

async function getById(userId) {
  return db('users').where({ id: userId }).first();
}

async function getByEmail(email) {
  return db('users').where({ email }).first();
}

async function create(body) {
  const createdUserId = (
    await db('users').insert({
      email: body.email,
      password: await hashPassword(body.password),
    })
  )?.[0];

  return getById(createdUserId);
}

module.exports = {
  get,
  getById,
  getByEmail,
  create,
  hashPassword,
  comparePasswords,
  generateToken,
};
