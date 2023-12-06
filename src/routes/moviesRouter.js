import { Router } from 'express';
import { methods as moviesController } from '../controllers/moviesController';

const moviesRouter = Router();

// GET
moviesRouter.get('/', moviesController.getMovies);
moviesRouter.get('/genres', moviesController.getAllGenres);
moviesRouter.get('/moviesByGenreId/:id', moviesController.getMoviesByGenreId);
moviesRouter.get('/:id', moviesController.getMovieById);
moviesRouter.get('/:id/genres', moviesController.getMovieGenresByMovieId);
// POST
moviesRouter.post('/', moviesController.addMovie);
// PUT
moviesRouter.put('/:id', moviesController.updateMovie);
moviesRouter.put('/softdel/:id', moviesController.softDeleteMovie);
// DELETE
moviesRouter.delete('/:id', moviesController.deleteMovie);

export default moviesRouter;
