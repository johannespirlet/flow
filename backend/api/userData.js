import jwt from 'jsonwebtoken';
import { User } from './models/user.js';

export default async function handler(req, res) {
	res.setHeader(
		'Access-Control-Allow-Origin',
		'https://flow-git-vercel-johannespirlets-projects.vercel.app/'
	);
	if (req.method === 'POST') {
		const { token } = req.body;
		try {
			if (token.includes('Guest')) {
				return res.json({ status: 'ok', data: JSON.parse(token) });
			}

			// eslint-disable-next-line no-undef
			const user = jwt.verify(token, process.env.JWT_SECRET, (err, res) => {
				if (err) {
					return 'token abgelaufen';
				}
				return res;
			});

			if (user == 'token abgelaufen') {
				return res.send({ status: 'error', data: 'token abgelaufen' });
			}

			const useremail = user.email;

			User.findOne({ email: useremail })
				.then((data) => {
					res.send({ status: 'ok', data: data });
				})
				.catch((error) => {
					res.send({ status: 'error', data: error });
				});
		} catch (error) {
			console.log(error);
		}
	} else {
		res.status(405).end(); // Method Not Allowed
	}
}
