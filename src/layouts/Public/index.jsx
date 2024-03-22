import styles from './styles.module.css';
import { Outlet } from 'react-router-dom';

export default function Public() {
	return (
		<div className={styles.publicWrapper}>
			<Outlet />
		</div>
	);
}
