/* eslint-disable react-hooks/exhaustive-deps */
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import styles from './styles.module.css';
import BoardSection from '../../../components/BoardSection';
import Icon from '../../../assets/icons/Icon';
import { ICONS } from '../../../assets/icons/icons';
import useDebouncedValue from '../../../hooks/useDebouncedValue';
import { ColorRing } from 'react-loader-spinner';

export default function ViewBoard() {
	const [searchInput, setSearchInput] = useState('');
	const debouncedSearchInput = useDebouncedValue(searchInput, 600);
	const [taskData, setTaskData] = useState(null);
	const [filteredTasks, setFilteredTasks] = useState([]);

	useEffect(() => {
		const url = new URL(window.location.href);
		const searchParam = url.searchParams.get('searchInput');
		if (searchParam) {
			setSearchInput(searchParam);
			filterTasks(searchParam);
		} else {
			fetchTasks();
		}
	}, []);

	useEffect(() => {
		const url = new URL(window.location.href);

		if (debouncedSearchInput.length >= 3) {
			url.searchParams.set('searchInput', debouncedSearchInput);
			history.replaceState({}, '', url);
			filterTasks(debouncedSearchInput);
		} else {
			url.searchParams.delete('searchInput');
			history.replaceState({}, '', url);
			setFilteredTasks([]);
		}
	}, [debouncedSearchInput]);

	const fetchTasks = async () => {
		try {
			const response = await fetch('http://localhost:5000/getAllTasks');
			const { data } = await response.json();
			setTaskData(data);
		} catch (error) {
			console.error('Error fetching tasks:', error);
		}
	};

	const filterTasks = (searchTerm) => {
		const searchedTasks = taskData.filter(({ title, description }) => {
			return (
				title.toLowerCase().includes(searchTerm.toLowerCase()) ||
				description.toLowerCase().includes(searchTerm.toLowerCase())
			);
		});
		setFilteredTasks(searchedTasks);
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
						value={searchInput}
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
					<BoardSection
						key={title}
						taskItems={filteredTasks.length > 0 ? filteredTasks : taskData}
						headingTitle={title}
					/>
				))}
			</section>
		</>
	);
}
