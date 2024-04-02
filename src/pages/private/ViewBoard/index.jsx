import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'redaxios';
import styles from './styles.module.css';
import BoardSection from '../../../components/BoardSection';
import Icon from '../../../assets/icons/Icon';
import { ICONS } from '../../../assets/icons/icons';
import useDebouncedValue from '../../../hooks/useDebouncedValue';
import { ColorRing } from 'react-loader-spinner';

export default function ViewBoard() {
	const [searchInput, setSearchInput] = useState('');
	const debouncedSearchInput = useDebouncedValue(searchInput, 600);

	const [taskData, setTaskData] = useState('');
/* 	const filteredTasks = taskData?.filter((task) => {
		return (
			task.title.toLowerCase().includes(debouncedSearchInput.toLowerCase()) ||
			task.description
				.toLowerCase()
				.includes(debouncedSearchInput.toLowerCase())
		);
	}); */

	useEffect(() => {
		const getAllTasks = () => {
			fetch('http://localhost:5000/getAllTasks', {
				method: 'GET',
			})
				.then((res) => res.json())
				.then((data) => {
					setTaskData(data.data);
				});
		};
		getAllTasks();

		return () => {};
	}, []);

	useEffect(() => {
		let ignore = false;
		if (debouncedSearchInput.length < 2) {
			setSearchInput([]);
			return;
		}

		async function fetchTasks() {
			try {
				const { taskData } = await axios('http://localhost:5000', {
					params: {
						searchInput: debouncedSearchInput,
					},
				});

				if (ignore) {
					return;
				}

				setTaskData(taskData);
			} catch (error) {
				setTaskData([]);
				console.log(error);
			}
		}

		fetchTasks();

		return () => (ignore = true);
	}, [debouncedSearchInput]);

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
	}

	return (
		<>
			<title>Boardview</title>
			<header className={styles.headerContainer}>
				<h1>Board</h1>
				<nav>
					<label htmlFor="searchField"></label>
					<input
						className={`${styles.searchInput} form-control`}
						type="search"
						placeholder="Search Tasks"
						id="searchField"
						name="searchField"
						onChange={(e) => {
							setSearchInput(e.target.value);
						}}
						autoComplete="off"
					/>
					<Link to="../addTask" className="btn btn-primary">
						<Icon icon={ICONS.addTask} size="1.4rem" color="white" />
						Add Task
					</Link>
				</nav>
			</header>
			<section className={styles.boardContainer}>
			{['To Do', 'In Progress', 'Awaiting Feedback', 'Done'].map((title) => (
					<BoardSection key={title} taskItems={taskData} headingTitle={title} />
				))}
			</section>
		</>
	);
}
