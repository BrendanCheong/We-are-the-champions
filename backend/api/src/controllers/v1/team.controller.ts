import { Request, Response } from 'express';
import { ZodError } from 'zod';
import Controller from '../../decorators/Controller';
import { Post, Get } from '../../decorators/Methods';
import TeamService from '../../services/TeamService';
import { TeamsInputSchema } from '../../schema/TeamSchema';

@Controller('teams')
class TeamController {
  @Post('/')
  async createTeams(req: Request, res: Response): Promise<void> {
    try {
      const teamService = new TeamService();
      const validatedInput = TeamsInputSchema.parse(req.body);
      const createdTeams = await teamService.createTeams(validatedInput);
      res.status(201).json(createdTeams);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        console.error('Error creating teams:', error);
        res.status(500).json({ error: 'An error occurred while creating teams' });
      }
    }
  }

  @Get('/')
  async getTeams(req: Request, res: Response): Promise<void> {
    try {
      const teamService = new TeamService();
      const { userId } = req.params;
      const teams = await teamService.getTeamsAndGroup(userId);
      res.status(200).json(teams);
    } catch (error) {
      console.error('Error getting teams:', error);
      res.status(500).json({ error: 'An error occurred while getting teams' });
    }
  }
}

export default TeamController;
