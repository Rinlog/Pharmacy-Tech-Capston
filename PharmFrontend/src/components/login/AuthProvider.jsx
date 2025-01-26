import React, { useState, useEffect } from 'react';
import { Cookies } from 'react-cookie';
import AuthContext from '@components/login/AuthContext.jsx';
import { CheckAuth } from '@components/login/CheckAuth.jsx';

const AuthProvider = ({ children, initialAuthState }) => {

    const [authState, setAuthState] = useState(initialAuthState);

    return (
        <AuthContext.Provider value={{ authState, setAuthState }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;