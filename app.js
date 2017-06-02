import Koa from 'koa';
import co from 'co';
import convert from 'koa-convert';
import json from 'koa-json';
import bodyparser from 'koa-bodyparser';
import logger from 'koa-logger';
import cors from 'koa-cors';

import config from './config';
import * as spotify from './spotify';

const app = new Koa();
const router = require('koa-router')();

app.use(convert(cors()));
app.use(convert(bodyparser()));
app.use(convert(json()));
app.use(convert(logger()));

app.use(co.wrap(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
}));

router.get('/', async (ctx) => {
  ctx.body = `BlockParty API ${process.env.npm_package_version}`;
});

router.get('/spotify', async (ctx) => {
  try {
    const query = ctx.request.query;

    if (!query.code || !query.state) {
      throw {
        status: 400,
        message: 'missing required parameters',
      };
    }

    const { access_token, refresh_token } = await spotify.authorize(query.code, query.state);

    console.log('authorize', access_token, refresh_token);

    ctx.response.redirect(`${query.state}?access_token=${access_token}&refresh_token=${refresh_token}`);
  } catch (err) {
    ctx.body = {
      message: err.message,
      success: false,
    };

    ctx.status = err.status || 500;
  }
});

router.post('/spotify/refresh', async (ctx) => {
  try {
    const token = ctx.request.body.token;

    if (!token) {
      throw {
        status: 400,
        message: 'missing required parameters',
      };
    }

    const { access_token, refresh_token } = await spotify.refresh(token);

    ctx.body = {
      access_token,
      refresh_token,
    };
  } catch (err) {
    ctx.body = {
      message: err.message,
      success: false,
    };

    ctx.status = err.status || 500;
  }
});

app.use(router.routes(), router.allowedMethods());

app.on('error', (err, ctx) => {
  console.log('server error', err, ctx);
});

export default app;
