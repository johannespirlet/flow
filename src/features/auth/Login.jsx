import { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './auth.module.css';

export default function Login({ handleLogin, handleMessage }) {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	function handleSubmit(e) {
		e.preventDefault();

		fetch('http://localhost:5000/login-user', {
			method: 'POST',
			crossDomain: true,
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
				'Access-Control-Allow-Origin': '*',
			},
			body: JSON.stringify({
				email,
				password,
			}),
		})
			.then((res) => res.json())
			.then((data) => {

				if (data.status == 'ok') {

					window.localStorage.setItem('token', data.data);
					handleLogin();

				} else
					handleMessage({
						messageText: 'Invalid Userdata. Try again.',
						messageType: 'negative',
					});
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
			<form className={styles.formContainer} onSubmit={handleSubmit}>
				{' '}
				<title>Log Into Flow</title>
				<h3>Sign In</h3>
				<div className="mb-3">
					<label htmlFor="email">E-Mail</label>
					<input
						id="email"
						name="email"
						type="email"
						className="form-control"
						placeholder="Enter E-Mail"
						onChange={(e) => setEmail(e.target.value)}
						autoComplete="email"
						required
					/>
				</div>
				<div className="mb-3">
					<label htmlFor="password">Password</label>
					<input
						id="password"
						name="password"
						type="password"
						className="form-control"
						placeholder="Enter Password"
						onChange={(e) => setPassword(e.target.value)}
						required
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
