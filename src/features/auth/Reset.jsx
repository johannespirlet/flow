import { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from './auth.module.css';

export default class Reset extends Component {
	constructor(props) {
		super(props);
		this.state = {
			email: '',
		};
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleSubmit(e) {
		e.preventDefault();
		const { email } = this.state;
		fetch('http://localhost:5000/forgot-password', {
			method: 'POST',
			crossDomain: true,
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
				'Access-Control-Allow-Origin': '*',
			},
			body: JSON.stringify({ email }),
		}).then((res) =>
			res.json().then((data) => {
				const notification = {
					messageText: data.data,
					messageType: data.status == 'ok' ? 'positive' : 'negative',
				};
				this.props.handleMessage(notification);
			})
		);
	}

	render() {
		return (
			<div className={styles.authContainer}>
				<form className={styles.formContainer} onSubmit={this.handleSubmit}>
					{' '}
					<h3>Forgot Password</h3>
					<div className="mb-3">
						<label htmlFor="email">Email address</label>
						<input
							type="email"
							id="email"
							name="email"
							className="form-control"
							placeholder="Enter E-Mail"
							onChange={(e) => this.setState({ email: e.target.value })}
							autoComplete="email"
						/>
					</div>
					<div className="d-grid">
						<button
							type="submit"
							className="btn btn-primary"
						>
							Submit
						</button>
					</div>
					<p className="forgot-password text-right">
						<Link to="../sign-up">Sign Up</Link>
					</p>
					<p>
						This is an educational project with low security. Please do not
						enter any confidential information.
					</p>
				</form>
			</div>
		);
	}
}
