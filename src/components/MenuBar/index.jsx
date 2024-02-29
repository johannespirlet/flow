import styles from './styles.module.css';
import CustomLink from '../CustomLink';
import { ICONS } from '../../assets/Icons/icons.js';
import Icon from '../../assets/Icons/Icon.jsx';

export default function MenuBar() {

    return <nav className={styles.nav}>
        <ul>
            <CustomLink to="board/summary"><Icon icon={ICONS.summary} size="1.5rem" color="white" />  Summary</CustomLink>
            <CustomLink to="board/viewBoard"><Icon icon={ICONS.board} size="1.5rem" color="white" />  Board</CustomLink>
            <CustomLink to="board/addTask"><Icon icon={ICONS.addTask} size="1.5rem" color="white" />  Add Task</CustomLink>
            <CustomLink to="board/contacts"><Icon icon={ICONS.contact} size="1.5rem" color="white" />  Contacts</CustomLink>
            <CustomLink to="board/legalNotice"><Icon icon={ICONS.info} size="1.5rem" color="white" />  Legal Notice</CustomLink>
        </ul>
    </nav>
}