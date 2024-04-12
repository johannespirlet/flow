import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './styles.module.css';
import Icon from '../../../assets/icons/Icon';
import { ICONS } from '../../../assets/icons/icons';
import {
	validateName,
	validateEmail,
	validatePassword,
} from '../../../helpers/validation';

export default function AddContact({ handleMessage }) {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		userType: 'User',
		fname: '',
		lname: '',
		email: '',
		password: '',
	});
	const [formErrors, setFormErrors] = useState({});

	const handleChange = (event) => {
		const { name, value } = event.target;
		setFormData({
			...formData,
			[name]: value,
		});
	};

	const handleSubmit = async (event) => {
		event.preventDefault();

		const fnameError = validateName(formData.fname);
		const lnameError = validateName(formData.lname);
		const emailError = validateEmail(formData.email);
		const passwordError = validatePassword(formData.password);

		if (fnameError || lnameError || emailError || passwordError) {
			handleMessage({
				messageText: 'Please check your input and try again',
				messageType: 'negative',
			});
			setFormErrors({
				fname: fnameError,
				lname: lnameError,
				email: emailError,
				password: passwordError,
			});
			return;
		}

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
			<form onSubmit={handleSubmit} className={styles.formContainer} noValidate>
				<div className={styles.formRow}>
					Select a Usertype
					<div>
						<input
							type="radio"
							name="userType"
							id="user"
							value="User"
							onChange={handleChange}
							checked={formData.userType === 'User'}
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
							checked={formData.userType === 'Admin'}
						/>
						<label htmlFor="admin">Admin</label>
					</div>
				</div>

				<div className={styles.formRow}>
					<div>
						<div className={styles.labelRow}>
							<label htmlFor="fname">First Name</label>
							{formErrors.fname && (
								<span className={styles.formError}>{formErrors.fname}</span>
							)}
						</div>
						<input
							type="text"
							className="form-control"
							id="fname"
							name="fname"
							placeholder="First Name"
							onChange={handleChange}
							autoComplete="off"
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
					<div>
						<div className={styles.labelRow}>
							<label htmlFor="lname">Last Name</label>
							{formErrors.lname && (
								<span className={styles.formError}>{formErrors.lname}</span>
							)}
						</div>
						<input
							type="text"
							className="form-control"
							id="lname"
							name="lname"
							placeholder="Last Name"
							onChange={handleChange}
							autoComplete="off"
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
				</div>

				<div className={styles.formRow}>
					<div>
						<div className={styles.labelRow}>
							<label htmlFor="email">E-Mail</label>
							{formErrors.email && (
								<span className={styles.formError}>{formErrors.email}</span>
							)}
						</div>
						<input
							type="email"
							className="form-control"
							id="email"
							name="email"
							placeholder="Enter an Email Address"
							onChange={handleChange}
							autoComplete="off"
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
					<div>
						<div className={styles.labelRow}>
							<label htmlFor="password">Password</label>
							{formErrors.password && (
								<span className={styles.formError}>{formErrors.password}</span>
							)}
						</div>
						<input
							type="password"
							className="form-control"
							id="password"
							name="password"
							placeholder="Enter a Password"
							onChange={handleChange}
							autoComplete="off"
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
