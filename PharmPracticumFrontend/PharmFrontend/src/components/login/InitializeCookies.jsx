import { useEffect } from 'react';
import { useCookies } from 'react-cookie';

const InitializeCookies = ({ children }) => {
    const [cookies, setCookie] = useCookies(['user', 'admin']);

    useEffect(() => {
        // Initialize cookies only if they don't already exist
        if (!cookies.user) {
            setCookie('user', '', { path: '/', sameSite: 'none', secure: true });
        }
        if (!cookies.admin) {
            setCookie('admin', '', { path: '/', sameSite: 'none', secure: true });
        }
    }, [cookies, setCookie]); // Add a check to avoid unnecessary re-renders

    return children; // Render children components
};

export default InitializeCookies;
