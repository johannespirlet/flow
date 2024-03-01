import React from "react";

//uebergabe der userData als props aus userDetails.js
export default function UserHome({ userData }) {
  return (
        <h1>
          Welcome {userData.fname} {userData.lname}
        </h1>
  );
}