import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '@components/login/AuthContext.jsx';


const ProtectedRoute = ({ component: Component, adminRequired = false }) => {

    const { authState } = useContext(AuthContext);

    const { loggedIn, isAdmin } = authState;

    // // Check if the user is not logged in
    // if (!loggedIn) {
    //     return <Navigate to="/login" replace />;
    // }

    // // Check if admin access is required and if the user is not an admin
    // if (adminRequired && !isAdmin) {
    //     return <Navigate to="/home" replace />;
    // }

    // Render the passed component
    return <Component />;

};

export default ProtectedRoute;


