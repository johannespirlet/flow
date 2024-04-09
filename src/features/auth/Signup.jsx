import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './auth.module.css';
import {
	validateName,
	validateEmail,
	validatePassword,
} from '../../helpers/validation';

export default function SignUp({ handleMessage }) {
	const [formData, setFormData] = useState({
		fname: '',
		lname: '',
		email: '',
		password: '',
		userType: 'User',
		secretKey: '',
	});
	const [formErrors, setFormErrors] = useState({
		fname: '',
		lname: '',
		email: '',
		password: '',
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
		e.preventDefault();

		if (
			formErrors.fname ||
			formErrors.lname ||
			formErrors.email ||
			formErrors.password
		) {
			handleMessage({
				messageText: 'Please check your input and try again',
				messageType: 'negative',
			});
			return;
		}

		fetch('http://localhost:5000/register', {
			method: 'POST',
			crossDomain: true,
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
				'Access-Control-Allow-Origin': '*',
			},
			body: JSON.stringify(formData),
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
						messageText: data.error,
						messageType: 'negative',
					});
				}
			});
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
							onChange={handleChange}
						/>
					</div>
				) : null}

				<div className="mb-3">
					<div className={styles.labelRow}>
						<label htmlFor="fname">First Name</label>
						{formErrors.fname && (
							<span className={styles.formError}>{formErrors.fname}</span>
						)}
					</div>
					<input
						type="text"
						name="fname"
						id="fname"
						className="form-control"
						placeholder="Enter First Name"
						onChange={handleChange}
						onBlur={() =>
							setFormErrors({
								...formErrors,
								fname: validateName(formData.fname),
							})
						}
					/>
				</div>

				<div className="mb-3">
					<div className={styles.labelRow}>
						<label htmlFor="lname">Last Name</label>
						{formErrors.lname && (
							<span className={styles.formError}>{formErrors.lname}</span>
						)}
					</div>
					<input
						type="text"
						name="lname"
						id="lname"
						className="form-control"
						placeholder="Enter Last Name"
						onChange={handleChange}
						onBlur={() =>
							setFormErrors({
								...formErrors,
								lname: validateName(formData.lname),
							})
						}
					/>
				</div>

				<div className="mb-3">
					<div className={styles.labelRow}>
						<label htmlFor="email">E-Mail</label>
						{formErrors.email && (
							<span className={styles.formError}>{formErrors.email}</span>
						)}
					</div>
					<input
						type="email"
						name="email"
						id="email"
						className="form-control"
						placeholder="Enter E-Mail Address"
						onChange={handleChange}
						autoComplete="email"
						onBlur={() =>
							setFormErrors({
								...formErrors,
								email: validateEmail(formData.email),
							})
						}
					/>
				</div>

				<div className="mb-3">
					<div className={styles.labelRow}>
						<label htmlFor="password">Password</label>
						{formErrors.password && (
							<span className={styles.formError}>{formErrors.password}</span>
						)}
					</div>
					<input
						type="password"
						name="password"
						id="password"
						className="form-control"
						placeholder="Enter Password"
						onChange={handleChange}
						onBlur={() =>
							setFormErrors({
								...formErrors,
								password: validatePassword(formData.password),
							})
						}
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
