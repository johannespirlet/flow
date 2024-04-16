import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './auth.module.css';
import {
	validateName,
	validateEmail,
	validatePassword,
} from '../../helpers/validation';

export default function SignUp({ dispatchMessage }) {
	const [formData, setFormData] = useState({
		fname: '',
		lname: '',
		email: '',
		password: '',
		userType: 'User',
		secretKey: '',
	});
	const [formErrors, setFormErrors] = useState({});
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

		const fnameError = validateName(formData.fname);
		const lnameError = validateName(formData.lname);
		const emailError = validateEmail(formData.email);
		const passwordError = validatePassword(formData.password);

		if (fnameError || lnameError || emailError || passwordError) {
			dispatchMessage({
				type: 'SET_MESSAGE',
				payload: {
					messageText: 'Please check your input and try again',
					messageType: 'negative',
				},
			});
			setFormErrors({
				fname: fnameError,
				lname: lnameError,
				email: emailError,
				password: passwordError,
			});
			return;
		}

		fetch('https://flow-eta-bay.vercel.app/api/register', {
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
					dispatchMessage({
						type: 'SET_MESSAGE',
						payload: {
							messageText: 'Registration successful! You may sign in now.',
							messageType: 'positive',
						},
					});
					navigate('../sign-in');
				} else {
					dispatchMessage({
						type: 'SET_MESSAGE',
						payload: {
							messageText: data.error,
							messageType: 'negative',
						},
					});
				}
			});
	};

	return (
		<div className={styles.authContainer}>
			<form className={styles.formContainer} onSubmit={handleSubmit} noValidate>
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
						checked={formData.userType === 'User'}
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
						<div className={styles.labelRow}>
							<label htmlFor="secretKey">Secret Key</label>
						</div>
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
						onBlur={
							formErrors.fname
								? (e) =>
										setFormErrors({
											...formErrors,
											fname: validateName(e.target.value),
										})
								: null
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
						onBlur={
							formErrors.lname
								? (e) =>
										setFormErrors({
											...formErrors,
											lname: validateName(e.target.value),
										})
								: null
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
						onBlur={
							formErrors.email
								? (e) =>
										setFormErrors({
											...formErrors,
											email: validateEmail(e.target.value),
										})
								: null
						}
						autoComplete="email"
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
						onBlur={
							formErrors.password
								? (e) =>
										setFormErrors({
											...formErrors,
											password: validatePassword(e.target.value),
										})
								: null
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
