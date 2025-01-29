import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '@components/login/AuthContext.jsx';

const UnProtectedRoute = ({ component: Component}) => {
    const { authState } = useContext(AuthContext);
    const { loggedIn, isAdmin } = authState;

    //console.log('UnProtectedRoute:', { loggedIn}); //debugging

    // check if the user is logged in
    if (loggedIn === true) {
        //console.log('Redirecting to /home'); //debugging
        return (<Navigate to="/home" replace />);
    }

    // send the passed component
    return <Component />;
};

export default UnProtectedRoute;