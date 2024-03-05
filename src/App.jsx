import './App.css';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";

import Navbar from './components/Navbar';
import Login from "./features/auth/Login";
import SignUp from "./features/auth/Signup";
import Reset from "./features/auth/Reset";
import NotFound from './pages/Public/NotFound';
import AddTaskPanel from './pages/Private/AddTask';
import AuthRoutes from './utils/AuthRoutes';
import Home from './pages/Public/Home';
import Settings from './pages/Private/Settings';
import Summary from './pages/Private/Summary';
import ViewBoard from './pages/Private/ViewBoard';
import Contacts from './pages/Private/Contacts';
import LegalNotice from './pages/Public/LegalNotice';
import StatusMessage from './components/StatusMessage';
import UserDetails from './utils/UserDetails';
import ViewContact from './pages/Private/ViewContact';
import AddContact from './pages/Private/AddContact';

export default function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('loggedIn'));
  let [message, setMessage] = useState('');
  const navigate = useNavigate();


  const handleLogin = () => {
    window.localStorage.setItem("loggedIn", true);
    setIsLoggedIn(true);
    navigate("flow/board/summary", {replace: true});
    setMessage(message = {
      messageText: "Login successful!",
      messageType: "positive"
    });
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("flow/home");
    setIsLoggedIn(false);
    setMessage(message = {
      messageText: "Logout successful!",
      messageType: "positive"
    });
  };

  const handleTimeout = () => {
    localStorage.clear();
    navigate("flow/auth/sign-in");
    setIsLoggedIn(false);
    setMessage(message = {
      messageText: "Timed Out! Please log back in.",
      messageType: ""
    });
  };

/*   const handleDialog = () => {
    setDialogMessage(dialogMessage = {
      dialogText: "Endlich hats geklappt!"
    });
  }; */

  return <>
    <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
    <Routes>
      <Route path="flow/" element={<AuthRoutes />}>
        <Route path="board/" element={<UserDetails handleLogout={handleTimeout} />}>
          <Route path="summary" element={<Summary />}/>
          <Route path="viewBoard" element={<ViewBoard />} />
          <Route path="addTask" element={<AddTaskPanel />} />
          <Route path="contacts" element={<Contacts />} />
          <Route path="contacts/addContact" element={<AddContact handleMessage={setMessage} />} />
          <Route path="contacts/:id" element={<ViewContact handleMessage={setMessage} />}/>
          <Route path="settings" element={<Settings />} />
          <Route path="legalNotice" element={<LegalNotice />} />
        </Route>
      </Route>
      <Route path="flow/home" element={<Home />} />
      <Route path="flow/legalNotice" element={<LegalNotice />} />
      <Route path="flow/auth/">
        <Route path="sign-in" element={<Login handleLogin={handleLogin} handleMessage={setMessage} />} />
        <Route path="sign-up" element={<SignUp handleMessage={setMessage} />} />
        <Route path="reset" element={<Reset handleMessage={setMessage} />} />
      </Route>
      <Route path="flow/*" element={<NotFound />} />
    </Routes>
    <StatusMessage message={message} />
  </>;

};
