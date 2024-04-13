import { Navigate } from 'react-router-dom';
import Board from '../layouts/Board';
import { useAuth } from './AuthProvider';

const AuthRoutes = () => {
	const { isLoggedIn } = useAuth();

	return isLoggedIn ? <Board /> : <Navigate to="../public/home" replace={true} />;
};

export default AuthRoutes;
