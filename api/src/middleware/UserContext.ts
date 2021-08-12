import { Request, Response, NextFunction } from 'express';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const UserContext = (_req: Request, res: Response, next: NextFunction) => {
  const user = res.locals?.user;
  if (user) next();
  else res.sendStatus(403);
};
