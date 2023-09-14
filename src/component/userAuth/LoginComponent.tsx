import React from "react";
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { setUsername, setToken } from "./userSlice";
import Cookies from "universal-cookie";
import {Navigate} from "react-router-dom";
import './LoginComponent.css';

const LoginComponent : React.FC = () => {
    const dispatch = useAppDispatch();
    const [username, setLocalUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const url = `${process.env.REACT_APP_SERVER_URL}user/`;
    console.log(url);
    let globalUsername : string = useAppSelector((state) => state.user.username);
    const cookies = new Cookies();
    const token = cookies.get('token');
    

    async function login() {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body : JSON.stringify({
                username : username,
                password : password,
            })
        }
        let dataPromise = fetch(url + "login", requestOptions)
        .then(response => response.json())
        .then((parsedData) => {
            if (parsedData && parsedData.username === username) {
                cookies.set('token', parsedData.token, { path: '/' });
                dispatch(setUsername(username));
            } else {
                alert("invalid username or password");
            }
        }).catch((error) => {alert(error)});
    }

    async function getUser() {
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json',
                        'Authorization' : 'Bearer ' + token },
        }
        let dataPromise = fetch(url + "getuser", requestOptions)
        .then(response => response.json())
        .then((parsedData) => {
            dispatch(setUsername(parsedData.username));
        }).catch((error) => {alert(error)});
    }

    useEffect(() => {
        if (token) {
            try {
                getUser();
            } catch (error) {
                alert("invalid token");
            }
        }
    })

    return (
            <div className = "login-form">
                <h1 className="form-head">Login</h1>
                <input className="form-input" type="text" name="username" placeholder="username" onChange={(e) => {
                    setLocalUsername(e.target.value);
                }}/>
                <input className="form-input" type="text" name="password" placeholder="password" onChange={(e) => {
                    setPassword(e.target.value);
                }}/>
                <button className="form-button" onClick={()=> {
                    login();
                }
                
                }>Login</button>
            {globalUsername && (
                <Navigate to="/toolview" />
            ) }
            </div>
        
    );
}

export default LoginComponent;