import { Outlet } from "react-router-dom";
import MenuBar from "../../components/MenuBar";
import styles from "./styles.module.css";

export default function Board() {

    return (
    <main className={styles.boardContainer}>
        <aside className={styles.menuContainer}>
            <MenuBar />
        </aside>
        <section className={styles.contentContainer}>
            <Outlet />
        </section>
    </main>
    )
}