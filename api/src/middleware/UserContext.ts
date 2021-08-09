import express, { NextFunction } from 'express';

export const UserContext = (
  req: express.Request,
  res: express.Response,
  next: NextFunction,
) => {
  const user = res.locals.user;
  console.log('[USER OBJECT]', user);
  if (user) next();
  else res.sendStatus(403);
};
