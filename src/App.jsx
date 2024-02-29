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
import PrivateRoutes from './utils/PrivateRoutes';
import Home from './pages/Public/Home';
import Settings from './pages/Private/Settings';
import Summary from './pages/Private/Summary';
import ViewBoard from './pages/Private/ViewBoard';
import Contacts from './pages/Private/Contacts';
import LegalNotice from './pages/Public/LegalNotice';

export default function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('loggedIn'));
  const navigate = useNavigate();


  const handleLogin = () => {
    window.localStorage.setItem("loggedIn", true);
    setIsLoggedIn(true);
    navigate("flow/board/summary");
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
  };

  return <>
    <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
    <Routes>
      <Route path="flow/" element={<PrivateRoutes />}>
        <Route path="board/">
          <Route path="summary" element={<Summary />}/>
          <Route path="viewBoard" element={<ViewBoard />} />
          <Route path="addTask" element={<AddTaskPanel />} />
          <Route path="contacts" element={<Contacts />} />
          <Route path="settings" element={<Settings />} />
          <Route path="legalNotice" element={<LegalNotice />} />
        </Route>
      </Route>
      <Route path="flow/home" element={<Home />} />
      <Route path="flow/legalNotice" element={<LegalNotice />} />
      <Route path="flow/auth/">
        <Route path="sign-in" element={<Login handleLogin={handleLogin} />} />
        <Route path="sign-up" element={<SignUp />} />
        <Route path="reset" element={<Reset />} />
      </Route>
      <Route path="flow/*" element={<NotFound />} />
    </Routes>
  </>;

};
