import './App.css';
import { Route, Routes } from 'react-router-dom';
import { useReducer } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import { AuthProvider } from './utils/AuthProvider';
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
import AddContact from './pages/private/AddContact';
import ViewContact from './pages/private/ViewContact';
import Public from './layouts/Public';
import ViewTask from './pages/private/ViewTask';

const messageReducer = (state, action) => {
	switch (action.type) {
		case 'SET_MESSAGE':
			return {
				...state,
				messageText: action.payload.messageText,
				messageType: action.payload.messageType,
			};
		case 'CLEAR_MESSAGE':
			return {
				...state,
				messageText: '',
				messageType: '',
			};
		default:
			return state;
	}
};

export default function App() {
	const [messageState, dispatchMessage] = useReducer(messageReducer, '');

	return (
		<AuthProvider dispatchMessage={dispatchMessage}>
			<Navbar />
			<Routes>
				<Route path="/" element={<AuthRoutes />}>
					<Route path="summary" element={<Summary />} />
					<Route
						path="viewTask/:id"
						element={<ViewTask dispatchMessage={dispatchMessage} />}
					/>
					<Route path="viewBoard" element={<ViewBoard />} />
					<Route
						path="addTask"
						element={<AddTask dispatchMessage={dispatchMessage} />}
					/>
					<Route path="contacts" element={<Contacts />} />
					<Route
						path="contacts/addContact"
						element={<AddContact dispatchMessage={dispatchMessage} />}
					/>
					<Route
						path="contacts/:id"
						element={<ViewContact dispatchMessage={dispatchMessage} />}
					/>
					<Route path="settings" element={<Settings />} />
					<Route path="legalNotice" element={<LegalNotice />} />
				</Route>
				<Route path="public/*" element={<Public />}>
					<Route path="home" element={<Home />} />
					<Route path="legalNotice" element={<LegalNotice />} />
				</Route>
				<Route path="auth/*">
					<Route
						path="sign-in"
						element={<Login dispatchMessage={dispatchMessage} />}
					/>
					<Route
						path="sign-up"
						element={<SignUp dispatchMessage={dispatchMessage} />}
					/>
					<Route
						path="reset"
						element={<Reset dispatchMessage={dispatchMessage} />}
					/>
				</Route>
				<Route path="*" element={<NotFound />} />
			</Routes>
			<StatusMessage message={messageState} />
		</AuthProvider>
	);
}
