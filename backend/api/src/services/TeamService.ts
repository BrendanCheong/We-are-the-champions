import { Team } from '@prisma/client';
import { parse, isValid } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import TeamRepository from '../repositories/TeamRepository';
import GroupRepository from '../repositories/GroupRepository';
import { TeamsInput } from '../schema/TeamSchema';
import LoggingService from './LoggingService';
import { MAXIMUM_AMOUNT_OF_GROUPS, MAXIMUM_AMOUNT_OF_TEAMS } from '../constants/global';

export default class TeamService {
  private teamRepository: TeamRepository;

  private groupRepository: GroupRepository;

  private loggingService: LoggingService;

  constructor(teamRepository: TeamRepository, groupRepository: GroupRepository, loggingService: LoggingService) {
    this.teamRepository = teamRepository;
    this.groupRepository = groupRepository;
    this.loggingService = loggingService;
  }

  async createTeams(input: TeamsInput): Promise<Team[]> {
    const existingTeams = await this.teamRepository.getTeamsByUserId(input.userId);
    const existingGroups = await this.groupRepository.getGroupsByUserId(input.userId);

    if (existingTeams.length + input.teams.length > MAXIMUM_AMOUNT_OF_TEAMS) {
      throw new Error(`Total number of teams cannot exceed ${MAXIMUM_AMOUNT_OF_TEAMS}`);
    }

    const newGroups = new Set(input.teams.map((t) => t.group));
    const allGroups = new Set([...existingGroups.map((g) => g.groupNumber), ...newGroups]);
    if (allGroups.size > MAXIMUM_AMOUNT_OF_GROUPS) {
      throw new Error(`Cannot have more than ${MAXIMUM_AMOUNT_OF_GROUPS} groups in total`);
    }

    const allTeamNames = new Set([...existingTeams.map((t) => t.name), ...input.teams.map((t) => t.name)]);
    if (allTeamNames.size !== existingTeams.length + input.teams.length) {
      throw new Error('Duplicate team names are not allowed (including existing teams)');
    }

    // Create new groups if necessary
    const groupsToCreate = Array.from(newGroups)
      .filter((groupNumber) => !existingGroups.some((existingGroup) => existingGroup.groupNumber === groupNumber))
      .map((groupNumber) => ({
        id: uuidv4(),
        groupNumber,
        userId: input.userId,
      }));

    if (groupsToCreate.length > 0) {
      await this.groupRepository.createManyGroups(groupsToCreate);
    }

    // Fetch all groups again to ensure we have the latest data
    const allUserGroups = await this.groupRepository.getGroupsByUserId(input.userId);
    const groupMap = new Map(allUserGroups.map((g) => [g.groupNumber, g.id]));

    const teamsToCreate = input.teams.map((team) => {
      const registrationDate = parse(team.registrationDate, 'dd/MM', new Date());

      if (!isValid(registrationDate)) {
        throw new Error(`Invalid registration date for team ${team.name}: ${team.registrationDate}`);
      }

      const groupId = groupMap.get(team.group);
      if (!groupId) {
        throw new Error(`Group ${team.group} not found for team ${team.name}`);
      }

      return {
        name: team.name,
        registrationDate,
        groupId,
        createdById: input.userId,
      };
    });

    const createdTeams = await this.teamRepository.createManyTeams(teamsToCreate);

    await this.loggingService.log({
      userId: input.userId,
      actionType: 'CREATE',
      tableName: 'Team',
      recordId: createdTeams.count.toString(),
      details: `Bulk creation of ${createdTeams.count} teams`,
    });

    const allTeams = await this.teamRepository.getTeamsByUserId(input.userId);
    return allTeams;
  }
}
