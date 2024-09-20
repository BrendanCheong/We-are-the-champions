import { Request, Response } from 'express';
import Controller from '../../decorators/Controller';
import RankingService from '../../services/RankingService';
import { Get } from '../../decorators/Methods';

@Controller('ranking')
class RankingController {
  @Get('/')
  async getRanking(req: Request, res: Response) {
    try {
      const rankingService = new RankingService();
      const { userId } = req.params;
      const ranking = await rankingService.getRanking(userId);
      res.status(200).json(ranking);
    } catch (error) {
      console.error('Error getting ranking:', error);
      res.status(500).json({ error: 'An error occurred while getting ranking' });
    }
  }
}

export default RankingController;
