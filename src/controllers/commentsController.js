import { getConnection } from './../database/database';

const getAll = async (req, res) => {
	try {
		const {} = req.body;
		const connection = await getConnection();
		const result = await connection.query(`SELECT * FROM commentsTable`);
		res.status(200).json(result);
	} catch (error) {
		res.status(500).send('Ha habido un error: ', error.message);
	}
};

const findById = async (req, res) => {
	try {
		console.log(req.params);
		const id = req.params.id;

		if (!id) {
			res.status(400).send('bad request. Este comentario no existe');
		}

		const connection = await getConnection();
		const result = await connection.query(
			`SELECT * FROM commentsTable WHERE id=?`,
			id
		);
		console.log('Hemos encontrado el comentario? ', result[0]);
		res.status(200).json(result[0] ?? null);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

// Buscar todos los comentarios de un determinado usuario ---> SELECT * FROM commentsTable WHERE user = username
const findByUser = async (req, res) => {
	try {
		const username = ''; // Como podemos extraer el username desde el front...
		console.log(
			'solicitamos todos los comentarios del usuario: ',
			username
		);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

const newComment = async (req, res) => {
	try {
		const { comment, rating, user } = req.body;

		if (!comment && !rating) {
			res.status(400).send('Bad request. Faltan datos por introducir');
		}

		const newComment = { ...req.body };
		console.log('Nuestro nuevo comentario es: ', newComment);

		const connection = await getConnection();
		const result = await connection.query(
			`INSERT INTO commentsTable SET ?`,
			newComment
		);
		console.log('El resultado del post: ', result);
		res.status(201).json({ message: 'New comment added!' });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

const updateComment = async (req, res) => {
	try {
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

const deleteComment = async (req, res) => {
	try {
		console.log(req.params);
		const { id } = req.params;

		const connection = await getConnection();
		const result = await connection.query(
			`DELETE FROM commentsTable WHERE id=?`,
			id
		);
		res.status(200).json({ msg: 'Removed comment.' });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

export const methods = {
	getAll,
	findById,
	findByUser,
	newComment,
	updateComment,
	deleteComment
};
