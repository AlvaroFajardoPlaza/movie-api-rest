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

const getAllGenres = async (req, res) => {
	try {
		const connection = await getConnection();
		const result = await connection.query('SELECT * FROM genresTable');
		console.log('Estamos recibiendo la lista de géneros?', result);
		res.status(200).json(result);
	} catch (error) {
		res.status(500).json({
			error: 'Ha habido un error',
			message: error.message
		});
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

const getMovieGenresByMovieId = async (req, res) => {
	try {
		// console.log(req.params);
		const movieId = req.params;
		console.log('Este es el movie id: ', movieId);

		// Convertimos el objeto movieId a integer
		let idParsed = parseInt(movieId.id);
		console.log('Tenemos nuestro id parseado?', idParsed);

		const connection = await getConnection();
		const matriz_results = await connection.query(
			'SELECT * FROM movieGenreRelation WHERE movieId=?',
			idParsed
		);
		console.log(
			'El resultado de nuestra primera llamada a la tabla relacional: ',
			matriz_results
		);

		// Hemos recibido por objeto los ids de los géneros. Promesa para esperar los resultados de la BBDD
		const promises = matriz_results.map(async (objeto) => {
			let { genreId } = objeto;
			console.log('Tenemos el id del genre?', genreId);
			const [genreObject] = await connection.query(
				'SELECT * FROM genresTable WHERE id=?',
				genreId
			);
			console.log('Tenemos el genreObject?', genreObject);
			// Devolvemos del genreObject solamente el genre
			return genreObject;
		});

		const final_genres = await Promise.all(promises);
		console.log('Tenemos los nombres de los final_genres?', final_genres);

		res.status(200).json(final_genres ?? null);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

const getMoviesByGenreId = async (req, res) => {
	try {
		const genreId = req.params;
		// Tenemos que convertir el objeto recibido a integer

		const connection = await getConnection();
		const matriz = await connection.query(
			`SELECT * FROM movieGenreRelation WHERE genreId=?`,
			+genreId['id']
		);
		console.log('Recibimos la request?', matriz); // Aquí tenemos la matriz []

		// Pasamos a realizar la segunda solicitud de promesa a la bbdd para traer
		const promises = matriz.map(async (object) => {
			let { movieId } = object;
			const movie = await connection.query(
				`SELECT * FROM moviesTable WHERE id=?`,
				movieId
			);
			return movie[0];
		});

		const filteredMovieListByGenre = await Promise.all(promises);
		res.status(200).json(filteredMovieListByGenre ?? null);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

const addMovie = async (req, res) => {
	try {
		const { title, year, summary } = req.body;

		//Incluimos condición de info necesaria para el post
		if (!title || !year || !summary) {
			res.status(400).send(
				"Bad request. Tienes que rellenar los campos de 'title' y 'summary'."
			);
		}

		const { genres, ...newMovie } = req.body;
		console.log(
			'Esta es la nueva película que queremos añadir: ',
			newMovie
		);
		const connection = await getConnection();

		// 'START TRANSACTION' O 'BEGIN' PARA CREAR UN CHECKPOINT SI EL POST A LA BBDD FALLA
		await connection.query('START TRANSACTION');
		try {
			const result = await connection.query(
				`INSERT INTO moviesTable SET ?`,
				newMovie
			);
			console.log('moviesTable', result);
			const movieHasGenres = genres.map(async (genreId) => {
				await connection.query(`INSERT INTO movieGenreRelation SET ?`, {
					movieId: result.insertId,
					genreId
				});
			});
			console.log('movieGenreRelation', movieHasGenres);
		} catch (error) {
			console.error('error', error);
			await connection.query('ROLLBACK');
		}
		await connection.query('COMMIT');

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
	getAllGenres,
	getMovieById,
	getMovieGenresByMovieId,
	getMoviesByGenreId,
	addMovie,
	updateMovie,
	deleteMovie
};
