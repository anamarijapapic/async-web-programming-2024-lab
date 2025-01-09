require('dotenv-safe').config();
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');

const app = new Koa();

app.use(bodyParser());

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    // console.error(err);
    ctx.status = err.statusCode || err.status || 500;
    ctx.body = {
      message: err.message,
    };
  }
});

app.use(require('./route/index').routes());
app.use(require('./route/author').routes());
app.use(require('./route/song').routes());
app.use(require('./route/authorSong').routes());
app.use(require('./route/user').routes());
app.use(require('./route/resourceLock').routes());
app.use(require('./route/album').routes());
app.use(require('./route/albumSong').routes());

module.exports = app;
