import React, { Component } from "react";
import { Link } from "react-router-dom";
import styles from './auth.module.css';

//react-Komponente Reset als superklasse von Component
//alternativ zu Funktions-Komponente
export default class Reset extends Component {

    constructor(props) {
        super(props); //uebergabe der properties von Component
        this.state = { //neue property { email } mit this.state uebergeben
            email: ""
        };
        this.handleSubmit = this.handleSubmit.bind(this); //bindet funktion an klasse
    }

    handleSubmit(e) {
        e.preventDefault();
        const { email } = this.state; //fange email auf
        fetch("http://localhost:5000/forgot-password", {
            method: "POST",
            crossDomain: true,
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify({ email })
        })
            .then((res) => res.json()
                .then((data) => {
                    alert(data.status);
                }));
    }

    //render funktion mit return statt nur return bei funktions-komponente
    render() {
        return (
            <div className={styles.authContainer}>
                <form onSubmit={this.handleSubmit} className={styles.formContainer}>
                    <h3>Forgot Password</h3>
                    <div className="mb-3">
                        <label>Email address</label>
                        <input
                            type="email"
                            className="form-control"
                            placeholder="Enter email"
                            onChange={(e) => this.setState({ email: e.target.value })}
                        />
                    </div>
                    <div className="d-grid">
                        <button type="submit" className="btn btn-primary">
                            Submit
                        </button>
                    </div>
                    <p className="forgot-password text-right">
                        <Link to="../sign-up">Sign Up</Link>
                    </p>
                </form>
                <p>This is an educational project. Please do not enter any confidential information.</p>
            </div>
        );
    }
}