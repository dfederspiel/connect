import { User } from '@prisma/client';
import { Router } from 'express';
import { IUserDataContext } from '../data/UserDataContext';

export default class UserController {
  private path = '/users';
  private router: Router;
  private context: IUserDataContext;

  constructor(router: Router, context: IUserDataContext) {
    this.router = router;
    this.context = context;
    this.initializeRoutes();
  }

  private initializeRoutes = () => {
    this.router.get(`${this.path}`, this.getAllUsers);
  };

  private getAllUsers = async (req: any, res: { json: (users: User[]) => void }) => {
    res.json(await this.context.getAll());
  };
}
