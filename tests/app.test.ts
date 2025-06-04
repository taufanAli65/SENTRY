import request from 'supertest';
import express from 'express';
import indexRouter from '../api/routes/index';

const app = express();
app.use('/', indexRouter);

describe('Index Route', () => {
  it('should return API development message', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Api on development');
  });
});
