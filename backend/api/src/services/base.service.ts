import prisma from '../database/prisma';

export class BaseService {
  protected prisma = prisma;
}