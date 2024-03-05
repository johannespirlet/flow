import { useOutletContext, useParams } from "react-router-dom";
import { ICONS } from "../../../assets/Icons/icons";
import Icon from "../../../assets/Icons/Icon";
import styles from "./styles.module.css";
import { useState } from "react";
import DialogMessage from "../../../components/DialogMessage";


export default function ViewContact({ handleMessage }) {

    const { id } = useParams();
    const userData = useOutletContext();
    const [activeDialog, setActiveDialog] = useState('');

    const handleConfirmationDialog = () => {
        let notification = {
            dialogText: "Are you sure to delete this contact?",
            navigateTo: "../contacts",
            target: id
        };
        setActiveDialog(notification);
    }

    return <>
        <h1 className={styles.title}>Contact {id}</h1>
        {userData.userType == 'Admin' &&
            <div onClick={handleConfirmationDialog}>
                <Icon icon={ICONS.deleteUser} size="1.5rem" color="black" />
            </div>}
        <DialogMessage handleMessage={handleMessage} activeDialog={activeDialog}/>
        </>
}