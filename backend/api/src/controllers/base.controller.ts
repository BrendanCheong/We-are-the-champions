import { Request, Response } from 'express';

class BaseController {
  success(req: Request, res: Response, body: unknown) {
    res.status(200).json(body);
  }

  static processErrorCaught(req: Request, res: Response, err: Error) {
    const errorObj = {
      error: err.name,
      message: err.message,
    };

    // Respond with a 500 status code for now (you can extend this later)
    res.status(500).json(errorObj);
  }
}

export default BaseController;
