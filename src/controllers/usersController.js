import { getConnection } from '../database/database';

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Necesitamos una variable "secret" para generar nuestro token.
const secret = 'mySecretRandom';

const getAll = async (req, res) => {
	try {
		const connection = await getConnection();
		const result = await connection.query('SELECT * FROM users');
		console.log('Los usuarios de mi BBDD: ', result);
		res.status(200).json(result);
	} catch (error) {
		res.status(500).send('Algo fue mal');
	}
};

const findUserByUsername = async (req, res) => {
	// Recuerda solicitar la conexión a la BBDD
	const connection = await getConnection();
	try {
		const { userUsername } = req.params;
		const result = await connection.query(
			`SELECT * FROM users WHERE username=?`,
			userUsername
		);
		res.status(200).json(result[0] ?? null);
	} catch (err) {
		res.status(500).json({ err: err.message });
	}
};

// Conseguimos el rol del usuario pasándole su id.
const getRole = async (req, res) => {
	try {
		const { id } = req.params;
		const connection = await getConnection();
		const result = await connection.query(
			`SELECT * FROM userHasRole WHERE userId=?`,
			id
		);
		console.log('Primer resultado a la llamada:', [result]);

		// Para poder recibir los roles ahora de su tabla correcta tenemos que volver a hacer una petición como promesa
		const promises = result.map(async (role) => {
			const { roleId } = role;
			const roleResult = await connection.query(
				`SELECT * FROM roles WHERE id=?`,
				roleId
			);
			console.log(roleResult);
			return roleResult[0] ?? null;
		});
		// Recuerda que tenemos que resolver la promesa que hemos creado arriba con await Promise.all
		const [userRoleReturned] = await Promise.all(promises);
		res.status(200).json(userRoleReturned);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

const register = async (req, res) => {
	try {
		const { username, email, password } = req.body;

		// 1. Confirmamos que tenemos recibimos todos los datos:
		if (!(username || email || password))
			res.status(400).send('Tienes que rellenar todos los datos.');

		// 2. Conexión con la BBDD
		const connection = await getConnection();

		// 3. Comprobamos que el usuario no existe en la BBDD
		const userEmail = req.body.email;
		const existingUser = await connection.query(
			'SELECT * FROM users WHERE email=?',
			userEmail
		);
		if (existingUser.length > 0)
			return res
				.status(400)
				.send('Este usuario ya ha sido registrado anteriormente.');

		// 4. Si el usuario no existe, encriptamos su contraseña e introducimos los datos en la BBDD
		const encryptedPassword = await bcrypt.hash(password, 10);
		const result = await connection.query(
			'INSERT INTO users (`username`, `email`, `password`) VALUES (?, ?, ?)',
			[username, email, encryptedPassword]
		);
		console.log('resultado al register: ', result);

		// 5. Creamos el nuevo usuario, generamos el token y enviamos una respuesta success al register.
		const newUser = {
			username: req.body.username,
			email: req.body.email
		};
		const userToken = jwt.sign(newUser, secret, { expiresIn: '2h' });
		res.status(201).json({ register: true, token: userToken });
	} catch (error) {
		res.status(500).send({ error: error.message });
	}
};

const login = async (req, res) => {
	try {
		const { email, password } = req.body;

		// 1. Comprobar que recibimos todos los datos desde el front.
		if (!(email || password))
			res.status(400).send('Bad request. Some data is missing');

		// 2. Conseguir la conexión con la BBDD y comprobar que el usuario existe
		const connection = await getConnection();
		const userEmail = req.body.email;
		const [existingUser = null] = await connection.query(
			'SELECT * FROM users WHERE email=?',
			userEmail
		);
		if (!existingUser)
			res.status(400).send('Este usuario no está registrado en la BBDD.');

		// 3. En este punto, la BBDD nos devuelve una matriz ---> existingUser/ que tendremos que convertir a objeto para poder trabajar bien con ello.
		const passwordHashed = existingUser.password;

		// 4. Descodificamos la contraseña y comprobamos que es correcta
		const matchedPassword = await bcrypt.compare(password, passwordHashed);
		if (!matchedPassword)
			res.status(400).send('La contraseña no es correcta.');

		// 5. Creamos el objeto de usuario loggeado y asignamos un token
		const loggedUser = {
			id: existingUser.id,
			email: existingUser.email
		};
		console.log('loggedUser', loggedUser);

		const userToken = jwt.sign(loggedUser, secret, { expiresIn: '2h' });
		res.status(201).json({ login: true, token: userToken });
	} catch (error) {
		res.status(500).send({ error: error.message });
	}
};

// En esta función recibimos los datos del usuario a partir del token que le hemos otorgado y su rol de la tabla userHasRole
const me = async (req, res) => {
	const { token } = req.body;

	if (!token) {
		res.status(400).json('No se ha enviado ningún token.');
	}

	let decodedToken;
	try {
		decodedToken = await new Promise((resolve, reject) => {
			jwt.verify(token, secret, function (err, decoded) {
				if (err) {
					reject(err);
				}
				resolve(decoded);
			});
		});
	} catch (error) {
		return res.status(400).json('invalid token');
	}

	const user = await findUserById(decodedToken.id);
	if (!user) {
		return res.status(400).json('no user found');
	}
	res.status(201).json(user);
};

async function findUserById(id) {
	const connection = await getConnection();
	const result = await connection.query(`SELECT * FROM users WHERE id=?`, id);
	return result[0] ?? null;
}

const invalidate = async (req, res) => {
	const { token } = req.body;

	if (!token) {
		res.status(400).json('not_token_send');
	}

	let decodedToken;
	try {
		decodedToken = await new Promise((resolve, reject) => {
			jwt.invalidate(token, secret, function (err, decoded) {
				if (err) {
					reject(err);
				}
				resolve(decoded);
			});
		});
	} catch (error) {
		return res.status(400).json('invalid token');
	}
	res.status(201).json();
};

export const methods = {
	getAll,
	findUserByUsername,
	getRole,
	register,
	login,
	me
};
