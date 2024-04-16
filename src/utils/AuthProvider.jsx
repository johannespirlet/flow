import { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children, dispatchMessage }) => {
	const initialIsLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
	const [isLoggedIn, setIsLoggedIn] = useState(initialIsLoggedIn);
	const [userData, setUserData] = useState(null);
	const navigate = useNavigate();

	const fetchUserData = async () => {
		try {
			const response = await fetch('https://flow-eta-bay.vercel.app/backend/api/userData', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ token: window.localStorage.getItem('token') }),
			});
			const data = await response.json();
			if (data.data === 'token abgelaufen') {
				timeout();
			} else {
				setUserData(data.data);
			}
		} catch (error) {
			console.error(error);
		}
	};

	const login = () => {
		localStorage.setItem('isLoggedIn', true);
		setIsLoggedIn(true);
		navigate('summary', { replace: true });
		dispatchMessage({
			type: 'SET_MESSAGE',
			payload: {
				messageText: 'Login Successful!',
				messageType: 'positive',
			},
		});
	};

	const logout = () => {
		setIsLoggedIn(false);
		localStorage.clear();
		dispatchMessage({
			type: 'SET_MESSAGE',
			payload: {
				messageText: 'Logout Successful!',
				messageType: 'positive',
			},
		});
	};

	const timeout = () => {
		setIsLoggedIn(false);
		localStorage.clear();
		navigate('auth/sign-in');
		dispatchMessage({
			type: 'SET_MESSAGE',
			payload: {
				messageText: 'Timed Out! Please Log Back In.',
				messageType: '',
			},
		});
	};

	useEffect(() => {
		if (isLoggedIn) fetchUserData();
	}, [isLoggedIn]);

	return (
		<AuthContext.Provider
			value={{ isLoggedIn, userData, login, logout, timeout }}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => useContext(AuthContext);
