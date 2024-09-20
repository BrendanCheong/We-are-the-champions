import { Request, Response } from 'express';
import Controller from '../../decorators/Controller';
import { Delete } from '../../decorators/Methods';
import DeleteService from '../../services/DeleteService';

@Controller('delete-all')
class DeleteController {
  @Delete('/')
  async deleteAll(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const deleteService = new DeleteService();
      await deleteService.deleteAllMatchesGroupsTeams(userId);
      res.status(204).end();
    } catch (error) {
      console.error('Error deleting all teams:', error);
      res.status(500).json({ error: 'An error occurred while deleting all teams' });
    }
  }
}

export default DeleteController;
