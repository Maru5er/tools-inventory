import React from 'react';
import LoginComponent from '../../component/userAuth/LoginComponent';
import './Login.css';

const Login : React.FC = () => {
    return (
        <div className="container">
            <LoginComponent />
        </div>
    )
};

export default Login;