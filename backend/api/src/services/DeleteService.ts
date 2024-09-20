import prisma from '../database/prisma';
import LoggingService from './LoggingService';

export default class DeleteService {
  async deleteAllMatchesGroupsTeams(userId: string) {
    const loggingService = new LoggingService();
    const deleted = await prisma.$transaction(async (tx) => {
      // Delete matches first
      const deletedMatches = await tx.match.deleteMany({
        where: { createdById: userId },
      });

      // Delete teams next
      const deletedTeams = await tx.team.deleteMany({
        where: { createdById: userId },
      });

      // Delete groups last
      const deletedGroups = await tx.group.deleteMany({
        where: { userId },
      });

      return {
        deletedMatches: deletedMatches.count,
        deletedTeams: deletedTeams.count,
        deletedGroups: deletedGroups.count,
      };
    });
    // Log the deletion
    await loggingService.log({
      userId,
      actionType: 'DELETE',
      tableName: 'ALL',
      recordId: userId,
      details: `Deleted ${deleted.deletedMatches} matches, ${deleted.deletedTeams} teams, and ${deleted.deletedGroups} groups.`,
    });

    return deleted;
  }
}
