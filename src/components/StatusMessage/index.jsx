import styles from './styles.module.css';
import { useState, useEffect } from 'react';

export default function StatusMessage({message}) {

const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div className={`${styles.statusMessage} ${isVisible ? styles.visible : ''} ${styles[message.messageType]}`}>
      {message.messageText}
    </div>
  );
};