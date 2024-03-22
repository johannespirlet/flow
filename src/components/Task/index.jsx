import styles from './styles.module.css';
import departments from '../../data/departments';
import Icon from '../../assets/icons/Icon';
import { ICONS } from '../../assets/icons/icons';

export default function Task({ task }) {
	return (
		<div className={styles.taskContainer}>
			<span
				className={styles.department}
				style={{
					backgroundColor: `${
						departments.find((obj) => obj.name == task.department).color
					}`,
				}}
			>
				{task.department}
			</span>
			<h3>{task.title}</h3>
			<p>{task.description}</p>
			<div className={styles.bottomBar}>
				<div>
					{task.assignedTo.map((person, index) => (
						<div
							key={person.id}
							className={styles.avatar}
							style={{ marginLeft: `${index * -8}px` }}
						></div>
					))}
				</div>
				<Icon
					icon={
						task.priority === 'low'
							? ICONS.low
							: task.priority === 'medium'
							? ICONS.medium
							: ICONS.high
					}
					size="2.4rem"
					color={
						task.priority === 'low'
							? 'green'
							: task.priority === 'medium'
							? 'yellow'
							: 'red'
					}
				/>
			</div>
		</div>
	);
}
