import styles from './styles.module.css';
import { Outlet } from 'react-router-dom';

export default function Auth() {
	return (
		<div className={styles.authContainer}>
			<form className={styles.formContainer}>
				<Outlet />
			</form>
		</div>
	);
}
