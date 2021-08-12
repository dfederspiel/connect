import { Request, Response } from 'express';
import { UserContext } from '../UserContext';

describe('the user context', () => {
  it('allows traffic when user context is set', (done) => {
    UserContext(
      {} as unknown as Request,
      {
        locals: { user: 'david@codefly.ninja' },
      } as unknown as Response,
      () => {
        done();
      },
    );
  });
  it('rejects traffic when user context is NOT set', (done) => {
    UserContext(
      {} as unknown as Request,
      {
        sendStatus: (status: number) => {
          expect(status).toEqual(403);
          done();
        },
      } as unknown as Response,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      () => {},
    );
  });
});
