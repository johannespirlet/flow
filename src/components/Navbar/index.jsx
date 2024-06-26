import styles from './styles.module.css';
import { Link } from 'react-router-dom';
import { ICONS } from '../../assets/icons/icons.js';
import Icon from '../../assets/icons/Icon.jsx';
import { useAuth } from '../../utils/AuthProvider.jsx';
import CustomLink from '../CustomLink/index.jsx';

export default function Navbar() {
	const { isLoggedIn, logout } = useAuth();

	return (
		<nav className={styles.nav}>
			<Link to="summary" className={styles.siteTitle} />
			<ul className={styles.navLinks}>
				{isLoggedIn ? (
					<>
						<CustomLink to="settings">
							<Icon icon={ICONS.settings} size="1.6rem" color="white" />
						</CustomLink>
						<CustomLink to="/public/home" onClick={logout}>
							<Icon icon={ICONS.logout} size="1.8rem" color="white" />
						</CustomLink>
					</>
				) : (
					<>
						<CustomLink to="auth/sign-in">Login</CustomLink>
						<CustomLink to="auth/sign-up">Sign Up</CustomLink>
						<CustomLink to="public/legalNotice">
							<Icon icon={ICONS.info} size="1.5rem" color="white" />
						</CustomLink>
					</>
				)}
			</ul>
		</nav>
	);
}
