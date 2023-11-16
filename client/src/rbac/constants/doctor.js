import Home from '../../pages/Home/Home';
import Landing from '../../pages/Landing/landing';
import Login from '../../pages/Login/Login';
import Signup from '../../pages/SignUp/signUp';

const DOCTOR_ROUTES = [
    // {
    //       link: '/',
    //       name: 'User home',
    //       component: < Home / >
    //   },
    {
        link: '/signUp',
        name: 'SignUp',
        component: < Signup / >
    },
    {
        link: '/login',
        name: 'Login',
        component: < Login / >
    },
    {
        link: '/',
        name: 'Landing',
        component: < Landing / >
    }
];

export default DOCTOR_ROUTES;