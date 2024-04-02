import { useOutletContext } from 'react-router-dom';
import styles from './styles.module.css';

export default function Summary() {
	const userData = useOutletContext();

	return (
		<>
			<title>Let`s Sum Up - Flow</title>
			<h1>
				Welcome <span className={styles.greeting}>{userData.fname} {userData.lname}</span>
			</h1>
		</>
	);
}
