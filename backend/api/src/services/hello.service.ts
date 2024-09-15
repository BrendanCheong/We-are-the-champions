import { BaseService } from "./base.service";
import { faker } from '@faker-js/faker';

export class HelloService extends BaseService {
  async getHelloMessage(): Promise<string> {
    const name = faker.company.name();
    await this.prisma.team.create({
      data: {
        name,
        registrationDate: new Date(),
        groupNumber: 2,
      },
    });
    return 'Hello World';
  }
}
