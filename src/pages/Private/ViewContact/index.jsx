import { useOutletContext, useParams, Link } from 'react-router-dom';
import styles from './styles.module.css';
import { useState, useEffect } from 'react';
import DialogMessage from '../../../components/DialogMessage';
import { ICONS } from '../../../assets/icons/icons';
import Icon from '../../../assets/icons/Icon';

export default function ViewContact({ handleMessage }) {
	const { id } = useParams();
	const userData = useOutletContext();
	const [activeDialog, setActiveDialog] = useState('');
	const [isEditable, setIsEditable] = useState(false);
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

	useEffect(() => {
		const getContactData = () => {
			fetch('http://localhost:5000/findUser', {
				method: 'POST',
				crossDomain: true,
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json',
					'Access-Control-Allow-Origin': '*',
				},
				body: JSON.stringify({
					id: id,
				}),
			})
				.then((res) => res.json())
				.then((data) => {
					setFormData({
						fname: data.data.fname,
						lname: data.data.lname,
						email: data.data.email,
						password: 'empty',
						phone: data.data.phone,
						note: data.data.note,
						userType: data.data.userType,
						color: data.data.color,
					});
				});
		};
		getContactData();
	}, []);

	const handleDeletionDialog = () => {
		let notification = {
			dialogText: 'Are you sure to delete this contact?',
			navigateTo: '../contacts',
			target: id,
			type: 'deletion',
			buttonConfirmText: 'Delete',
		};
		setActiveDialog(notification);
	};
	const handleEditSubmit = (e) => {
		e.preventDefault();
		let notification = {
			dialogText: 'Are you sure to edit this contact?',
			target: id,
			navigateTo: '../contacts',
			formData,
			type: 'edit',
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
					{userData.userType == 'Admin' && (
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
					<form onSubmit={handleEditSubmit} className={styles.formContainer}>
						{userData.userType == 'Admin' && (
							<div className={styles.formRow}>
								Select a Usertype
								<div>
									<input
										type="radio"
										id="user"
										name="userType"
										checked={formData.userType == 'User'}
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
										checked={formData.userType == 'Admin'}
										value="Admin"
										onChange={handleChange}
									/>
									<label htmlFor="admin">Admin</label>
								</div>
							</div>
						)}

						<div className={styles.formRow}>
							<div>
								<label htmlFor="fname">First Name</label>
								<input
									type="text"
									name="fname"
									id="fname"
									className="form-control"
									value={formData.fname}
									onChange={handleChange}
								/>
							</div>
							<div>
								<label htmlFor="lname">Last Name</label>
								<input
									type="text"
									name="lname"
									id="lname"
									value={formData.lname}
									className="form-control"
									onChange={handleChange}
									autoComplete="off"
								/>
							</div>
						</div>

						{userData.userType == 'Admin' && (
							<div className={styles.formRow}>
								<div>
									<label htmlFor="email">E-Mail Address</label>
									<input
										type="email"
										id="email"
										name="email"
										className="form-control"
										value={formData.email}
										onChange={handleChange}
										autoComplete="off"
									/>
								</div>
								<div>
									<label htmlFor="password">Password</label>
									<input
										type="password"
										id="password"
										name="password"
										placeholder="Choose New Password"
										className="form-control"
										onChange={handleChange}
										autoComplete="off"
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
									value={formData.phone}
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
									value={formData.note}
									onChange={handleChange}
									autoComplete="off"
								/>
							</div>
						</div>

						<div className={`${styles.buttonRow} ${styles.formRow}`}>
							<Link to={'../Contacts'} className="btn btn-secondary">
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
