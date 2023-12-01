import { Router } from 'express';
import { methods as commentsController } from '../controllers/commentsController';

const commentsRouter = Router();
// GET
commentsRouter.get('/', commentsController.getAll);
commentsRouter.get('/:id', commentsController.findById);
commentsRouter.get('/rating/:id', commentsController.getRatingByMovieId);
commentsRouter.get('/:username', commentsController.findByUser);
// POST
commentsRouter.post('/', commentsController.newComment);
// DELETE
commentsRouter.delete('/:id', commentsController.deleteComment);

export default commentsRouter;
