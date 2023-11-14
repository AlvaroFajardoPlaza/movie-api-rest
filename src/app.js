import express from 'express';
import morgan from 'morgan';

//Llamamos a nuestros archivos de rutas
import moviesRoutes from './routes/moviesRouter';
import userRoutes from './routes/usersRouter';
import commentsRouter from './routes/commentsRouter';

const app = express();

//Configuración inicial
app.set('port', 4000); //El puerto podemos modificarlo a nuestro gusto

//Configuración de los CORS
const cors = require('cors');
const whiteList = ['http://localhost:4200'];
app.use(cors({ origin: whiteList }));

//Middleware
app.use(morgan('dev'));

//Configuración para que express pueda manejar achivos JSON y no de un error de undefined
app.use(express.json());

//Rutas que emplea nuestra app, podemos redefinirlas aquí:
app.use('/api/movies', moviesRoutes);
app.use('/api/users', userRoutes);
app.use('/api/comments', commentsRouter);

export default app;
