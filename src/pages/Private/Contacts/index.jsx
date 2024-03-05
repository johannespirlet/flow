import { Link, useOutletContext } from "react-router-dom";
import { useEffect, useState } from "react";

import styles from './styles.module.css';
import Icon from "../../../assets/Icons/Icon";
import { ICONS } from "../../../assets/Icons/icons";

export default function Contacts() {
    //data state um daten zu fetchen und nutzbar zu machen
    const [data, setData] = useState([]);
    const userData = useOutletContext();

    function sortData(data) {
        let sortedData;
        return sortedData = data.sort(function (a, b) {
            if (a.fname.toLowerCase() > b.fname.toLowerCase()) return 1;
            if (a.fname.toLowerCase() < b.fname.toLowerCase()) return -1;
            return 0;
        });
    }

    useEffect(() => {
        //fetch alle userdaten vom backend
        const getAllUser = () => {
            fetch("http://localhost:5000/getAllUser", {
                method: "GET",
            })
                .then((res) => res.json())
                .then((data) => {
                    setData(sortData(data.data));
                });
        };
        getAllUser();
        return () => { };
    }, []);



    //mappe alle gefetchten Daten als Zeilen in unserer Usertabelle
    //FontAwesomeIcon mit faTrash-icon wird auf jede Deletezeile gerendert
    return (<>
        <header className={styles.headerContainer}>
            <h1>Contacts</h1>
            {userData.userType == 'Admin' &&
            <Link to="AddContact" className="btn btn-primary">
                Add Contact<Icon icon={ICONS.addContact} size="1.5rem" color="white" />
            </Link>}
        </header>
        <div className={styles.contactContainer}>
            <ul>
                {data.map((entries, index, array) => {
                    {
                        if (entries._id != userData._id) return (
                            <li key={entries._id} className={styles.listItem}>
                                {entries.fname.toLowerCase().charAt(0) != array[index - 1 == -1 ? array.length - 1 : index - 1 ].fname.toLowerCase().charAt(0) && <><p>{entries.fname.toUpperCase().charAt(0)}</p><hr /></>}
                                <Link to={entries._id}>
                                    <div className={styles.avatar} style={{ backgroundColor: entries.color }}>{entries.fname.toUpperCase().charAt(0)}{entries.lname.toUpperCase().charAt(0)}</div>
                                    <div className={styles.info}>
                                        <p>{entries.fname} {entries.lname}</p>
                                        <p>{entries.email}</p>
                                    </div>
                                    <p className={styles.role}>{entries.userType}</p>
                                    {entries.phone && <p className={styles.phone}>{entries.phone}</p>}
                                    {entries.note && <p className={styles.note}>{`"${entries.note}"`}</p>}
                                </Link>
                            </li>
                        );
                    }
                })}
            </ul>
        </div>
    </>);
}