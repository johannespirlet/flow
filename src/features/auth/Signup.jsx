import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './auth.module.css';

export default function SignUp({ handleMessage }) {
	const [secretKey, setSecretKey] = useState('');
	const [formData, setFormData] = useState({
		fname: '',
		lname: '',
		email: '',
		password: '',
		userType: 'User',
	});
	const navigate = useNavigate();

	const handleChange = (event) => {
		const { name, value } = event.target;
		setFormData({
			...formData,
			[name]: value,
		});
	};

	const handleSubmit = (e) => {
		if (formData.userType == 'Admin' && secretKey != '2AdMiN2') {
			e.preventDefault();
			handleMessage({
				messageText: 'Ungültiger Adminkey',
				messageType: 'negative',
			});
		} else {
			e.preventDefault();
			fetch('http://localhost:5000/register', {
				method: 'POST',
				crossDomain: true,
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json',
					'Access-Control-Allow-Origin': '*',
				},
				body: JSON.stringify({
					fname: formData.fname,
					email: formData.email,
					lname: formData.lname,
					password: formData.password,
					userType: formData.userType,
				}),
			})
				.then((res) => res.json())
				.then((data) => {
					if (data.status == 'ok') {
						handleMessage({
							messageText: 'Registrierung erfolgreich! You may sign in now.',
							messageType: 'positive',
						});
						navigate('../sign-in');
					} else {
						handleMessage({
							messageText:
								'User gibt es bereits. Bitte andere Eingaben verwenden!',
							messageType: 'negative',
						});
					}
				});
		}
	};

	return (
		<div className={styles.authContainer}>
			<form className={styles.formContainer} onSubmit={handleSubmit}>
				<title>Sign Up to Flow</title>
				<h3>Sign Up</h3>
				<div>
					Register As
					<input
						type="radio"
						id="user"
						name="userType"
						value="User"
						onChange={handleChange}
						checked
					/>
					<label htmlFor="user">User</label>
					<input
						type="radio"
						id="admin"
						name="userType"
						value="Admin"
						onChange={handleChange}
					/>
					<label htmlFor="admin">Admin</label>
				</div>
				{formData.userType == 'Admin' ? (
					<div className="mb-3">
						<label htmlFor="secretKey">Secret Key</label>
						<input
							type="text"
							name="secretKey"
							id="secretKey"
							className="form-control"
							placeholder="Secret Key"
							onChange={(e) => setSecretKey(e.target.value)}
						/>
					</div>
				) : null}

				<div className="mb-3">
					<label htmlFor="fname">First Name</label>
					<input
						type="text"
						name="fname"
						id="fname"
						className="form-control"
						placeholder="Enter First Name"
						onChange={handleChange}
						required
					/>
				</div>

				<div className="mb-3">
					<label htmlFor="lname">Last Name</label>
					<input
						type="text"
						name="lname"
						id="lname"
						className="form-control"
						placeholder="Enter Last Name"
						onChange={handleChange}
						required
					/>
				</div>

				<div className="mb-3">
					<label htmlFor="email">E-Mail</label>
					<input
						type="email"
						name="email"
						id="email"
						className="form-control"
						placeholder="Enter E-Mail Address"
						onChange={handleChange}
						autoComplete="email"
						required
					/>
				</div>

				<div className="mb-3">
					<label htmlFor="password">Password</label>
					<input
						type="password"
						name="password"
						id="password"
						className="form-control"
						placeholder="Enter Password"
						onChange={handleChange}
						required
					/>
				</div>

				<div className="d-grid">
					<button type="submit" className="btn btn-primary">
						Sign Up
					</button>
				</div>
				<p className="forgot-password text-right">
					Already registered? <Link to="../sign-in">Sign In</Link>
				</p>
				<p>
					This is an educational project with low security. Please do not enter
					any confidential information.
				</p>
			</form>
		</div>
	);
}
