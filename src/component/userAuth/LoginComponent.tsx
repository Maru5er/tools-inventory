import React from "react";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { setUsername, setToken } from "./userSlice";
import Cookies from "universal-cookie";

const LoginComponent : React.FC = () => {
    const dispatch = useAppDispatch();
    const [username, setLocalUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const url = `${process.env.REACT_APP_SERVER_URL}user/`;
    console.log(url);
    const token : string = useAppSelector((state) => state.user.token);
    const cookies = new Cookies();

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
                dispatch(setToken(parsedData.token));
            } else {
                alert("invalid username or password");
            }
        }).catch((error) => {alert(error)});
    }

    return (
            <div id = "login-form">
                <input type="text" name="username" placeholder="username" onChange={(e) => {
                    setLocalUsername(e.target.value);
                }}/>
                <input type="text" name="password" placeholder="password" onChange={(e) => {
                    setPassword(e.target.value);
                }}/>
                <button onClick={()=> {
                    login();
                }
                
                }>Login</button>
            {token}
            </div>
        
    );
}

export default LoginComponent;