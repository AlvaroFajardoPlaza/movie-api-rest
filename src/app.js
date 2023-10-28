import express from "express";
import morgan from "morgan";

//Llamamos a nuestro archivo de rutas
import moviesRoutes from "./routes/movies.routes";

const app = express();

//Configuración inicial
app.set("port", 4000); //El puerto podemos modificarlo a nuestro gusto

//Middleware
app.use(morgan("dev"));

//Rutas que emplea nuestra app, podemos redefinirlas aquí:
app.use("/api/movies", moviesRoutes);

export default app;