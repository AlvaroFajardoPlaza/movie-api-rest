import { Router } from "express";
import { methods as moviesController } from "../controllers/movies.controller";

const moviesRouter=Router();

moviesRouter.get("/", moviesController.getMovies )

export default moviesRouter;