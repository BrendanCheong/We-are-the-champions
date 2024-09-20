import { Request, Response } from 'express';
import { ZodError } from 'zod';
import Controller from '../../decorators/Controller';
import { Get, Post } from '../../decorators/Methods';
import { MatchesInputSchema } from '../../schema/MatchSchema';
import MatchService from '../../services/MatchService';

@Controller('matches')
class MatchController {
  @Post('/')
  async createMatches(req: Request, res: Response): Promise<void> {
    try {
      const matchService = new MatchService();
      const validatedInput = MatchesInputSchema.parse(req.body);
      const createdMatches = await matchService.createMatches(validatedInput);
      res.status(201).json(createdMatches);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        console.error('Error creating matches:', error);
        res.status(500).json({ error: 'An error occurred while creating matches' });
      }
    }
  }

  @Get('/')
  async getMatches(req: Request, res: Response): Promise<void> {
    try {
      const matchService = new MatchService();
      const { userId } = req.params;
      const matches = await matchService.getMatches(userId);
      res.status(200).json(matches);
    } catch (error) {
      console.error('Error getting matches:', error);
      res.status(500).json({ error: 'An error occurred while getting matches' });
    }
  }
}

export default MatchController;
