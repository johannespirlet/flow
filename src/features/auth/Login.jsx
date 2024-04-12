import { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './auth.module.css';
import { validateEmail, validatePassword } from '../../helpers/validation';

export default function Login({ handleLogin, handleMessage }) {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [formErrors, setFormErrors] = useState({
		email: '',
		password: '',
	});

	function handleSubmit(event) {
		event.preventDefault();

		const emailError = validateEmail(email);
		const passwordError = validatePassword(password);

		if (emailError || passwordError) {
			handleMessage({
				messageText: 'Please check your data and try again',
				messageType: 'negative',
			});
			setFormErrors({ email: emailError, password: passwordError });
			return;
		}

		const requestBody = {
			email,
			password,
		};

		const requestOptions = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(requestBody),
		};

		fetch('http://localhost:5000/login-user', requestOptions)
			.then((response) => response.json())
			.then((data) => {
				if (data.status === 'ok') {
					window.localStorage.setItem('token', data.data);
					handleLogin();
				} else {
					handleMessage({
						messageText: 'Invalid Userdata. Try again.',
						messageType: 'negative',
					});
				}
			});
	}

	function handleGuestLogin() {
		window.localStorage.setItem(
			'token',
			JSON.stringify({ fname: 'Guestuser', lname: '', userType: 'Guest' })
		);
		handleLogin();
	}

	return (
		<div className={styles.authContainer}>
			<form className={styles.formContainer} onSubmit={handleSubmit} noValidate>
				<title>Log Into Flow</title>
				<h3>Sign In</h3>
				<div className="mb-3">
					<div className={styles.labelRow}>
						<label htmlFor="email">E-Mail</label>
						{formErrors.email && (
							<span className={styles.formError}>{formErrors.email}</span>
						)}
					</div>
					<input
						id="email"
						name="email"
						type="email"
						className="form-control"
						placeholder="Enter E-Mail"
						onChange={(e) => setEmail(e.target.value)}
						autoComplete="email"
						onBlur={
							formErrors.email
								? (e) =>
										setFormErrors({
											...formErrors,
											email: validateEmail(e.target.value),
										})
								: null
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
						id="password"
						name="password"
						type="password"
						className="form-control"
						placeholder="Enter Password"
						onChange={(e) => setPassword(e.target.value)}
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
				<div className="mb-3">
					<div className="custom-control custom-checkbox">
						<input
							type="checkbox"
							className="custom-control-input"
							id="customCheck1"
						/>
						<label className="custom-control-label" htmlFor="customCheck1">
							Remember me
						</label>
					</div>
				</div>
				<div className="d-grid">
					<button
						type="submit"
						onClick={handleSubmit}
						className="btn btn-primary"
					>
						Submit
					</button>
				</div>
				<p className="forgot-password text-right">
					<Link to="../reset">Forgot password?</Link>
					&nbsp;&nbsp;&nbsp;&nbsp;
					<Link to="../sign-up">Sign Up</Link>
				</p>
				<button
					type="button"
					className="btn btn-secondary"
					onClick={handleGuestLogin}
				>
					Sign In as Guest User
				</button>
				<p>
					This is an educational project with low security. Please do not enter
					any confidential information.
				</p>
			</form>
		</div>
	);
}
