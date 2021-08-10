import UserController from '../UserController';
import * as request from 'supertest';
import express from 'express';

describe('the user controller', () => {
  const app = express();
  app.get('/users', function (req, res) {
    res.status(200).json({ name: 'john' });
  });
  const router = express.Router();
  const controller = new UserController(router);
  app.use('/api', router);
  const agent = request.agent(app);

  it('exists', () => {
    expect(controller).toBeDefined();
  });

  it('can get all users', (done) => {
    agent
      .get('/api/users')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        expect(response.body.length).toEqual(1);
        done();
      });
  });
});
