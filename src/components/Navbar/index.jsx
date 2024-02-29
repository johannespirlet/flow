import styles from './styles.module.css';
import { Link} from 'react-router-dom';
import CustomLink from '../CustomLink';
import Icon from '../../assets/Icons/Icon';
import { ICONS } from '../../assets/Icons/icons';

export default function Navbar({ isLoggedIn, handleLogout }) {

    return <nav className={styles.nav}>
        <Link to="flow/board/summary" className={styles.siteTitle}>Flow</Link>
        <ul>
            { isLoggedIn ? 
                <>
                    <CustomLink to="flow/board/settings"><Icon icon={ICONS.settings} size="1.6rem" color="white" /></CustomLink>
                    <CustomLink to="flow" onClick={handleLogout}><Icon icon={ICONS.logout} size="1.8rem" color="white" /></CustomLink>
                </> 
                : 
                <>
                    <CustomLink to="flow/auth/sign-in">Login</CustomLink>
                    <CustomLink to="flow/auth/sign-up">Sign Up</CustomLink>
                    <CustomLink to="flow/legalNotice"><Icon icon={ICONS.info} size="1.5rem" color="white" /></CustomLink>
                </>
            }
        </ul>
    </nav>
};