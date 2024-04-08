import styles from './styles.module.css';
import { Link } from 'react-router-dom';
import CustomLink from '../CustomLink';
import { ICONS } from '../../assets/icons/icons.js';
import Icon from '../../assets/icons/Icon.jsx';

export default function Navbar({ isLoggedIn, handleLogout }) {
	return (
		<nav className={styles.nav}>
			<Link to="board/summary" className={styles.siteTitle}>
				Flow
			</Link>
			<ul>
				{isLoggedIn ? (
					<>
						<CustomLink to="board/settings">
							<Icon icon={ICONS.settings} size="1.6rem" color="white" />
						</CustomLink>
						<CustomLink to="/" onClick={handleLogout}>
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
