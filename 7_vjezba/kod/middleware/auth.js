const jwt = require('jsonwebtoken');

async function jwtCheck(ctx, next) {
  const authToken = ctx.headers.authorization?.split(' ')[1];

  if (!authToken) {
    ctx.throw(401, 'Authorization token not provided.');
  }

  try {
    const decoded = jwt.verify(authToken, process.env.JWT_SECRET);
    ctx.state.user = decoded;
    // console.log('User data:', ctx.state.user);
  } catch (err) {
    ctx.throw(401, 'Invalid authorization token.');
  }

  return next();
}

module.exports = jwtCheck;
