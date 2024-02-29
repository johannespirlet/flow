import { Navigate } from 'react-router-dom';
import Board from '../pages/Board';

const PrivateRoutes = () => {
    let auth = window.localStorage.getItem("loggedIn");
    return(
        auth ? <Board /> : <Navigate to="home" replace={true} /> 
    )
}

export default PrivateRoutes