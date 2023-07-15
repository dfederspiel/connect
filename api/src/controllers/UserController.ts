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

  private getAllUsers = async (req: any, res: any) => {
    res.json([
      {
        id: '1',
        domain: '',
        email: '',
      },
    ]);
  };
}
