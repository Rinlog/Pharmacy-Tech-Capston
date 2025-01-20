import { useCookies } from 'react-cookie';

export const CheckAuth = () => {
    // check the cookies
    const [cookies] = useCookies(['user', 'admin']);

    // extract user and admin cookies
    const { user, admin } = cookies;

    const authState = {
        // a user is considered logged in if the 'user' cookie contains a userid
        loggedIn: !!user, // convert truthy / falsy to boolean
        // a user is an admin if the 'admin' cookie string is exactly "true"
        isAdmin: admin === 'Y'
    };

    //console.log('CheckAuth:', authState); //debugging

    return authState;
};