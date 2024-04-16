import { Link } from 'react-router-dom';
import styles from './auth.module.css';
import { useState } from 'react';

export default function Reset({ dispatchMessage }) {
	const [email, setEmail] = useState('');

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			const response = await fetch('https://flow-eta-bay.vercel.app/api/forgot-password', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Access-Control-Allow-Origin': '*',
				},
				body: JSON.stringify({ email }),
			});

			const { data, status } = await response.json();

			dispatchMessage({
				type: 'SET_MESSAGE',
				payload: {
					messageText: data,
					messageType: status === 'ok' ? 'positive' : 'negative',
				},
			});
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<div className={styles.authContainer}>
			<form className={styles.formContainer} onSubmit={handleSubmit} noValidate>
				<h3>Forgot Password</h3>
				<div className="mb-3">
					<div className={styles.labelRow}>
						<label htmlFor="email">E-Mail</label>
					</div>
					<input
						type="email"
						id="email"
						name="email"
						className="form-control"
						placeholder="Enter E-Mail"
						onChange={(e) => setEmail(e.target.value)}
						autoComplete="email"
					/>
				</div>
				<div className="d-grid">
					<button type="submit" className="btn btn-primary">
						Submit
					</button>
				</div>
				<p className="forgot-password text-right">
					<Link to="../sign-up">Sign Up</Link>
				</p>
				<p>
					This is an educational project with low security. Please do not enter
					any confidential information.
				</p>
			</form>
		</div>
	);
}
