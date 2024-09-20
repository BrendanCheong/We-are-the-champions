import { Request, Response } from 'express';
import Controller from '../../decorators/Controller';
import { Get } from '../../decorators/Methods';
import LoggingService from '../../services/LoggingService';

@Controller('logs')
class LoggingController {
  @Get('/')
  async getLogs(req: Request, res: Response) {
    try {
      const loggingService = new LoggingService();
      const { userId } = req.params;
      const logs = await loggingService.getUserLogs(userId);
      res.status(200).json(logs);
    } catch (error) {
      console.error('Error getting logs:', error);
      res.status(500).json({ error: 'An error occurred while getting logs' });
    }
  }
}

export default LoggingController;
