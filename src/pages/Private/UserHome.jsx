import React from "react";

//uebergabe der userData als props aus userDetails.js
export default function UserHome({ userData }) {
  return (
    <div className="auth-wrapper">
      <div className="auth-inner">
        <div>
          Name<h1>{userData.fname}</h1>
          Email <h1>{userData.email}</h1>
        </div>
      </div>
    </div>
  );
}