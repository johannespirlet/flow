import { Outlet } from "react-router-dom";
import styles from "./styles.module.css";

import MenuBar from "../../components/MenuBar";

export default function Board() {    

    return (
    <main className={styles.boardContainer} >
        <aside className={styles.menuContainer}>
            <MenuBar />
        </aside>
        <section className={styles.contentContainer}>
            <Outlet />
        </section>
    </main>
    )
}