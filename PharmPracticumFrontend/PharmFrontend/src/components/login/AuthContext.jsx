import { createContext } from 'react';

const AuthContext = createContext({
    authState: {
        loggedIn: false,
        isAdmin: false
    },
    setAuthState: () => {},
    logout: () => {}
});

export default AuthContext;
