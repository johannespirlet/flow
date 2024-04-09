import { Link, useParams } from 'react-router-dom';
import styles from './styles.module.css';
import { useEffect, useState } from 'react';
import departments from '../../../data/departments';
import { ICONS } from '../../../assets/icons/icons';
import Icon from '../../../assets/icons/Icon';
import { ColorRing } from 'react-loader-spinner';
import DialogMessage from '../../../components/DialogMessage';

export default function ViewTask({ handleMessage }) {
	const { id } = useParams();
	const [taskData, setTaskData] = useState(null);
	const [newTaskData, setNewTaskData] = useState(null);
	const [isEditable, setIsEditable] = useState(false);
	const [activeDialog, setActiveDialog] = useState('');
	const [contacts, setContacts] = useState([]);
	const [inputValue, setInputValue] = useState('');

	useEffect(() => {
		const fetchTaskData = async () => {
			try {
				const response = await fetch(`http://localhost:5000/findTask`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'Access-Control-Allow-Origin': '*',
					},
					body: JSON.stringify({ id }),
				});
				const { data } = await response.json();
				setTaskData(data);
				setNewTaskData(data);
			} catch (error) {
				console.error(error);
			}
		};
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
		fetchTaskData();
	}, []);

	const handleChange = (event) => {
		const { name, value } = event.target;
		if (name === 'assignedTo') {
			const ifExists = taskData.assignedTo.find(({ id }) => id === value);
			const { color, _id, fname, lname } = contacts.find(
				({ _id }) => _id === value
			);
			if (ifExists !== undefined) {
				setNewTaskData({
					...newTaskData,
					[name]: newTaskData.assignedTo.filter(({ id }) => id !== value),
				});
			} else {
				setNewTaskData({
					...newTaskData,
					[name]: [
						...newTaskData.assignedTo,
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
			setNewTaskData({
				...newTaskData,
				[name]: [...newTaskData.subTasks, { taskName: value, checked: false }],
			});
		else
			setNewTaskData({
				...newTaskData,
				[name]: value,
			});
	};

	const handleSubCheck = (taskName) => {
		setNewTaskData({
			...newTaskData,
			subTasks: newTaskData.subTasks.map((task) => {
				if (task.taskName === taskName) {
					return { ...task, checked: !task.checked };
				}
				return task;
			}),
		});
	};

	const handleDeletionDialog = () => {
		let notification = {
			dialogText: 'Are you sure to delete this task?',
			navigateTo: '../viewBoard',
			target: id,
			type: 'taskDeletion',
			buttonConfirmText: 'Delete',
		};
		setActiveDialog(notification);
	};
	const handleEditSubmit = (e) => {
		e.preventDefault();
		let notification = {
			dialogText: 'Are you sure to edit this task like this?',
			target: id,
			newTaskData,
			navigateTo: '../viewBoard',
			type: 'editTask',
			buttonConfirmText: 'Edit',
		};
		setActiveDialog(notification);
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
			setNewTaskData({
				...newTaskData,
				subTasks: [
					...newTaskData.subTasks,
					{ taskName: inputValue, checked: false },
				],
			});
			setInputValue('');
		}
	};

	const isAssignedToChecked = (id) => {
		return newTaskData.assignedTo.some(
			({ id: assignedToId }) => assignedToId === id
		);
	};

	const getPriorityIcon = (priority) => {
		switch (priority) {
			case 'low':
				return ICONS.low;
			case 'medium':
				return ICONS.medium;
			default:
				return ICONS.high;
		}
	};

	const getPriorityColor = (priority) => {
		switch (priority) {
			case 'low':
				return 'var(--bs-success)';
			case 'medium':
				return 'var(--bs-warning)';
			default:
				return 'var(--bs-danger)';
		}
	};

	if (!taskData) {
		return (
			<ColorRing
				visible
				height="80"
				width="80"
				ariaLabel="loading content"
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
	} else {
		const {
			department,
			title,
			description,
			assignedTo,
			priority,
			subTasks,
			dueDate,
		} = taskData;
		const departmentColor = departments.find(
			(d) => d.name === department
		).color;
		const priorityIcon = getPriorityIcon(priority);
		const priorityColor = getPriorityColor(priority);

		return (
			<section className={styles.taskContainer}>
				<title>Task {id} - Flow</title>
				<span
					className={styles.department}
					style={{
						backgroundColor: departmentColor,
						visibility: isEditable ? 'hidden' : 'visible',
					}}
				>
					{department}
				</span>
				<div className={styles.headerContainer}>
					<h1>{!isEditable ? title : `Edit '${title}'`}</h1>
					<div className={styles.btnBox}>
						<button
							className={`btn btn-secondary ${styles.headerButton}`}
							onClick={handleDeletionDialog}
						>
							<Icon icon={ICONS.deleteUser} size="1.6rem" color="white" />
						</button>
						<button
							className={`btn btn-secondary ${styles.headerButton} ${
								isEditable ? styles.active : ''
							}`}
							onClick={() => setIsEditable(!isEditable)}
						>
							<Icon icon={ICONS.edit} size="1.6rem" color="white" />
						</button>
					</div>
				</div>
				{!isEditable ? (
					<>
						{description && <p>{description}</p>}
						<div className={styles.flexrowCenter}>
							<label htmlFor="priority">
								<strong>Priority</strong>
							</label>
							<div
								id="priority"
								className={styles.priority}
								style={{ backgroundColor: priorityColor }}
							>
								{priority}
								<Icon
									icon={priorityIcon}
									size="1.5rem"
									color="var(--bs-white)"
								/>
							</div>
						</div>
						{
							<div className={styles.flexrowCenter}>
								<label>
									<strong>Due Date</strong>
								</label>
								{dueDate}
							</div>
						}

						{subTasks.length > 0 && (
							<div className={styles.flexrowStart}>
								<label htmlFor="subTaskList">
									<strong>Assigned Subtasks</strong>
								</label>
								<ul className={styles.inlineList} id="subTaskList">
									{subTasks.map(({ taskName, checked }, index) => {
										return (
											<li key={index} className={styles.subTaskListItem}>
												{checked ? (
													<Icon
														icon={ICONS.checked}
														size="1.5rem"
														color="var(--bs-success)"
													/>
												) : (
													<Icon
														icon={ICONS.unchecked}
														size="1.5rem"
														color="var(--bs-body-color)"
													/>
												)}
												<label htmlFor={`${taskName}${index}`}>
													{taskName}
												</label>
											</li>
										);
									})}
								</ul>
							</div>
						)}
						<div className={styles.flexrowStart}>
							<label htmlFor="assignedTo">
								<strong>Task is assigned to</strong>
							</label>
							<ul className={styles.inlineList}>
								{assignedTo.map(({ initials, color, id, fname, lname }) => {
									return (
										<li key={id}>
											<Link to={`../contacts/${id}`}>
												<div
													className={styles.avatar}
													style={{ backgroundColor: color }}
												>
													{initials}
												</div>
												{fname} {lname}
											</Link>
										</li>
									);
								})}
							</ul>
						</div>
					</>
				) : (
					<form onSubmit={handleEditSubmit} className={styles.formContainer}>
						<div className={styles.flexrowCenter}>
							<label htmlFor="title">
								<strong>Title</strong>
							</label>
							<input
								type="text"
								className="form-control"
								id="title"
								name="title"
								placeholder="Choose a Title"
								value={newTaskData.title}
								onChange={handleChange}
								autoComplete="off"
								required
							/>
						</div>
						<div className={styles.flexrowCenter}>
							<label htmlFor="description">
								<strong>Description</strong>
							</label>
							<input
								type="text"
								className="form-control"
								id="description"
								name="description"
								placeholder="Describe this Task"
								value={newTaskData.description}
								onChange={handleChange}
								autoComplete="off"
							/>
						</div>

						<div className={styles.flexrowCenter}>
							<label htmlFor="department">
								<strong>Category</strong>
							</label>
							<select
								onChange={handleChange}
								id="department"
								name="department"
								className="form-select"
								required
							>
								<option value={newTaskData.department}>
									{newTaskData.department}
								</option>
								{departments.map(({ id, name, color }) => {
									if (newTaskData.department !== name)
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
						</div>
						<div>
							<label htmlFor="assignedTo">
								<strong>Assigned To</strong>
							</label>
							<ul className={styles.contactList} id="assignedTo">
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
						</div>
						<div className={styles.flexrowCenter}>
							<label htmlFor="dueDate">
								<strong>Deadline</strong>
							</label>
							<input
								type="date"
								className="form-control"
								id="dueDate"
								name="dueDate"
								value={newTaskData.dueDate}
								onChange={handleChange}
								autoComplete="off"
								required
							/>
						</div>

						<div className={styles.flexrowCenter}>
							<label htmlFor="low">
								<strong>Prio</strong>
							</label>{' '}
							<div className={styles.buttonRow}>
								<div className={styles.radioButton}>
									<input
										type="radio"
										id="low"
										name="priority"
										value="low"
										checked={newTaskData.priority === 'low'}
										onChange={handleChange}
										className="form-control"
									/>
									<label
										htmlFor="low"
										style={{
											backgroundColor:
												newTaskData.priority === 'low'
													? 'var(--bs-success)'
													: '',
											color:
												newTaskData.priority === 'low' ? 'var(--bs-white)' : '',
										}}
									>
										Low
										<Icon
											icon={ICONS.low}
											size="1.5rem"
											color={
												newTaskData.priority === 'low' ? 'var(--bs-white)' : ''
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
										checked={newTaskData.priority === 'medium'}
										onChange={handleChange}
										className="form-control"
									/>
									<label
										htmlFor="medium"
										style={{
											backgroundColor:
												newTaskData.priority === 'medium'
													? 'var(--bs-warning)'
													: '',
											color:
												newTaskData.priority === 'medium'
													? 'var(--bs-white)'
													: '',
										}}
									>
										Medium
										<Icon
											icon={ICONS.medium}
											size="1.5rem"
											color={
												newTaskData.priority === 'medium'
													? 'var(--bs-white)'
													: ''
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
										checked={newTaskData.priority === 'high'}
										onChange={handleChange}
										className="form-control"
									/>
									<label
										htmlFor="high"
										style={{
											backgroundColor:
												newTaskData.priority === 'high'
													? 'var(--bs-danger)'
													: '',
											color:
												newTaskData.priority === 'high'
													? 'var(--bs-white)'
													: '',
										}}
									>
										High
										<Icon
											icon={ICONS.high}
											size="1.5rem"
											color={
												newTaskData.priority === 'high' ? 'var(--bs-white)' : ''
											}
										/>
									</label>
								</div>
							</div>
						</div>

						<div className={styles.flexrowStart}>
							<label htmlFor="subTasks">
								<strong>Subtasks</strong>
							</label>
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
								{newTaskData.subTasks.length > 0 && (
									<ul className={styles.subTaskList}>
										{newTaskData.subTasks.map(
											({ taskName, checked }, index) => {
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
											}
										)}
									</ul>
								)}
							</div>
						</div>
						<div className={styles.flexrowCenter}>
							<label htmlFor="section">
								<strong>Move to Boardsection</strong>
							</label>
							<select
								onChange={handleChange}
								id="section"
								name="section"
								className="form-select"
								required
							>
								<option value={newTaskData.section}>
									{newTaskData.section}
								</option>
								{['To Do', 'In Progress', 'Awaiting Feedback', 'Done'].map(
									(section, index) => {
										if (newTaskData.section !== section)
											return (
												<option
													key={index}
													className={styles.selectOption}
													value={section}
												>
													{section}
												</option>
											);
									}
								)}
							</select>
						</div>
						<div className={styles.buttonRow}>
							<button
								className="btn btn-secondary"
								type="button"
								onClick={() => setIsEditable(false)}
							>
								<Icon icon={ICONS.back} size="1.5rem" color="white" />
								Abandon
							</button>
							<button type="submit" className="btn btn-primary">
								<Icon icon={ICONS.edit} size="1.5rem" color="white" />
								Edit Task
							</button>
						</div>
					</form>
				)}
				<DialogMessage
					handleMessage={handleMessage}
					activeDialog={activeDialog}
				/>
			</section>
		);
	}
}
