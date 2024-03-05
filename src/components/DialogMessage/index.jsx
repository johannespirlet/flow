import { useMatch, useNavigate, useResolvedPath } from 'react-router-dom';
import styles from './styles.module.css';
import { useState, useEffect } from 'react';

export default function DialogMessage({ handleMessage, activeDialog }) {

  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if(activeDialog) setIsVisible(true);
  }, [activeDialog]);

  const cancelConfirmation = () => {
    setIsVisible(false);
  }

  const handleConfirmation = () => {
    deleteUser(activeDialog.target);
  }

  const handleNotification = (messagetext, messagetype) => {
    let notification = {
      messageText: messagetext,
      messageType: messagetype
    };
    handleMessage(notification);
  }

  const deleteUser = (id) => {
    fetch("http://localhost:5000/deleteUser", {
      method: "POST",
      crossDomain: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        userid: id
      }),
    })
      .then((res) => res.json())
      .then(() => {
        handleNotification("User Deletion Successful", "positive");
        navigate(activeDialog.navigateTo, {replace: true});
      });
  };

  return (
    <div className={`${styles.dialogWindow} ${isVisible ? styles.visible : ''}`}>
      {activeDialog.dialogText}
      <button className='btn btn-primary' onClick={handleConfirmation}>Delete</button>
      <button className='btn btn-secondary' onClick={cancelConfirmation}>Cancel</button>
    </div>
  );
};

