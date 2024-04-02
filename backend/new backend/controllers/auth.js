import jwt from 'jsonwebtoken';
import { User } from '../models/user.js';

// Register a new user
export const register = async (req, res, next) => {
	const { fname, lname, email, password, userType } = req.body;

	try {
		const user = new User({
			fname,
			lname,
			email,
			password,
      userType,
			color: `rgb(${Math.floor(Math.random() * 255)},${Math.floor(
				Math.random() * 255
			)},${Math.floor(Math.random() * 255)})`,
		});
		await user.save();
		res.json({ message: 'Registration successful' });
	} catch (error) {
		next(error);
	}
};

// Login with an existing user
export const login = async (req, res, next) => {
	const { email, password } = req.body;

	try {
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(404).json({ status: 'error', message: 'User nicht gefunden' });
		}

		const passwordMatch = await user.comparePassword(password);
		if (!passwordMatch) {
			return res.status(401).json({ status: 'error', message: 'Ungültiges Passwort' });
		}

		// eslint-disable-next-line no-undef
		const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
			expiresIn: '1 hour',
		});
		res.json({ token });
	} catch (error) {
		next(error);
	}
};
