import { getConnection } from "../database/database";

const getMovies = async (req, res) => {
    const connection = await getConnection()
    const result = await connection.query(`SELECT * FROM moviesTable`)
    console.log(result);
    res.json(result)
}

export const methods = {
    getMovies
};