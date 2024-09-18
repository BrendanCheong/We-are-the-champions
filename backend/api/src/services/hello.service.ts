import { faker } from '@faker-js/faker';
import { BaseService } from './base.service';

export default class HelloService extends BaseService {
  async getHelloMessage(): Promise<string> {
    const name = faker.company.name();
    await this.prisma.team.create({
      data: {
        name,
        registrationDate: new Date(),
        groupNumber: 2,
      },
    });
    return 'Hi Mom!';
  }
}
