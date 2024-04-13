import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import styles from './styles.module.css';
import Icon from '../../../assets/icons/Icon';
import { ICONS } from '../../../assets/icons/icons';
import { ColorRing } from 'react-loader-spinner';
import { useAuth } from '../../../utils/AuthProvider';

export default function Summary() {
	const { userData } = useAuth();
	const [taskData, setTaskData] = useState();
	const [contacts, setContacts] = useState([]);

	useEffect(() => {
		const fetchTasks = async () => {
			try {
				const response = await fetch('http://localhost:5000/getAllTasks');
				const { data } = await response.json();
				setTaskData(data);
			} catch (error) {
				console.error('Error fetching tasks:', error);
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
		fetchTasks();
	}, []);

	const formatDate = (date) => {
		return new Intl.DateTimeFormat('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		}).format(date);
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
		const minDueDate = Math.min(...taskData.map((e) => new Date(e.dueDate)));

		return (
			<>
				<title>Let`s Sum Up - Flow</title>
				<h4>
					Welcome
					<span className={styles.greeting}>
						{userData.fname} {userData.lname}
					</span>
				</h4>
				<header className={`${styles.flexRowCenter} ${styles.header}`}>
					<h1>Summary</h1>
					<div className={styles.divider}></div>
					<h2>Everything in a nutshell</h2>
				</header>
				<div className={styles.gridContainer}>
					<Link
						to="../viewBoard"
						className={`${styles.gridItem} ${styles.flexColumn}`}
					>
						<h1>1</h1>
						<h3>Active Board</h3>
					</Link>
					<Link
						to="../viewBoard"
						className={`${styles.gridItem} ${styles.flexColumn}`}
					>
						<h1>{taskData.length}</h1>
						<h3>Tasks on Board</h3>
					</Link>
					<Link
						to="../contacts"
						className={`${styles.gridItem} ${styles.flexColumn}`}
					>
						<h1>{contacts.length}</h1>

						<h3>Contacts</h3>
					</Link>
					<Link
						to="../viewBoard?searchInput=high"
						className={`${styles.gridItem} ${styles.flexRowCenter} ${styles.longGridItem}`}
					>
						<div className={styles.flexRowCenter}>
							<div
								className={`${styles.gridIconContainer} ${styles.urgencyIcon}`}
							>
								<Icon icon={ICONS.high} size="3rem" color="var(--bs-white)" />
							</div>
							<div>
								<h2>
									{taskData.filter((task) => task.priority === 'high').length}
								</h2>
								<p>Important Tasks</p>
							</div>
						</div>
						<div className={styles.divider} />
						<div>
							<h2>{formatDate(minDueDate)}</h2>
							<p>Upcoming Deadline</p>
						</div>
					</Link>
					<Link
						to="../viewBoard?searchInput=in+progress"
						className={`${styles.gridItem} ${styles.flexColumn}`}
					>
						<h1>
							{taskData.filter((task) => task.section === 'In Progress').length}
						</h1>

						<h3>Tasks in Progress</h3>
					</Link>
					<Link
						to="../viewBoard?searchInput=awaiting+feedback"
						className={`${styles.gridItem} ${styles.flexColumn}`}
					>
						<h1>
							{
								taskData.filter((task) => task.section === 'Awaiting Feedback')
									.length
							}
						</h1>
						<h3>Awaiting Feedback</h3>
					</Link>

					<Link
						to="../viewBoard?searchInput=to+do"
						className={`${styles.gridItem} ${styles.flexRowCenter}`}
					>
						<div
							className={`${styles.gridIconContainer} ${styles.standardIcon}`}
						>
							<Icon icon={ICONS.edit} size="2rem" color="var(--bs-white)" />
						</div>
						<div className={styles.flexColumn}>
							<h1>
								{taskData.filter((task) => task.section === 'To Do').length}
							</h1>
							<h3>To Do</h3>
						</div>
					</Link>
					<Link
						to="../viewBoard?searchInput=done"
						className={`${styles.gridItem} ${styles.flexRowCenter}`}
					>
						<div
							className={`${styles.gridIconContainer} ${styles.standardIcon}`}
						>
							<Icon
								icon={ICONS.checked2}
								size="3.8rem"
								color="var(--bs-white)"
							/>
						</div>
						<div className={styles.flexColumn}>
							<h1>
								{taskData.filter((task) => task.section === 'Done').length}
							</h1>
							<h3>Done</h3>
						</div>
					</Link>
				</div>
			</>
		);
	}
}
