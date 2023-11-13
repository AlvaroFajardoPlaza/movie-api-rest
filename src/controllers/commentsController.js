import { getConnection } from './../database/database';

const getAll = async (req, res) => {
	try {
		const {} = req.body;
		const connection = await getConnection();
		res.status(200).json({ msg: success });
	} catch (error) {
		res.status(500).send('Ha habido un error: ', error.message);
	}
};

export const methods = {
	getAll
};
