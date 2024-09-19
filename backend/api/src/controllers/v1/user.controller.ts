// src/controllers/UserController.ts
import { Request, Response } from 'express';
import Controller from '../../decorators/Controller';
import { Get, Post } from '../../decorators/Methods';

@Controller('users')
class UserController {
  @Get('/')
  async getAllUsers(req: Request, res: Response): Promise<void> {
    // Logic to get all users
    res.json({ message: 'Get all users' });
  }

  @Get('/:id')
  async getUserById(req: Request, res: Response): Promise<void> {
    const userId = req.params.id;
    // Logic to get user by ID
    res.json({ message: `Get user with ID: ${userId}` });
  }

  @Post('/')
  async createUser(req: Request, res: Response): Promise<void> {
    // Logic to create a new user
    res.json({ message: 'User created' });
  }
}

export default UserController;
