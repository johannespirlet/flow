import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './styles.module.css';
import Icon from '../../../assets/icons/Icon';
import { ICONS } from '../../../assets/icons/icons';

export default function AddContact({ handleMessage }) {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		fname: '',
		lname: '',
		email: '',
		password: '',
		phone: '',
		note: '',
		userType: '',
	});

	const handleChange = (event) => {
		const { name, value } = event.target;
		setFormData({
			...formData,
			[name]: value,
		});
	};

	const handleSubmit = async (event) => {
		event.preventDefault();

		try {
			const response = await fetch('http://localhost:5000/addUser', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(formData),
			});

			const { status } = await response.json();

			if (status === 'ok') {
				handleMessage({
					messageText: 'New contact added!',
					messageType: 'positive',
				});
				navigate('../Contacts');
			} else {
				handleMessage({
					messageText: 'User already exists. Please change your data',
					messageType: 'negative',
				});
			}
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<>
			<title>Add a Contact - Flow </title>
			<h1 className={styles.title}>Add New Contact</h1>
			<form onSubmit={handleSubmit} className={styles.formContainer}>
				<div className={styles.formRow}>
					Select a Usertype
					<div>
						<input
							type="radio"
							name="userType"
							id="user"
							value="User"
							onChange={handleChange}
							required
						/>
						<label htmlFor="user">User</label>
					</div>
					<div>
						<input
							type="radio"
							name="userType"
							value="Admin"
							id="admin"
							onChange={handleChange}
							required
						/>
						<label htmlFor="admin">Admin</label>
					</div>
				</div>

				<div className={styles.formRow}>
					<div>
						<label htmlFor="fname">First Name</label>
						<input
							type="text"
							className="form-control"
							id="fname"
							name="fname"
							placeholder="First Name"
							onChange={handleChange}
							autoComplete="off"
							required
						/>
					</div>
					<div>
						<label htmlFor="lname">Last Name</label>
						<input
							type="text"
							className="form-control"
							id="lname"
							name="lname"
							placeholder="Last Name"
							onChange={handleChange}
							autoComplete="off"
							required
						/>
					</div>
				</div>

				<div className={styles.formRow}>
					<div>
						<label htmlFor="email">Email Address</label>
						<input
							type="email"
							className="form-control"
							id="email"
							name="email"
							placeholder="Enter an Email Address"
							onChange={handleChange}
							autoComplete="off"
							required
						/>
					</div>
					<div>
						<label htmlFor="password">Password</label>
						<input
							type="password"
							className="form-control"
							id="password"
							name="password"
							placeholder="Enter a Password"
							onChange={handleChange}
							autoComplete="off"
							required
						/>
					</div>
				</div>

				<div className={styles.formRow}>
					<div>
						<label htmlFor="phone">Phone (optional)</label>
						<input
							type="text"
							className="form-control"
							id="phone"
							name="phone"
							placeholder="Enter a Phonenumber"
							onChange={handleChange}
							autoComplete="off"
						/>
					</div>
					<div>
						<label htmlFor="note">Note (optional)</label>
						<input
							type="text"
							className="form-control"
							id="note"
							name="note"
							placeholder="Enter a Note"
							onChange={handleChange}
							autoComplete="off"
						/>
					</div>
				</div>

				<div className={styles.formRow}>
					<Link to={'../Contacts'} className="btn btn-secondary">
						<Icon icon={ICONS.back} size="1.5rem" color="white" />
						Go Back
					</Link>
					<button type="submit" className="btn btn-primary">
						<Icon icon={ICONS.addContact2} size="1.5rem" color="white" />
						Add Contact
					</button>
				</div>
			</form>
		</>
	);
}
