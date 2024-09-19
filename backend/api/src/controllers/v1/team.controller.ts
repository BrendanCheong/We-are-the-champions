import { Request, Response } from 'express';
import { ZodError } from 'zod';
import Controller from '../../decorators/Controller';
import { Post } from '../../decorators/Methods';
import TeamService from '../../services/TeamService';
import { TeamsInputSchema } from '../../schema/TeamSchema';

@Controller('teams')
class TeamController {
  private teamService: TeamService;

  constructor(teamService: TeamService) {
    this.teamService = teamService;
  }

  @Post('/')
  async createTeams(req: Request, res: Response): Promise<void> {
    try {
      const validatedInput = TeamsInputSchema.parse(req.body);
      const createdTeams = await this.teamService.createTeams(validatedInput);
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
}

export default TeamController;
