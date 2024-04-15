import styles from "./styles.module.css";
import CustomLink from "../CustomLink";
import { ICONS } from "../../assets/icons/icons.js";
import Icon from "../../assets/icons/Icon.jsx";

export default function MenuBar() {
  return (
    <nav className={styles.nav}>
      <ul>
        <CustomLink to="summary">
          <Icon icon={ICONS.summary} size="1.5rem" color="var(--bs-body-color)" /> Summary
        </CustomLink>
        <CustomLink to="viewBoard">
          <Icon icon={ICONS.board} size="1.5rem" color="var(--bs-body-color)" /> Board
        </CustomLink>
        <CustomLink to="addTask">
          <Icon icon={ICONS.addTask} size="1.5rem" color="var(--bs-body-color)" /> Add Task
        </CustomLink>
        <CustomLink to="contacts">
          <Icon icon={ICONS.contact} size="1.5rem" color="var(--bs-body-color)" /> Contacts
        </CustomLink>
        <CustomLink to="legalNotice">
          <Icon icon={ICONS.info} size="1.5rem" color="var(--bs-body-color)" /> Legal Notice
        </CustomLink>
      </ul>
    </nav>
  );
}
