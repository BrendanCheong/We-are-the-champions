import { Request, Response } from 'express';
import Controller from '../../decorators/Controller';
import { Get, Post } from '../../decorators/Methods';

@Controller('users')
class UserController {
  @Get('/')
  async getAllUsers(req: Request, res: Response): Promise<void> {
    res.json({ message: 'Get all users' });
  }

  @Get('/:id')
  async getUserById(req: Request, res: Response): Promise<void> {
    const userId = req.params.id;
    res.json({ message: `Get user with ID: ${userId}` });
  }

  @Post('/')
  async createUser(req: Request, res: Response): Promise<void> {
    res.json({ message: 'User created' });
  }
}

export default UserController;
