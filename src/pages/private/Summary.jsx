import { useOutletContext } from "react-router-dom";

export default function Summary() {

    const userData = useOutletContext();

    return (
          <h1>
            Welcome {userData.fname} {userData.lname}
          </h1>
    );
  }