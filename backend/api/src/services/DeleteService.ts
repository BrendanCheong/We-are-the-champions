import prisma from '../database/prisma';

export default class DeleteService {
  async deleteAllMatchesGroupsTeams(userId: string) {
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

    return deleted;
    return deleted;
  }
}
