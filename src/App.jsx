import './App.css';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import Navbar from './components/Navbar';
import Login from './features/auth/Login';
import SignUp from './features/auth/Signup';
import Reset from './features/auth/Reset';
import NotFound from './pages/public/NotFound';
import AddTask from './pages/private/AddTask';
import AuthRoutes from './utils/AuthRoutes';
import Home from './pages/public/Home';
import Settings from './pages/private/Settings';
import Summary from './pages/private/Summary';
import ViewBoard from './pages/private/ViewBoard';
import Contacts from './pages/private/Contacts';
import LegalNotice from './pages/public/LegalNotice';
import StatusMessage from './components/StatusMessage';
import UserDetails from './utils/UserDetails';
import AddContact from './pages/private/AddContact';
import ViewContact from './pages/private/ViewContact';
import Public from './layouts/Public';
import ViewTask from './pages/private/ViewTask';

export default function App() {
	const [isLoggedIn, setIsLoggedIn] = useState(
		localStorage.getItem('loggedIn')
	);
	let [message, setMessage] = useState('');
	const navigate = useNavigate();

	const handleLogin = () => {
		window.localStorage.setItem('loggedIn', true);
		setIsLoggedIn(true);
		navigate('flow/board/summary', { replace: true });
		setMessage(
			(message = {
				messageText: 'Login Successful!',
				messageType: 'positive',
			})
		);
	};

	const handleLogout = () => {
		localStorage.clear();
		navigate('flow/home');
		setIsLoggedIn(false);
		setMessage(
			(message = {
				messageText: 'Logout Successful!',
				messageType: 'positive',
			})
		);
	};

	const handleTimeout = () => {
		localStorage.clear();
		navigate('flow/auth/sign-in');
		setIsLoggedIn(false);
		setMessage(
			(message = {
				messageText: 'Timed Out! Please Log Back In.',
				messageType: '',
			})
		);
	};

	return (
		<>
			<Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
			<Routes>
				<Route path="flow/" element={<AuthRoutes />}>
					<Route
						path="board/"
						element={<UserDetails handleLogout={handleTimeout} />}
					>
						<Route path="summary" element={<Summary />} />
						<Route
							path="viewTask/:id"
							element={<ViewTask handleMessage={setMessage} />}
						/>
						<Route path="viewBoard" element={<ViewBoard />} />
						<Route
							path="addTask"
							element={<AddTask handleMessage={setMessage} />}
						/>
						<Route path="contacts" element={<Contacts />} />
						<Route
							path="contacts/addContact"
							element={<AddContact handleMessage={setMessage} />}
						/>
						<Route
							path="contacts/:id"
							element={<ViewContact handleMessage={setMessage} />}
						/>
						<Route path="settings" element={<Settings />} />
						<Route path="legalNotice" element={<LegalNotice />} />
					</Route>
				</Route>
				<Route path="flow/public/" element={<Public />}>
					<Route path="home" element={<Home />} />
					<Route path="legalNotice" element={<LegalNotice />} />
				</Route>
				<Route path="flow/auth/">
					<Route
						path="sign-in"
						element={
							<Login handleLogin={handleLogin} handleMessage={setMessage} />
						}
					/>
					<Route
						path="sign-up"
						element={<SignUp handleMessage={setMessage} />}
					/>
					<Route path="reset" element={<Reset handleMessage={setMessage} />} />
				</Route>
				<Route path="flow/*" element={<NotFound />} />
			</Routes>
			<StatusMessage message={message} />
		</>
	);
}
