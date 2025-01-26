import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '@components/login/AuthContext.jsx';

const ProtectedRoute = ({ component: Component, adminRequired = false }) => {
    const { authState } = useContext(AuthContext);
    const { loggedIn, isAdmin } = authState;

    //console.log('ProtectedRoute:', { loggedIn, isAdmin, adminRequired }); //debugging

    // check if the user is not logged in
    if (!loggedIn) {
        //console.log('Redirecting to /login'); //debugging
        return <Navigate to="/login" replace />;
    }

    // Check if admin access is required and if the user is not an admin
    if (adminRequired && !isAdmin) {
        //console.log('Redirecting to /home');  //debugging
        return <Navigate to="/home" replace />;
    }

    // send the passed component
    return <Component />;
};

export default ProtectedRoute;