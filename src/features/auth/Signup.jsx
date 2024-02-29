import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from './auth.module.css';

export default function SignUp() {
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("");
  const [secretKey, setSecretKey] = useState("");

  const handleSubmit = (e) => {
    //falls admin angegeben und secretKey nicht matcht, alert
    if (userType == "Admin" && secretKey != "2AdMiN2") {
      e.preventDefault();
      alert("Ungueltiger Adminkey");
    } else {
      //in allen anderen faellen, kein default submit/refresh sondern
      e.preventDefault();
      //poste zum backend das datenobjekt im json format
      fetch("./register", {
        method: "POST",
        crossDomain: true,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          fname,
          email,
          lname,
          password,
          userType,
        }),
      })//die antwort wird als json akzeptiert
        .then((res) => res.json())
        .then((data) => {
          //falls im backend alles ok ist, berichte darueber
          if (data.status == "ok") {
            alert("Registrierung erfolgreich!");
          } else {
            alert("User gibt es bereits. Bitte andere Eingaben verwenden!");
          }
        });
    }
  };

  return (
    <div className={styles.authContainer}>
      <form onSubmit={handleSubmit} className={styles.formContainer}>
        <h3>Sign Up</h3>
        <div>
          Register As
          <input
            type="radio"
            name="UserType"
            value="User"
            onChange={(e) => setUserType(e.target.value)}
            required
          />
          User
          <input
            type="radio"
            name="UserType"
            value="Admin"
            onChange={(e) => setUserType(e.target.value)}
            required
          />
          Admin
        </div>
        {userType == "Admin" ? (
          <div className="mb-3">
            <label>Secret Key</label>
            <input
              type="text"
              className="form-control"
              placeholder="Secret Key"
              onChange={(e) => setSecretKey(e.target.value)}
            />
          </div>
        ) : null}

        <div className="mb-3">
          <label>First name</label>
          <input
            type="text"
            className="form-control"
            placeholder="First name"
            onChange={(e) => setFname(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label>Last name</label>
          <input
            type="text"
            className="form-control"
            placeholder="Last name"
            onChange={(e) => setLname(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label>Email address</label>
          <input
            type="email"
            className="form-control"
            placeholder="Enter email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            placeholder="Enter password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="d-grid">
          <button type="submit" className="btn btn-primary">
            Sign Up
          </button>
        </div>
        <p className="forgot-password text-right">
          Already registered <Link to="../sign-in">sign in?</Link>
        </p>
      </form>
      <p>This is an educational project. Please do not enter any confidential information.</p>
    </div>
  );
}