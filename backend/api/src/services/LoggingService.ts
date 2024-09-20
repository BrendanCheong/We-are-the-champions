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
  async log(input: LogInput): Promise<Log> {
    const loggingRepository = new LogRepository();
    return loggingRepository.createLog({
      userId: input.userId,
      actionType: input.actionType,
      tableName: input.tableName,
      recordId: input.recordId,
      details: input.details,
    });
  }

  async getUserLogs(userId: string): Promise<Log[]> {
    const loggingRepository = new LogRepository();
    return loggingRepository.getLogsByUserId(userId);
  }

  async getLogById(id: string): Promise<Log | null> {
    const loggingRepository = new LogRepository();
    return loggingRepository.getLogById(id);
  }

  async deleteLog(id: string): Promise<Log> {
    const loggingRepository = new LogRepository();
    return loggingRepository.deleteLog(id);
  }

  async clearUserLogs(userId: string): Promise<number> {
    const loggingRepository = new LogRepository();
    const result = await loggingRepository.deleteLogsByUserId(userId);
    return result.count;
  }
}
