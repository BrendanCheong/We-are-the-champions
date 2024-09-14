import { Router } from 'express';
import { HelloController } from '../../controllers/v1/hello.controller';

const router = Router();
const helloController = new HelloController();

router.get('/hello', helloController.getHello);

export default router;