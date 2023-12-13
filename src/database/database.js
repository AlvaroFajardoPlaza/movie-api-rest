import config from '../config';
import mysql from 'promise-mysql';

const connection = mysql.createConnection({
	host: 'localhost',
	database: 'movies',
	user: 'root',
	password: ''
});

const getConnection = () => {
	return connection;
};

module.exports = {
	getConnection
};
