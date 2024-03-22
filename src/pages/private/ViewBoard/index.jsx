import { Link } from 'react-router-dom';
import { useState } from 'react';

import styles from './styles.module.css';
import tasks from '../../../data/tasks';
import BoardSection from '../../../components/BoardSection';
import Icon from '../../../assets/icons/Icon';
import { ICONS } from '../../../assets/icons/icons';

export default function ViewBoard() {
	const [searchField, setSearchField] = useState('');

	const filteredTasks = tasks.filter((task) => {
		return (
			task.title.toLowerCase().includes(searchField.toLowerCase()) ||
			task.description.toLowerCase().includes(searchField.toLowerCase())
		);
	});

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
							setSearchField(e.target.value);
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
