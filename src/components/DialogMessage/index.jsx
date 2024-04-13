import { useNavigate } from 'react-router-dom';
import styles from './styles.module.css';
import { useState, useEffect } from 'react';

export default function DialogMessage({ dispatchMessage, activeDialog }) {
	const [isVisible, setIsVisible] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		if (activeDialog) setIsVisible(true);
	}, [activeDialog]);

	const handleConfirmation = () => {
		const { type, target } = activeDialog;
		const handlers = {
			contactDeletion: deleteUser,
			taskDeletion: deleteTask,
			editContact: editUser,
			editTask: editTask,
		};

		if (handlers[type]) {
			handlers[type](target);
		}
	};

	const deleteUser = (id) => {
		fetch('http://localhost:5000/deleteUser', {
			method: 'POST',
			crossDomain: true,
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
				'Access-Control-Allow-Origin': '*',
			},
			body: JSON.stringify({
				userid: id,
			}),
		})
			.then((res) => res.json())
			.then(() => {
				dispatchMessage({
					type: 'SET_MESSAGE',
					payload: {
						messageText: 'Deletion Successful',
						messageType: 'positive',
					},
				});
				navigate(activeDialog.navigateTo, { replace: true });
			});
	};

	const deleteTask = (id) => {
		fetch('http://localhost:5000/deleteTask', {
			method: 'POST',
			crossDomain: true,
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
				'Access-Control-Allow-Origin': '*',
			},
			body: JSON.stringify({
				id,
			}),
		})
			.then((res) => res.json())
			.then(() => {
				dispatchMessage({
					type: 'SET_MESSAGE',
					payload: {
						messageText: 'Deletion Successful',
						messageType: 'positive',
					},
				});
				navigate(activeDialog.navigateTo, { replace: true });
			});
	};

	const editUser = () => {
		fetch('http://localhost:5000/updateUser', {
			method: 'POST',
			crossDomain: true,
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
				'Access-Control-Allow-Origin': '*',
			},
			body: JSON.stringify({
				id: activeDialog.target,
				...activeDialog.newFormData,
			}),
		})
			.then((res) => res.json())
			.then((data) => {
				if (data.status == 'ok') {
					dispatchMessage({
						type: 'SET_MESSAGE',
						payload: {
							messageText: 'Edit Successful',
							messageType: 'positive',
						},
					});
					navigate(activeDialog.navigateTo, { replace: true });
				} else {
					dispatchMessage({
						type: 'SET_MESSAGE',
						payload: {
							messageText: 'User already exists. Change your data',
							messageType: 'negative',
						},
					});
				}
			});
	};

	const editTask = () => {
		fetch('http://localhost:5000/updateTask', {
			method: 'POST',
			crossDomain: true,
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
				'Access-Control-Allow-Origin': '*',
			},
			body: JSON.stringify({
				id: activeDialog.target,
				...activeDialog.newTaskData,
			}),
		})
			.then((res) => res.json())
			.then((data) => {
				if (data.status == 'ok') {
					dispatchMessage({
						type: 'SET_MESSAGE',
						payload: {
							messageText: 'Edit Successful',
							messageType: 'positive',
						},
					});
					navigate(activeDialog.navigateTo, { replace: true });
				} else {
					dispatchMessage({
						type: 'SET_MESSAGE',
						payload: {
							messageText: 'Ups... something went wrong',
							messageType: 'negative',
						},
					});
				}
			});
	};

	return (
		<div
			className={`${styles.dialogWindow} ${isVisible ? styles.visible : ''}`}
		>
			{activeDialog.dialogText}
			<button className="btn btn-primary" onClick={handleConfirmation}>
				{activeDialog.buttonConfirmText}
			</button>
			<button className="btn btn-secondary" onClick={() => setIsVisible(false)}>
				Cancel
			</button>
		</div>
	);
}
