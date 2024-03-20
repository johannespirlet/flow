import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

//private routing mit UserDetails Komponente
export default function UserDetails({ handleLogout }) {
  const [userData, setUserData] = useState("");

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
        token: window.localStorage.getItem("token"),
      }),
    })
      .then((res) => res.json()) //gib body als promise mit json content zurueck
      .then((data) => {
        if (data.data == "token abgelaufen") {
          handleLogout();
        } else {
          setUserData(data.data);
        }
      });
  });
  //gib bei admin true AdminHome-Komponente zurueck ansonsten UserHome
  // (jeweils mit props fuer begruessung)
  return <Outlet context={userData} />;
}
