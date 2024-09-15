import { Request, Response } from 'express';
import { HelloService } from '../../services/hello.service';
import BaseController from '../base.controller';

export class HelloController extends BaseController {
  private helloService: HelloService;

  constructor() {
    super();
    this.helloService = new HelloService();
  }

  public getHello = async (req: Request, res: Response): Promise<void> => {
    try {
      const message = await this.helloService.getHelloMessage();
      this.success(req, res, { message });
    } catch (error) {
      console.error(error)
    }
  };
}
