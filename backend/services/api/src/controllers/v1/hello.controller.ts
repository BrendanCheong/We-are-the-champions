import { Request, Response } from 'express';
import { HelloService } from '../../services/hello.service';
import BaseController from '../base.controller';

export class HelloController extends BaseController {
  private helloService: HelloService;

  constructor() {
    super();
    this.helloService = new HelloService();
  }

  public getHello = (req: Request, res: Response): void => {
    try {
      const message = this.helloService.getHelloMessage();
      this.success(req, res, { message });
    } catch (error) {
      if (error instanceof Error) {
        this.processErrorCaught(req, res, error);
      }
    }
  };
}
