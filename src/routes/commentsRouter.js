import { Router } from 'express';
import { methods as commentsController } from '../controllers/commentsController';

const commentsRouter = Router();

commentsRouter.get('/', commentsController.getAll);

export default commentsRouter;
