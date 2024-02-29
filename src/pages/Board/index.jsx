import { Outlet, useNavigate } from "react-router-dom";
import MenuBar from "../../components/MenuBar";
import styles from "./styles.module.css";
import { useEffect } from "react";

export default function Board() {

    const navigate = useNavigate();

    useEffect(() => {
        fetch("./userData", {
            method: "POST",
            crossDomain: true,
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({
                token: window.localStorage.getItem("token")
            }),
        }).then((res) => res.json())
            .then((data) => {
                if (data.data == "token abgelaufen") {
                    alert("Token abgelaufen - melde dich erneut an");
                    navigate("flow/auth/sign-in");
                }
            });
    }, []);

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