import Task from '../Task';
import styles from './styles.module.css';
import { Link } from 'react-router-dom';

export default function BoardSection({ headingTitle, taskItems }) {
	return (
		<article className={styles.boardSection}>
			<h3>{headingTitle}</h3>

			<ul className={styles.taskList}>
				{taskItems.map(
					(task) =>
						task.section === headingTitle && (
							<Link
								key={task.id}
								to={`../viewTask/${task.id}`}
								className={styles.taskLink}
							>
								<li className={styles.taskContainer}>
									<Task task={task} />
								</li>
							</Link>
						)
				)}
			</ul>
		</article>
	);
}
