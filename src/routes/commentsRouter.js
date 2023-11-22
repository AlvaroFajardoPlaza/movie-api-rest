import { Router } from 'express';
import { methods as commentsController } from '../controllers/commentsController';

const commentsRouter = Router();

commentsRouter.get('/', commentsController.getAll);
commentsRouter.get('/:id', commentsController.findById);
commentsRouter.get('/:username', commentsController.findByUser);
commentsRouter.post('/', commentsController.newComment);
commentsRouter.get('/', commentsController.averageRatingOneMovie);
commentsRouter.delete('/:id', commentsController.deleteComment);

export default commentsRouter;
