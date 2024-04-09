/* eslint-disable no-undef */
import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
//import nodemailer from "nodemailer"; //vorerst auskommentiert

import './models/user.js';
import './models/tasks.js';

const app = express();
app.use(express.json());
app.use(cors());
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

mongoose
	.connect(process.env.MONGODB_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		console.log('Verbunden mit mongodb');
	})
	.catch((error) => console.log(error));

const User = mongoose.model('UserInfo');
const Task = mongoose.model('TaskInfo');

app.listen(5000, () => {
	console.log('Server läuft auf PORT 5000');
});

app.post('/register', async (req, res) => {
	const { fname, lname, email, password, userType, secretKey } = req.body;
	const encryptedPassword = await bcrypt.hash(password, 10);

	try {
		if (secretKey && secretKey !== process.env.ADMIN_KEY)
			return res.json({ error: 'Ungültiger Adminkey' });

		const oldUser = await User.findOne({ email });
		if (oldUser) return res.json({ error: 'User gibt es bereits' });

		await User.create({
			fname,
			lname,
			email,
			password: encryptedPassword,
			userType,
			color: `rgb(${Math.floor(Math.random() * 255)},${Math.floor(
				Math.random() * 255
			)},${Math.floor(Math.random() * 255)})`,
			phone: '',
			note: '',
		});

		res.send({ status: 'ok' });
	} catch (error) {
		res.send({ status: error });
	}
});

app.post('/login-user', async (req, res) => {
	const { email, password } = req.body;
	const user = await User.findOne({ email });

	if (!user) {
		return res.json({ error: 'User nicht gefunden' });
	}

	if (await bcrypt.compare(password, user.password)) {
		const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
			expiresIn: '30m',
		});

		if (res.status(201)) {
			return res.json({ status: 'ok', data: token });
		} else {
			return res.json({ error: 'error' });
		}
	}
	res.json({ status: 'error', error: 'Ungültiges Passwort' });
});

app.post('/userData', async (req, res) => {
	const { token } = req.body;
	try {
		if (token.includes('Guest')) {
			return res.json({ status: 'ok', data: JSON.parse(token) });
		}

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
});

app.post('/forgot-password', async (req, res) => {
	const { email } = req.body;

	try {
		const oldUser = await User.findOne({ email });

		if (!oldUser) {
			return res.json({ status: 'err', data: "User doesn't exist" });
		}

		const secret = process.env.JWT_SECRET + oldUser.password;
		const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, secret, {
			expiresIn: '10m',
		});
		const link = `http://localhost:5000/reset-password/${oldUser._id}/${token}`;
		console.log(link);
		/* //nodemailer erlaubt email von node.js aus zu senden
         let transporter = nodemailer.createTransport({
          //absender
          service: "gmail",
          auth: {
            user: "email@email.de",
            pass: "password123"
          },
        });
        //empfaenger
        let mailOptions = {
          from: "jpirlet32@googlemail.com",
          to: `${oldUser.email}`,
          subject: "Password Reset",  //betreff
          text: 'Click the ${link} to reset the password'    //nachricht
        };
    
        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
            return res.json({ status: "err", data: "Error" });
    
          } else {
            console.log("Email sent: " + info.response);
            return res.json({ status: "ok", data: "E-Mail sent with new Password Link" });
          }
        }); */
		return res.json({
			status: 'ok',
			data: 'Nodemailer is disabled. The reset pw-link is logged in the terminal/console',
		});
	} catch (error) {
		console.log(error);
	}
});

app.get('/reset-password/:id/:token', async (req, res) => {
	const { id, token } = req.params;
	const oldUser = await User.findOne({ _id: id });

	if (!oldUser) {
		return res.json({ status: 'User existiert nicht' });
	}

	const secret = process.env.JWT_SECRET + oldUser.password;
	try {
		const verify = jwt.verify(token, secret);

		res.render('index', { email: verify.email, status: 'Nicht verifiziert' });
	} catch (error) {
		console.log(error);
		res.send('Token nicht verifiziert');
	}
});

