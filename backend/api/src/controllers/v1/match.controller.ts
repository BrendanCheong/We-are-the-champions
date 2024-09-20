import { Request, Response } from 'express';
import { ZodError } from 'zod';
import Controller from '../../decorators/Controller';
import { Get, Post, Put } from '../../decorators/Methods';
import { MatchesInputSchema, MatchPutRequest, MatchPutSchema } from '../../schema/MatchSchema';
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

  @Put('/:userId/:matchId')
  async updateMatch(req: Request, res: Response): Promise<void> {
    try {
      const matchService = new MatchService();
      const { matchId, userId } = req.params;

      // Validate the request body
      const validationResult = MatchPutSchema.safeParse({ ...req.body, matchId, userId });

      if (!validationResult.success) {
        res.status(400).json({ error: 'Invalid request data', details: validationResult.error.errors });
        return;
      }

      const updateData: MatchPutRequest = validationResult.data;
      await matchService.updateMatch({ ...updateData, matchId });

      res.status(201).end();
    } catch (error) {
      console.error('Error updating match:', error);
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'An error occurred while updating the match' });
      }
    }
  }
}

export default MatchController;
