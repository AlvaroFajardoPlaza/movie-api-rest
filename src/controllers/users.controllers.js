import { getConnection } from "../database/database";

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Necesitamos una variable "secret" para generar nuestro token.
const secret = 'mySecretRandom';

const getAll = async(req, res) => {
    try {
        const connection = await getConnection()
        const result = await connection.query("SELECT * FROM users")
        console.log("Los usuarios de mi BBDD: ", result);
        res.status(200).json(result)
    } catch(error) {
        res.status(500).send("Algo fue mal")
    }
}

const register = async(req, res) => {
    try {
        const { username, email, password } = req.body;

        // 1. Confirmamos que tenemos recibimos todos los datos:
        if(!(username || email || password)) res.status(400).send("Tienes que rellenar todos los datos.");

        // 2. Conexión con la BBDD
        const connection = await getConnection();

        // 3. Comprobamos que el usuario no existe en la BBDD
        const userEmail = req.body.email;
        const existingUser = await connection.query('SELECT * FROM users WHERE email=?', userEmail)
        if(existingUser.length > 0) return res.status(400).send('Este usuario ya ha sido registrado anteriormente.')

        // 4. Si el usuario no existe, encriptamos su contraseña e introducimos los datos en la BBDD
        const encryptedPassword = await bcrypt.hash(password, 10);
        const result = await connection.query('INSERT INTO users (`username`, `email`, `password`) VALUES (?, ?, ?)', [username, email, encryptedPassword])
        console.log("resultado al register: ", result)
        // 5. Creamos el nuevo usuario, generamos el token y enviamos una respuesta success al register.
        const newUser = {
            username: req.body.username, 
            email: req.body.email, 
            password: encryptedPassword
        };
        const userToken = jwt.sign(newUser, secret, { expiresIn: "2h" });
        res.status(201).json({register: true, token: userToken});

    } catch (error) {
        res.status(500).send({error: error.message});
    }
}

const login = async(req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Comprobar que recibimos todos los datos desde el front.
        if(!(email || password)) res.status(400).send("Bad request. Some data is missing")

        // 2. Conseguir la conexión con la BBDD y comprobar que el usuario existe
        const connection = await getConnection()
        const userEmail = req.body.email;
        const existingUser = await connection.query("SELECT * FROM users WHERE email=?", userEmail)
        if(!existingUser) res.status(400).send("Este usuario no está registrado en la BBDD.")

        // 3. En este punto, la BBDD nos devuelve una matriz ---> existingUser/ que tendremos que convertir a objeto para poder trabajar bien con ello.
        const userObject = existingUser[0] // de la matriz tomamos el primer resultado.
        const passwordHashed = userObject.password

        // 4. Descodificamos la contraseña y comprobamos que es correcta
        const matchedPassword = await bcrypt.compare(password, passwordHashed)
        if(!matchedPassword) res.status(400).send("La contraseña no es correcta.");

        // 5. Creamos el objeto de usuario loggeado y asignamos un token
        const loggedUser = {
            email: req.body.email,
            password: passwordHashed
        };
        const userToken = jwt.sign(loggedUser, secret, { expiresIn: "2h"})
        res.status(201).json({login: true, token: userToken})
    } catch (error) {
        res.status(500).send({ error: error.message});
    }
}

export const methods = {
    getAll,
    register,
    login,
}