import React from 'react';
import { Redirect } from 'react-router-dom';
import Auth from '../../utils/Auth';

const authLogin = new Auth('http://localhost:3000');

class Logout extends React.Component {

    componentDidMount() {
        authLogin.logout();
    }

    render() {
        return (<Redirect to='/login' />);
    }
}

export default Logout;