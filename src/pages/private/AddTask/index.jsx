import styles from './styles.module.css';
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ColorRing } from 'react-loader-spinner';

import Icon from '../../../assets/icons/Icon';
import { ICONS } from '../../../assets/icons/icons';
import departments from '../../../data/departments';
import {
	validateName,
	validateArray,
	validateDate,
	validatePrio,
} from '../../../helpers/validation';

export default function AddTask({ dispatchMessage }) {
	const navigate = useNavigate();
	const [contacts, setContacts] = useState([]);
	const [inputValue, setInputValue] = useState('');
	const [formErrors, setFormErrors] = useState({});
	const [taskData, setTaskData] = useState({
		title: '',
		description: '',
		department: '',
		section: 'To Do',
		assignedTo: [],
		dueDate: '',
		priority: '',
		subTasks: [],
	});

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const response = await fetch('http://localhost:5000/getAllUser', {
					method: 'GET',
				});
				const data = await response.json();
				setContacts(data.data);
			} catch (error) {
				console.error('Error fetching users:', error);
			}
		};
		fetchUsers();

		return () => {};
	}, []);

	if (!contacts) {
		return (
			<ColorRing
				visible={true}
				height="80"
				width="80"
				ariaLabel="color-ring-loading"
				wrapperStyle={{
					position: 'relative',
					left: '50%',
					top: '50%',
					transform: 'translate(-50%, -50%)',
				}}
				wrapperClass={`color-ring-wrapper`}
				colors={['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87']}
			/>
		);
	}

	const handleChange = (event) => {
		const { name, value } = event.target;
		if (name === 'assignedTo') {
			const ifExists = taskData.assignedTo.find(({ id }) => id === value);
			const { color, _id, fname, lname } = contacts.find(
				({ _id }) => _id === value
			);
			if (formErrors.assignedTo && taskData.assignedTo.length === 0)
				setFormErrors({ ...formErrors, assignedTo: '' });

			if (ifExists !== undefined) {
				setTaskData({
					...taskData,
					[name]: taskData.assignedTo.filter(({ id }) => id !== value),
				});
			} else {
				setTaskData({
					...taskData,
					[name]: [
						...taskData.assignedTo,
						{
							id: _id,
							fname,
							lname,
							initials:
								fname.toUpperCase().charAt(0) + lname.toUpperCase().charAt(0),
							color,
						},
					],
				});
			}
		} else if (name === 'subTasks')
			setTaskData({
				...taskData,
				[name]: [...taskData.subTasks, { taskName: value, checked: false }],
			});
		else {
			setTaskData({
				...taskData,
				[name]: value,
			});
		}
	};

	const isAssignedToChecked = (id) => {
		return taskData.assignedTo.some(
			({ id: assignedToId }) => assignedToId === id
		);
	};

	const handleKeypress = (event) => {
		if (event.key === 'Enter') {
			event.preventDefault();
			if (inputValue.trim() !== '') {
				handleChange(event);
				setInputValue('');
			}
		}
	};

	const handleButtonPress = (event) => {
		event.preventDefault();
		if (inputValue.trim() !== '') {
			setTaskData({
				...taskData,
				subTasks: [
					...taskData.subTasks,
					{ taskName: inputValue, checked: false },
				],
			});
			setInputValue('');
		}
	};

	const handleSubCheck = (taskName) => {
		setTaskData({
			...taskData,
			subTasks: taskData.subTasks.map((task) => {
				if (task.taskName === taskName) {
					return { ...task, checked: !task.checked };
				}
				return task;
			}),
		});
	};

	const handleTaskSubmission = async (event) => {
		event.preventDefault();
		console.log(taskData);

		const titleError = validateName(taskData.title);
		const departmentError = validateName(taskData.department);
		const assignedToError = validateArray(taskData.assignedTo);
		const dueDateError = validateDate(taskData.dueDate);
		const prioError = validatePrio(taskData.priority);

		if (
			titleError ||
			departmentError ||
			assignedToError ||
			dueDateError ||
			prioError
		) {
			dispatchMessage({
				type: 'SET_MESSAGE',
				payload: {
					messageText: 'Please check your input and try again',
					messageType: 'negative',
				},
			});
			setFormErrors({
				title: titleError,
				department: departmentError,
				assignedTo: assignedToError,
				dueDate: dueDateError,
				priority: prioError,
			});
			return;
		}

		try {
			const response = await fetch('http://localhost:5000/addTask', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(taskData),
			});

			const { status } = await response.json();

			if (status === 'ok') {
				dispatchMessage({
					type: 'SET_MESSAGE',
					payload: {
						messageText: 'New Task added!',
						messageType: 'positive',
					},
				});
				navigate('../viewBoard');
			} else {
				dispatchMessage({
					type: 'SET_MESSAGE',
					payload: {
						messageText: 'An Error occurred',
						messageType: 'negative',
					},
				});
			}
		} catch (error) {
			console.error(error);
		}
	};
	return (
		<>
			<title>Add a Task ..and Flow</title>
			<h1 className={styles.title}>New Task</h1>
			<form
				onSubmit={handleTaskSubmission}
				className={styles.formContainer}
				noValidate
			>
				<div className={styles.labelRow}>
					<label htmlFor="title">Title</label>
					{formErrors.title && (
						<span className={styles.formError}>{formErrors.title}</span>
					)}
				</div>
				<input
					type="text"
					className="form-control"
					id="title"
					name="title"
					placeholder="Choose a Title"
					value={taskData.title}
					onChange={handleChange}
					autoComplete="off"
					onBlur={
						formErrors.title
							? (e) =>
									setFormErrors({
										...formErrors,
										title: validateName(e.target.value),
									})
							: null
					}
				/>
				<label htmlFor="description">Description (optional)</label>
				<input
					type="text"
					className="form-control"
					id="description"
					name="description"
					placeholder="Describe this Task"
					value={taskData.description}
					onChange={handleChange}
					autoComplete="off"
				/>
				<div className={styles.labelRow}>
					<label htmlFor="department">Category</label>
					{formErrors.department && (
						<span className={styles.formError}>{formErrors.department}</span>
					)}
				</div>
				<select
					onChange={handleChange}
					onInput={
						formErrors.department
							? (e) =>
									setFormErrors({
										...formErrors,
										department: validateName(e.target.value),
									})
							: null
					}
					id="department"
					name="department"
					className="form-select"
				>
					<option value="">No Category</option>
					{departments.map(({ id, name, color }) => {
						return (
							<option
								key={id}
								className={styles.selectOption}
								value={name}
								style={{ backgroundColor: color }}
							>
								{name}
							</option>
						);
					})}
				</select>
				<div className={styles.labelRow}>
					<label htmlFor="assignedTo">Assign this task to</label>
					{formErrors.assignedTo && (
						<span className={styles.formError}>{formErrors.assignedTo}</span>
					)}
				</div>
				<ul className={styles.contactList}>
					{contacts &&
						contacts.map(({ _id, fname, lname }) => {
							return (
								<li key={_id} className={styles.contactListItem}>
									<label htmlFor={`${fname} ${lname}`}>
										<input
											type="checkbox"
											name="assignedTo"
											value={_id}
											id={`${fname} ${lname}`}
											checked={isAssignedToChecked(_id)}
											onChange={handleChange}
										/>
										{fname} {lname}
									</label>
								</li>
							);
						})}
				</ul>
				<div className={styles.labelRow}>
					<label htmlFor="dueDate">Due Date</label>
					{formErrors.dueDate && (
						<span className={styles.formError}>{formErrors.dueDate}</span>
					)}
				</div>
				<input
					type="date"
					className="form-control"
					id="dueDate"
					name="dueDate"
					onChange={handleChange}
					autoComplete="off"
					onInput={
						formErrors.dueDate
							? (e) =>
									setFormErrors({
										...formErrors,
										dueDate: validateName(e.target.value),
									})
							: null
					}
				/>
				<label htmlFor="low">Prio</label>
				<div className={styles.buttonRow}>
					<div className={styles.radioButton}>
						<input
							type="radio"
							id="low"
							name="priority"
							value="low"
							onChange={handleChange}
							onInput={
								formErrors.priority
									? () => setFormErrors({ ...formErrors, priority: '' })
									: null
							}
							className="form-control"
						/>
						<label
							htmlFor="low"
							style={{
								backgroundColor:
									taskData.priority === 'low'
										? 'var(--bs-success)'
										: 'var(--bs-gray-100)',
								color: taskData.priority === 'low' ? 'var(--bs-white)' : '',
							}}
						>
							Low
							<Icon
								icon={ICONS.low}
								size="1.5rem"
								color={
									taskData.priority === 'low'
										? 'var(--bs-white)'
										: 'var(--bs-success)'
								}
							/>
						</label>
					</div>
					<div className={styles.radioButton}>
						<input
							type="radio"
							id="medium"
							name="priority"
							value="medium"
							onChange={handleChange}
							onInput={
								formErrors.priority
									? () => setFormErrors({ ...formErrors, priority: '' })
									: null
							}
							className="form-control"
						/>
						<label
							htmlFor="medium"
							style={{
								backgroundColor:
									taskData.priority === 'medium'
										? 'var(--bs-warning)'
										: 'var(--bs-gray-100)',
								color: taskData.priority === 'medium' ? 'var(--bs-white)' : '',
							}}
						>
							Medium
							<Icon
								icon={ICONS.medium}
								size="1.5rem"
								color={
									taskData.priority === 'medium'
										? 'var(--bs-white)'
										: 'var(--bs-warning)'
								}
							/>
						</label>
					</div>
					<div className={styles.radioButton}>
						<input
							type="radio"
							id="high"
							name="priority"
							value="high"
							onChange={handleChange}
							onInput={
								formErrors.priority
									? () => setFormErrors({ ...formErrors, priority: '' })
									: null
							}
							className="form-control"
						/>
						<label
							htmlFor="high"
							style={{
								backgroundColor:
									taskData.priority === 'high'
										? 'var(--bs-danger)'
										: 'var(--bs-gray-100)',
								color: taskData.priority === 'high' ? 'var(--bs-white)' : '',
							}}
						>
							High
							<Icon
								icon={ICONS.high}
								size="1.5rem"
								color={
									taskData.priority === 'high'
										? 'var(--bs-white)'
										: 'var(--bs-danger)'
								}
							/>
						</label>
					</div>
					{formErrors.priority && (
						<span className={styles.formError}>{formErrors.priority}</span>
					)}
				</div>
				<label htmlFor="subTasks">Subtasks (optional)</label>
				<div>
					<input
						type="text"
						className={`form-control ${styles.subTaskInput}`}
						id="subTasks"
						name="subTasks"
						value={inputValue}
						placeholder="Add a Subtask"
						onChange={(e) => setInputValue(e.target.value)}
						onKeyDown={handleKeypress}
					/>
					<button
						className={`btn btn-secondary ${styles.addButton}`}
						onClick={handleButtonPress}
					>
						<Icon icon={ICONS.add} size="2rem" color="var(--bs-white)" />
					</button>
				</div>
				{taskData.subTasks.length > 0 && (
					<ul className={styles.subTaskList}>
						{taskData.subTasks.map(({ taskName, checked }, index) => {
							return (
								<li key={index}>
									<label htmlFor={`${taskName}${index}`}>
										<input
											id={`${taskName}${index}`}
											name={`${taskName}${index}`}
											type="checkbox"
											className={styles.subTaskCheckbox}
											checked={checked}
											onChange={() => handleSubCheck(taskName)}
										/>
										{taskName}
									</label>
								</li>
							);
						})}
					</ul>
				)}
				<div className={styles.buttonRow}>
					<Link to={'../Summary'} className="btn btn-secondary">
						<Icon icon={ICONS.back} size="1.5rem" color="white" />
						Abandon
					</Link>
					<button type="submit" className="btn btn-primary">
						<Icon icon={ICONS.addContact2} size="1.5rem" color="white" />
						Add Task
					</button>
				</div>
			</form>
		</>
	);
}
