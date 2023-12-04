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
			`SELECT * FROM commentsTable WHERE movieId=?`,
			id
		);
		console.log('Hemos encontrado los comentarios? ', result); // Si quisieramos acceder al primer resultado de la matriz sería result[0]
		res.status(200).json(result ?? null);
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

// En esta función tenemos que traer el listado de comentarios por MovieId y de esa lista calcular el rating total.
const getRatingByMovieId = async (req, res) => {
	try {
		console.log(req.params);
		const movieId = req.params.id;

		if (!movieId) {
			res.status(400).send('Bad request.');
		}
		const connection = await getConnection();
		const commentList = await connection.query(
			`SELECT * FROM commentsTable WHERE movieId=?`,
			movieId
		);
		console.log('Nuestra lista de comentarios es: ', commentList);

		// A partir de aquí tenemos que trabajar con los resultados de nuestra lista de comentarios
		// Nuestra variable para guardar la sumatoria tras recorrer el bucle
		let totalRating = 0;

		for (const comment of commentList) {
			console.log('Accedemos al rating del comment?', comment.rating);
			totalRating += comment.rating;
		}
		// Hacemos la media aritmética
		const averageRating = totalRating / commentList.length;
		const finalResult = Math.round(averageRating * 100) / 100;

		res.status(200).json({ finalResult });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

// Función GET para llamar a los comentarios de un solo usuario en su panel de usuario
const userCommentsByUsername = async (req, res) => {
	try {
		console.log(req.params);
		const { username } = req.params;
		const connection = await getConnection();
		const result = await connection.query(
			`SELECT * FROM commentsTable WHERE user=?`,
			username
		);

		// Hemos obtenido el resultado de los comentarios del usuario... pero hay que recoger también los datos de las películas
		const promises = res.status(200).json(result);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

export const methods = {
	getAll,
	findById,
	newComment,
	updateComment,
	deleteComment,
	getRatingByMovieId,
	userCommentsByUsername
};
