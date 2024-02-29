import React, { useEffect, useState } from "react";

import AdminHome from "./AdminHome";
import UserHome from "./UserHome";

//private routing mit UserDetails Komponente
export default function UserDetails() {

  const [userData, setUserData] = useState("");
  const [admin, setAdmin] = useState(false);

  //effekt-hook fuers Daten fetchen. sagt React dass in der Komponente noch
  //nach dem rendern etwas passieren soll. hier: admin status abfragen, und
  //userDaten uebergeben und token auf gueltigkeit ueberpruefen
  useEffect(() => {
    fetch("http://localhost:5000/userData", {
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
    })
      .then((res) => res.json()) //gib body als promise mit json content zurueck
      .then((data) => {
        //falls userType aus Daten admin ist, setze Admin true
        if (data.data.userType == "Admin") {
          setAdmin(true);
        }
        //belege Zustand mit Daten
        setUserData(data.data);
      });
  }, []);
  //gib bei admin true AdminHome-Komponente zurueck ansonsten UserHome
  // (jeweils mit props fuer begruessung)
  return admin ? <AdminHome userData={userData}/> : <UserHome userData={userData} />;
}