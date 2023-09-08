import React from "react";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { setUsername, setToken } from "./userSlice";
import {cookie, setCookie} from "react-cookies";

const LoginComponent : React.FC = () => {
    const dispatch = useAppDispatch();
    const [username, setLocalUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const url = "http://localhost:4567/";
    const token : string = useAppSelector((state) => state.user.token);

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
            if (parsedData.token) {
                console.log(parsedData.token);
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