import { useEffect } from 'react';
import { useCookies } from 'react-cookie';

const InitializeCookies = ({ children }) => {
    const [cookies, setCookie] = useCookies(['user', 'admin']);

    useEffect(() => {
        if (!cookies.user) {
            setCookie('user', '', { path: '/', sameSite: 'none', secure: true });
        }
        if (!cookies.admin) {
            setCookie('admin', '', { path: '/', sameSite: 'none', secure: true });
        }
    }, [cookies, setCookie]);

    return children; // Render children components
};

export default InitializeCookies;