app.post('/reset-password/:id/:token', async (req, res) => {
	const { id, token } = req.params;
	const { password } = req.body;
	const oldUser = await User.findOne({ _id: id });

	if (!oldUser) {
		return res.json({ status: 'User existiert nicht' });
	}

	const secret = process.env.JWT_SECRET + oldUser.password;

	try {
		const verify = jwt.verify(token, secret);
		const encryptedPassword = await bcrypt.hash(password, 10);

		await User.updateOne(
			{
				_id: id,
			},
			{
				$set: {
					password: encryptedPassword,
				},
			}
		);

		res.render('index', { email: verify.email, status: 'verifiziert' });
	} catch (error) {
		console.log(error);
		res.json({ status: 'Oh no' });
	}
});

app.get('/getAllUser', async (req, res) => {
	try {
		const allUser = await User.find({});
		res.send({ status: 'ok', data: allUser });
	} catch (error) {
		console.log(error);
	}
});

app.post('/findUser', async (req, res) => {
	const { id } = req.body;
	User.findOne({ _id: id })
		.then((data) => {
			res.send({ status: 'ok', data: data });
		})
		.catch((error) => {
			res.send({ status: 'error', data: error });
		});
});

app.post('/deleteUser', async (req, res) => {
	const { userid } = req.body;
	try {
		User.deleteOne({ _id: userid }, function () {});
		res.send({ status: 'ok', data: 'deleted' });
	} catch (error) {
		console.log(error);
	}
});

app.post('/addUser', async (req, res) => {
	const { fname, lname, email, password, userType, phone, note } = req.body;
	try {
		const oldUser = await User.findOne({ email });
		if (oldUser) {
			return res.json({ error: 'User gibt es bereits' });
		}
		const encryptedPassword = await bcrypt.hash(password, 10);
		await User.create({
			fname,
			lname,
			email,
			password: encryptedPassword,
			userType,
			color: `rgb(${Math.floor(Math.random() * 255)},${Math.floor(
				Math.random() * 255
			)},${Math.floor(Math.random() * 255)})`,
			phone,
			note,
		});
		res.send({ status: 'ok' });
	} catch (error) {
		res.send({ status: 'error' });
	}
});

app.post('/updateUser', async (req, res) => {
	const { id, fname, lname, email, password, userType, phone, note, color } =
		req.body;

	try {
		if (password != 'empty') {
			const encryptedPassword = await bcrypt.hash(password, 10);
			await User.updateOne(
				{
					_id: id,
				},
				{
					$set: {
						fname,
						lname,
						email,
						password: encryptedPassword,
						userType,
						color,
						phone,
						note,
					},
				}
			);
		} else {
			await User.updateOne(
				{
					_id: id,
				},
				{
					$set: {
						fname,
						lname,
						email,
						userType,
						color,
						phone,
						note,
					},
				}
			);
		}
		res.send({ status: 'ok' });
	} catch (error) {
		res.send({ status: 'error' });
	}
});

app.post('/addTask', async (req, res) => {
	const {
		title,
		description,
		department,
		section,
		assignedTo,
		dueDate,
		priority,
		subTasks,
	} = req.body;

	try {
		await Task.create({
			title,
			description,
			department,
			section,
			assignedTo,
			dueDate,
			priority,
			subTasks,
		});
		res.send({ status: 'ok' });
	} catch (error) {
		res.send({ status: 'error' });
	}
});

app.get('/getAllTasks', async (req, res) => {
	try {
		const allUser = await Task.find({});
		res.send({ status: 'ok', data: allUser });
	} catch (error) {
		console.log(error);
	}
});

app.post('/findTask', async (req, res) => {
	const { id } = req.body;
	Task.findOne({ _id: id })
		.then((data) => {
			res.send({ status: 'ok', data: data });
		})
		.catch((error) => {
			res.send({ status: 'error', data: error });
		});
});

app.post('/deleteTask', async (req, res) => {
	const { id } = req.body;
	try {
		Task.deleteOne({ _id: id }, function () {});
		res.send({ status: 'ok', data: 'deleted' });
	} catch (error) {
		console.log(error);
	}
});

app.post('/updateTask', async (req, res) => {
	const {
		id,
		title,
		description,
		department,
		section,
		assignedTo,
		dueDate,
		priority,
		subTasks,
	} = req.body;

	try {
		await Task.updateOne(
			{
				_id: id,
			},
			{
				$set: {
					title,
					description,
					department,
					section,
					assignedTo,
					dueDate,
					priority,
					subTasks,
				},
			}
		);
		res.send({ status: 'ok' });
	} catch (error) {
		res.send({ status: 'error' });
	}
});
