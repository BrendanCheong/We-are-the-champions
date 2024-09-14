import { Request, Response } from 'express';

class BaseController {
  // Method to send success response
  success(req: Request, res: Response, body: any) {
    res.status(200).json(body);
  }

  // Method to handle errors (simplified for now)
  processErrorCaught(req: Request, res: Response, err: Error) {
    const errorObj = {
      error: err.name,
      message: err.message,
    };

    // Respond with a 500 status code for now (you can extend this later)
    res.status(500).json(errorObj);
  }
}

export default BaseController;