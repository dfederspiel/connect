import { User } from '@prisma/client';
import { Router } from 'express';

export default class UserController {
  private path = '/users';
  private router: Router;

  constructor(router: Router) {
    this.router = router;
    this.initializeRoutes();
  }

  private initializeRoutes = () => {
    this.router.get(`${this.path}`, this.getAllUsers);
  };

  private getAllUsers = async (req: any, res: { json: (users: User[]) => void }) => {
    res.json([]);
  };
}
