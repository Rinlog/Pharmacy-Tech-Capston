import {useCookies} from 'react-cookie';

export const CheckAuth = () => {

    // Check the cookies
    const [cookies] = useCookies(['user', 'admin']);

    // Extract user and admin cookies
    const { user, admin } = cookies;

    return {

        // A user is considered logged in if the 'user' cookie contains a userid
        loggedIn: !!user, // Convert truthy / falsy to boolean
        // A user is an admin if the 'admin' cookie string is exactly "true"
        isAdmin: admin === 'Y'

    };

}