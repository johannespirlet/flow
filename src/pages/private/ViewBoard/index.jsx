import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'redaxios';
import styles from './styles.module.css';
import tasks from '../../../data/tasks';
import BoardSection from '../../../components/BoardSection';
import Icon from '../../../assets/icons/Icon';
import { ICONS } from '../../../assets/icons/icons';
import useDebouncedValue from '../../../hooks/useDebouncedValue';

export default function ViewBoard() {

	const [searchInput, setSearchInput] = useState('');
/* 	const debouncedSearchInput = useDebouncedValue(searchInput, 600);

	const [taskData, setTaskData] = useState(''); */
	const filteredTasks = tasks.filter((task) => {
		return (
			task.title.toLowerCase().includes(searchInput.toLowerCase()) ||
			task.description.toLowerCase().includes(searchInput.toLowerCase())
		);
	});


	/* useEffect(() => {
		let ignore = false;
		if(debouncedSearchInput.length < 2) {
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

				if(ignore) {
					return;
				}

				setTaskData(taskData);
			} catch(error) {
				setTaskData([]);
				console.log(error);
			}
		}

		fetchTasks();

		return () => (ignore = true);
	}, [debouncedSearchInput]) */

	return (
		<>
			<header className={styles.headerContainer}>
				<h1>Board</h1>
				<nav>
					<label htmlFor='searchField'></label>
					<input
						className={`${styles.searchInput} form-control`}
						type="search"
						placeholder="Search Tasks"
						id='searchField'
						name='searchField'
						onChange={(e) => {
							setSearchInput(e.target.value);
						}}
						autoComplete='off'
					/>
					<Link to="AddTask" className="btn btn-primary">
						<Icon icon={ICONS.addTask} size="1.4rem" color="white" />
						Add Task
					</Link>
				</nav>
			</header>
			<section className={styles.boardContainer}>
				<BoardSection
					taskItems={filteredTasks}
					headingTitle={'To Do'}
				/>
				<BoardSection
					taskItems={filteredTasks}
					headingTitle={'In Progress'}
				/>
				<BoardSection
					taskItems={filteredTasks}
					headingTitle={'Awaiting Feedback'}
				/>
				<BoardSection
					taskItems={filteredTasks}
					headingTitle={'Done'}
				/>
			</section>
		</>
	);
}
