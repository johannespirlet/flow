import React, { useState } from "react";
/* import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; */

export default function AdminHome({ userData }) {

  //data state um daten zu fetchen und nutzbar zu machen
  const [data, setData] = useState([]);

  //fetch alle userdaten vom backend
  const getAllUser = () => {
    fetch("http://localhost:5000/getAllUser", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        //und setze sie in data-state fest
        setData(data.data);
      });
  };

  //deleteUser bekommt id und name uebergeben
  const deleteUser = (id, name) => {
    //adhoc loesung: falls confirm bestaetigt dann fetch
    //poste/uebergebe id an userid-schlussel in den body
    if (window.confirm(`User namens ${name} wirklich loeschen?`)) {
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
      .then((res) => res.json());
    }
  };
  //aktualisiere beim rendern
  getAllUser();
  //mappe alle gefetchten Daten als Zeilen in unserer Usertabelle
  //FontAwesomeIcon mit faTrash-icon wird auf jede Deletezeile gerendert
  return (
    <div className="auth-wrapper">
      <div className="auth-inner" style={{ width: "auto" }}>
        <div>
        <h3>Welcome {userData.fname} {userData.lname}</h3>
        <table style={{ width: 500 }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>User Type</th>
              <th className="delete-col"></th>
            </tr>
          </thead>
          <tbody>
            {data.map((entries) => {
              return (
                <tr key={entries._id}>
                  <td>{entries.fname} {entries.lname}</td>
                  <td>{entries.email}</td>
                  <td className="userType-col">{entries.userType}</td>
{/*                   <td className="delete-col">
                    <FontAwesomeIcon icon={faTrash} onClick={() => deleteUser(entries._id, entries.fname)} />
                  </td> */}
                </tr>
              );
            })}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
}