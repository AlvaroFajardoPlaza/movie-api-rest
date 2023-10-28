import express from "express";
import morgan from "morgan";

const app = express();

//Configuración inicial
app.set("port", 4000); //El puerto podemos modificarlo a nuestro gusto

//Middleware
app.use(morgan("dev"));

export default app;