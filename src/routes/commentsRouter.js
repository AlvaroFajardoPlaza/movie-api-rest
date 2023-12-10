import { Router } from 'express';
import { methods as commentsController } from '../controllers/commentsController';

const commentsRouter = Router();
// GET
commentsRouter.get('/', commentsController.getAll);
commentsRouter.get('/:id', commentsController.findById);
commentsRouter.get('/rating/:id', commentsController.getRatingByMovieId);
commentsRouter.get(
	'/myUser/:username',
	commentsController.userReviewsByUsername
);
// POST
commentsRouter.post('/', commentsController.newComment);
//PUT
commentsRouter.put('/edit/:id', commentsController.updateComment);
commentsRouter.put('/softdelete/:id', commentsController.softDelete);

// DELETE
commentsRouter.delete('/:id', commentsController.deleteComment);

export default commentsRouter;
