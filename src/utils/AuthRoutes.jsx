import { Navigate } from 'react-router-dom';
import Board from '../layouts/Board';

const AuthRoutes = () => {
	let auth = window.localStorage.getItem('loggedIn');
	return auth ? <Board /> : <Navigate to="public/home" replace={true} />;
};

export default AuthRoutes;
