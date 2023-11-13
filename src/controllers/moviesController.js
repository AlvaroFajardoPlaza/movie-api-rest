import { getConnection } from '../database/database';

const getMovies = async (req, res) => {
	try {
		const connection = await getConnection();
		const result = await connection.query(`SELECT * FROM moviesTable`);
		console.log(result);
		res.status(200).json(result);
	} catch (error) {
		res.status(500).send('Ha habido un error: ', error.message);
	}
};

const getMovieById = async (req, res) => {
	try {
		console.log(req.params);
		const { id } = req.params;

		const connection = await getConnection();
		const result = await connection.query(
			'SELECT * FROM moviesTable WHERE id=?',
			id
		);
		return res.status(200).json(result[0] ?? null);
	} catch (error) {
		res.status(500).json({
			error: 'Ha habido un error',
			message: error.message
		});
	}
};

const addMovie = async (req, res) => {
	try {
		const {
			title,
			year,
			summary,
			comment,
			image,
			// rating,
			genre1,
			genre2,
			cast,
			director
		} = req.body;

		//Incluimos condición de info necesaria para el post
		if (!title || !year || !summary) {
			res.status(400).send(
				"Bad request. Tienes que rellenar los campos de 'title' y 'summary'."
			);
		}

		const newMovie = {
			...req.body
		};
		console.log(
			'Esta es la nueva película que queremos añadir: ',
			newMovie
		);
		const connection = await getConnection();
		console.log('Conexion: ', connection);
		const result = await connection.query(
			`INSERT INTO moviesTable SET ?`,
			newMovie
		);
		console.log('El resultado del post: ', result);
		res.status(201).json({ message: 'New movie added!' });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

const updateMovie = async (req, res) => {
	try {
		const { id } = req.params;
		const { title, year, summary, comment } = req.body;

		//Creamos la condición que nos permita editar la película y completar la petición.
		if (!(id || title || summary)) {
			res.status(400).send(
				"Bad request. Tienes que rellenar los campos de 'title' y 'summary'."
			);
		}

		const updatedMovie = { id, title, year, summary, comment };
		const connection = await getConnection();
		const result = await connection.query(
			'UPDATE moviesTable SET ? WHERE id = ?',
			[updatedMovie, id]
		);
		return res.status(200).json(result);
	} catch (error) {
		res.status(500).send('Ha habido un error: ', error.message);
	}
};

const deleteMovie = async (req, res) => {
	try {
		console.log(req.params);
		const { id } = req.params;

		const connection = await getConnection();
		const response = await connection.query(
			'DELETE FROM moviesTable WHERE id=?',
			id
		);
		return res
			.status(200)
			.send({ msg: 'Movie deleted succesfully.', response });
	} catch (error) {
		return res.status(500).send('Ha habido un error: ', error.message);
	}
};

export const methods = {
	getMovies,
	getMovieById,
	addMovie,
	updateMovie,
	deleteMovie
};
