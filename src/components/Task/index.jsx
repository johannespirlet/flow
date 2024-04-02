import styles from './styles.module.css';
import departments from '../../data/departments';
import Icon from '../../assets/icons/Icon';
import { ICONS } from '../../assets/icons/icons';

export default function Task({ task }) {
	const { department, title, description, assignedTo, priority } = task;
	const departmentColor = departments.find((d) => d.name === department).color;
	const priorityIcon = getPriorityIcon(priority);
	const priorityColor = getPriorityColor(priority);

	return (
		<div className={styles.taskContainer} draggable>
			<span
				className={styles.department}
				style={{ backgroundColor: departmentColor }}
			>
				{department}
			</span>
			<h3>{title}</h3>
			{description && <p>{description}</p>}
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
							style={{ backgroundColor: "darkgrey", color: "white" }}
						>
							{`+${assignedTo.length - 2}`}
						</div>
					)}
				</div>
				<Icon icon={priorityIcon} size="2.4rem" color={priorityColor} />
			</div>
		</div>
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
			return 'green';
		case 'medium':
			return 'yellow';
		default:
			return 'red';
	}
};
