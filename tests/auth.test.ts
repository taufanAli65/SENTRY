import request from 'supertest';
import express from 'express';
import authRouter from '../api/routes/auth';

const app = express();
app.use(express.json());
app.use('/auth', authRouter);

describe('Auth Routes', () => {
  it('should return 400 if required fields are missing on register', async () => {
    const res = await request(app).post('/auth/register').send({});
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  it('should return 400 if required fields are missing on login', async () => {
    const res = await request(app).post('/auth/login').send({});
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });
});
