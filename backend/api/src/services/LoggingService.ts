import { Log } from '@prisma/client';
import LogRepository from '../repositories/LogRepository';

interface LogInput {
  userId: string;
  actionType: string;
  tableName: string;
  recordId: string;
  details?: string;
}

export default class LoggingService {
  private loggingRepository: LogRepository;

  constructor(loggingRepository: LogRepository) {
    this.loggingRepository = loggingRepository;
  }

  async log(input: LogInput): Promise<Log> {
    return this.loggingRepository.createLog({
      userId: input.userId,
      actionType: input.actionType,
      tableName: input.tableName,
      recordId: input.recordId,
      details: input.details,
    });
  }

  async getUserLogs(userId: string): Promise<Log[]> {
    return this.loggingRepository.getLogsByUserId(userId);
  }

  async getLogById(id: string): Promise<Log | null> {
    return this.loggingRepository.getLogById(id);
  }

  async deleteLog(id: string): Promise<Log> {
    return this.loggingRepository.deleteLog(id);
  }

  async clearUserLogs(userId: string): Promise<number> {
    const result = await this.loggingRepository.deleteLogsByUserId(userId);
    return result.count;
  }
}
