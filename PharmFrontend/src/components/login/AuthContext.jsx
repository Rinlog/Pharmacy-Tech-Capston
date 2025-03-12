import React, { createContext, useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';

const AuthContext = createContext({
    authState: {
        loggedIn: false,
        isAdmin: false
    },
    setAuthState: () => {},
    logout: () => {}
});

export const AuthProvider = ({ children }) => {
    const [cookies, setCookie, removeCookie] = useCookies(['user', 'admin']);
    const [authState, setAuthState] = useState({
        loggedIn: !!cookies.user,
        isAdmin: cookies.admin === 'Y'
    });

    useEffect(() => {
        setAuthState({
            loggedIn: !!cookies.user,
            isAdmin: cookies.admin === 'Y'
        });
    }, [cookies.user, cookies.admin]);

    const logout = () => {
        removeCookie('user', { path: '/' });
        removeCookie('admin', { path: '/' });
        setAuthState({
            loggedIn: false,
            isAdmin: false
        });
    };

    //console.log('AuthProvider:', authState); //debugging

    return (
        <AuthContext.Provider value={{ authState, setAuthState, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;