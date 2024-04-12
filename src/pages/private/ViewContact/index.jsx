import { useOutletContext, useParams, Link } from 'react-router-dom';
import styles from './styles.module.css';
import { useState, useEffect } from 'react';
import DialogMessage from '../../../components/DialogMessage';
import { ICONS } from '../../../assets/icons/icons';
import Icon from '../../../assets/icons/Icon';
import {
	validateName,
	validateEmail,
	validatePassword,
} from '../../../helpers/validation';

export default function ViewContact({ handleMessage }) {
	const { id } = useParams();
	const userData = useOutletContext();
	const [activeDialog, setActiveDialog] = useState('');
	const [isEditable, setIsEditable] = useState(false);
	const [formData, setFormData] = useState({});
	const [newFormData, setNewFormData] = useState({});
	const [formErrors, setFormErrors] = useState({});

	const handleChange = (event) => {
		const { name, value } = event.target;
		setNewFormData({
			...newFormData,
			[name]: value,
		});
	};

	useEffect(() => {
		const fetchContactData = async () => {
			try {
				const response = await fetch(`http://localhost:5000/findUser`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'Access-Control-Allow-Origin': '*',
					},
					body: JSON.stringify({ id }),
				});
				const { data } = await response.json();
				setFormData(data);
				setNewFormData(data);
			} catch (error) {
				console.error(error);
			}
		};
		fetchContactData();
	}, []);

	const handleDeletionDialog = () => {
		let notification = {
			dialogText: 'Are you sure to delete this contact?',
			navigateTo: '../contacts',
			target: id,
			type: 'contactDeletion',
			buttonConfirmText: 'Delete',
		};
		setActiveDialog(notification);
	};

	const handleEditSubmit = (e) => {
		e.preventDefault();

		const fnameError = validateName(newFormData.fname);
		const lnameError = validateName(newFormData.lname);
		const emailError = validateEmail(newFormData.email);
		const passwordError = validatePassword(newFormData.password);

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

		let notification = {
			dialogText: 'Are you sure to edit this contact?',
			target: id,
			navigateTo: '../contacts',
			newFormData,
			type: 'editContact',
			buttonConfirmText: 'Edit',
		};
		setActiveDialog(notification);
	};

	return (
		<>
			<header className={styles.headerContainer}>
				<div>
					<div
						className={styles.avatar}
						style={{ backgroundColor: formData.color }}
					>
						{(formData.fname?.toUpperCase()?.charAt(0) || '') +
							(formData.lname?.toUpperCase()?.charAt(0) || '')}
					</div>
					<h2>
						{formData.fname} {formData.lname}
					</h2>
				</div>
				<div className={styles.btnBox}>
					{userData.userType === 'Admin' && (
						<button
							className={`btn btn-secondary ${styles.contactBtn}`}
							onClick={handleDeletionDialog}
						>
							<Icon icon={ICONS.deleteUser} size="1.6rem" color="white" />
						</button>
					)}
					<button
						className={`btn btn-secondary ${styles.contactBtn} ${
							isEditable ? styles.active : ''
						}`}
						onClick={() => setIsEditable(!isEditable)}
					>
						<Icon icon={ICONS.edit} size="1.6rem" color="white" />
					</button>
				</div>
			</header>
			<div>
				{isEditable ? (
					<form
						onSubmit={handleEditSubmit}
						className={styles.formContainer}
						noValidate
					>
						{userData.userType === 'Admin' && (
							<div className={styles.formRow}>
								Select a Usertype
								<div>
									<input
										type="radio"
										id="user"
										name="userType"
										checked={newFormData.userType === 'User'}
										value="User"
										onChange={handleChange}
									/>
									<label htmlFor="user">User</label>
								</div>
								<div>
									<input
										type="radio"
										id="admin"
										name="userType"
										checked={newFormData.userType === 'Admin'}
										value="Admin"
										onChange={handleChange}
									/>
									<label htmlFor="admin">Admin</label>
								</div>
							</div>
						)}

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
									name="fname"
									id="fname"
									className="form-control"
									value={newFormData.fname}
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
							<div>
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
									value={newFormData.lname}
									className="form-control"
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

						{userData.userType === 'Admin' && (
							<div className={styles.formRow}>
								<div>
									<div className={styles.labelRow}>
										<label htmlFor="email">E-Mail</label>
										{formErrors.email && (
											<span className={styles.formError}>
												{formErrors.email}
											</span>
										)}
									</div>
									<input
										type="email"
										id="email"
										name="email"
										className="form-control"
										value={newFormData.email}
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
											<span className={styles.formError}>
												{formErrors.password}
											</span>
										)}
									</div>
									<input
										type="password"
										id="password"
										name="password"
										placeholder="Choose New Password"
										className="form-control"
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
						)}

						<div className={styles.formRow}>
							<div>
								<label htmlFor="phone">Phone</label>
								<input
									type="text"
									id="phone"
									name="phone"
									value={newFormData.phone}
									placeholder="Enter a Phonenumber"
									className="form-control"
									onChange={handleChange}
									autoComplete="off"
								/>
							</div>
							<div>
								<label htmlFor="note">Note</label>
								<input
									type="text"
									id="note"
									name="note"
									placeholder="Enter a Note"
									className="form-control"
									value={newFormData.note}
									onChange={handleChange}
									autoComplete="off"
								/>
							</div>
						</div>

						<div className={`${styles.buttonRow} ${styles.formRow}`}>
							<Link to={'../contacts'} className="btn btn-secondary">
								<Icon icon={ICONS.cancel} size="1.5rem" color="white" />
								Discard
							</Link>
							<button type="submit" className="btn btn-primary">
								<Icon icon={ICONS.save} size="1.5rem" color="white" />
								Save Changes
							</button>
						</div>
					</form>
				) : (
					<div className={styles.formContainer}>
						<div className={styles.contactColumn}>
							<p>
								<strong>E-Mail</strong>
							</p>
							<p>
								<strong>Phone</strong>
							</p>
							<p>
								<strong>Type</strong>
							</p>
							<p>
								<strong>Note</strong>
							</p>
						</div>

						<div className={styles.contactColumn}>
							<p>{formData.email}</p>
							<p>{formData.phone ? formData.phone : '-'}</p>
							<p>{formData.userType}</p>
							<p>{formData.note ? `"${formData.note}"` : '-'}</p>
						</div>
					</div>
				)}
			</div>
			<DialogMessage
				handleMessage={handleMessage}
				activeDialog={activeDialog}
			/>
		</>
	);
}
