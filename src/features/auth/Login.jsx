import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from './auth.module.css';

export default function Login({ handleLogin }) {
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  //submit postet anfrage mit email und passwort an backend
  function handleSubmit(e) {
    e.preventDefault();
    //fetch api
    fetch("https://johannespirlet.github.io/flow/auth/sign-in/login-user", {
      method: "POST",
      crossDomain: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    }) //antwortdaten im richtigen datenformat weitergeben
      .then((res) => res.json())
      .then((data) => {
        //falls status (aus backend ok) alert nachricht
        if (data.status == "ok") {
          alert("login erfolgreich");
          //packe token und loggedIn(true) eintrag in storage
          window.localStorage.setItem("token", data.data);
          handleLogin();
          //und leite an userDetails weiter
        } else alert("login nicht erfolgreich: ungueltige userdaten");
      });
  }

  return (
    <div className={styles.authContainer} >
        
        <form onSubmit={handleSubmit} className={styles.formContainer}>
          <h3>Sign In</h3>

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

          <div className="mb-3">
            <div className="custom-control custom-checkbox">
              <input
                type="checkbox"
                className="custom-control-input"
                id="customCheck1"
              />
              <label className="custom-control-label" htmlFor="customCheck1">
                Remember me
              </label>
            </div>
          </div>

          <div className="d-grid">
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
          <p className="forgot-password text-right">
            <Link to="../reset">Forgot password?</Link>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <Link to="../sign-up">Sign Up</Link>
          </p>
          <div className="d-grid">
            <p>or</p>
          </div>
          <div className="d-grid">

          </div>
        </form>
        <button onClick={handleLogin} className="btn btn-secondary">
              Sign In as Guest User
            </button>
        <p>This is an educational project. Please do not enter any confidential information.</p>
      </div>
  );
}