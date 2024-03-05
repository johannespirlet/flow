import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from './styles.module.css';
import Icon from "../../../assets/Icons/Icon";
import { ICONS } from "../../../assets/Icons/icons";

export default function AddContact({ handleMessage }) {
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoNumber, setPhoNumber] = useState("");
  const [note, setNote] = useState("");
  const [userType, setUserType] = useState("");
  const navigate = useNavigate();

  const handleNotification = (messagetext, messagetype) => {
    let notification = {
      messageText: messagetext,
      messageType: messagetype
    };
    handleMessage(notification);
  }

  const handleSubmit = (e) => {
    //falls admin angegeben und secretKey nicht matcht, alert
    e.preventDefault();
    //poste zum backend das datenobjekt im json format
    fetch("http://localhost:5000/addUser", {
      method: "POST",
      crossDomain: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        fname,
        lname,
        email,
        password,
        userType,
        phoNumber,
        note
      }),
    })//die antwort wird als json akzeptiert
      .then((res) => res.json())
      .then((data) => {
        //falls im backend alles ok ist, berichte darueber
        if (data.status == "ok") {
          handleNotification("New Contact added!", "positive");
          navigate("../Contacts");
        } else {
          handleNotification("User gibt es bereits. Bitte andere Eingaben verwenden!", "negative");
        }
      });
  }

  return (
    <div>
      <h1 className={styles.title}>Add New Contact</h1>
      <form onSubmit={handleSubmit} className={styles.formContainer}>
        <div className={styles.formRow}>
          Select a Usertype
          <div>
            <input
              type="radio"
              name="UserType"
              value="User"
              onChange={(e) => setUserType(e.target.value)}
              required
            />
            <label>User</label>
          </div>
          <div>
            <input
              type="radio"
              name="UserType"
              value="Admin"
              onChange={(e) => setUserType(e.target.value)}
              required
            />
            <label>Admin</label>
          </div>
        </div>

        <div className={styles.formRow}>
          <div>
            <label>First Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="First Name"
              onChange={(e) => setFname(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Last Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="Last Name"
              onChange={(e) => setLname(e.target.value)}
              required
            />
          </div>
        </div>

        <div className={styles.formRow}>
          <div>
            <label>Email Address</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter an Email Address"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter a Password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>

        <div className={styles.formRow}>
          <div>
            <label>Phone (optional)</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter a Phonenumber"
              onChange={(e) => setPhoNumber(e.target.value)}
            />
          </div>
          <div>
            <label>Note (optional)</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter a Note"
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.formRow}>
          <button type="submit" className="btn btn-primary">
            Add Contact<Icon icon={ICONS.addContact2} size="1.5rem" color="white" />
          </button>
          <Link to={'../Contacts'} className="btn btn-secondary">
            Go Back<Icon icon={ICONS.cancel} size="1.5rem" color="white" />
          </Link>
        </div>
      </form>
    </div>
  )
};