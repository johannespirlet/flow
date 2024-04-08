import styles from './styles.module.css';
import departments from '../../data/departments';
import Icon from '../../assets/icons/Icon';
import { ICONS } from '../../assets/icons/icons';
import { Link } from 'react-router-dom';

export default function Task({ task }) {
	const { department, title, description, assignedTo, priority, subTasks, _id } =
		task;
	const departmentColor = departments.find((d) => d.name === department).color;
	const priorityIcon = getPriorityIcon(priority);
	const priorityColor = getPriorityColor(priority);

	return (
		<Link to={`../viewTask/${_id}`} className={styles.taskLink}>
			<li className={styles.taskContainer}>
				<span
					className={styles.department}
					style={{ backgroundColor: departmentColor }}
				>
					{department}
				</span>
				<h3>{title}</h3>
				{description && <p>{description}</p>}
				{subTasks.length > 0 && <div className={styles.progressBar}>
					<progress
						id="subTasks"
						value={subTasks.filter((item) => item.checked === true).length}
						max={subTasks.length}
					/>
					<label htmlFor="subTasks">{`${
						subTasks.filter((item) => item.checked === true).length
					}/${subTasks.length}`}</label>
				</div>}
				<div className={styles.bottomBar}>
					<div className={styles.assignees}>
						<div
							className={styles.avatar}
							style={{ backgroundColor: assignedTo[0].color }}
						>
							{assignedTo[0].initials}
						</div>
						{assignedTo[1] && (
							<div
								className={styles.avatar}
								style={{ backgroundColor: assignedTo[1].color }}
							>
								{assignedTo[1].initials}
							</div>
						)}
						{assignedTo.length > 2 && (
							<div
								className={styles.avatar}
								style={{ backgroundColor: 'darkgrey', color: 'white' }}
							>
								{`+${assignedTo.length - 2}`}
							</div>
						)}
					</div>
					<Icon icon={priorityIcon} size="2.4rem" color={priorityColor} />
				</div>
			</li>
		</Link>
	);
}

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
