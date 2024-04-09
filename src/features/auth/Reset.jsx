import { Link } from 'react-router-dom';
import styles from './auth.module.css';
import { validateEmail } from '../../helpers/validation';
import { useState } from 'react';

export default function Reset({ handleMessage }) {
	const [email, setEmail] = useState('');
	const [emailError, setEmailError] = useState('');

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (emailError) {
			handleMessage({
				messageText: 'Please enter a valid email address',
				messageType: 'negative',
			});
			return;
		}

		try {
			const response = await fetch('http://localhost:5000/forgot-password', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Access-Control-Allow-Origin': '*',
				},
				body: JSON.stringify({ email }),
			});

			const { data, status } = await response.json();

			const notification = {
				messageText: data,
				messageType: status === 'ok' ? 'positive' : 'negative',
			};

			handleMessage(notification);
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<div className={styles.authContainer}>
			<form className={styles.formContainer} onSubmit={handleSubmit}>
				<h3>Forgot Password</h3>
				<div className="mb-3">
					<div className={styles.labelRow}>
						<label htmlFor="email">E-Mail</label>
						{emailError && (
							<span className={styles.formError}>{emailError}</span>
						)}
					</div>
					<input
						type="email"
						id="email"
						name="email"
						className="form-control"
						placeholder="Enter E-Mail"
						onChange={(e) => setEmail(e.target.value)}
						onBlur={(e) => setEmailError(validateEmail(e.target.value))}
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
