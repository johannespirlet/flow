import { Navigate } from 'react-router-dom';
import Board from '../pages/private/Board';

const AuthRoutes = () => {
	let auth = window.localStorage.getItem('loggedIn');
	return auth ? <Board /> : <Navigate to="home" replace={true} />;
};

export default AuthRoutes;
