import { Router } from 'express';
import { methods as moviesController } from '../controllers/movies.controller';

const moviesRouter = Router();

moviesRouter.get('/', moviesController.getMovies);
moviesRouter.get('/:id', moviesController.getMovieById);
moviesRouter.post('/', moviesController.addMovie);
moviesRouter.put('/:id', moviesController.updateMovie);
moviesRouter.delete('/:id', moviesController.deleteMovie);

export default moviesRouter;
