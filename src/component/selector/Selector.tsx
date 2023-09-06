import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { setParameter, setValue } from "./selectorSlice";

const Selector : React.FC = () => {
    const dispatch = useAppDispatch();
    const parameter : string = useAppSelector((state) => state.selector.parameter);
    const value : string = useAppSelector((state) => state.selector.value);
    const [data, setData] = useState<JSX.Element[]>([]);
    const url = process.env.serverURL
    async function generateTable() {
        let dataPromise = fetch("http://localhost:4567"+ `/tools/${parameter}&${value}`)
        .then(response => response.json())
        .then((parsedData) => {
            const toolData = parsedData.tools;
            console.log(toolData);
            for (let i : number = 0; i < toolData.length; i++) {
                let item = <div>{toolData[i]}</div>
                setData((prevData) => [...prevData, toolData[i]]);
            }
        }).catch((error) => {alert(error)});
    }

    return (
        <div>
            search tools inventory
            <div id="selection-parameter">
                parameter
                <br/>
                <input type="text" name = "parameter"
                    onChange= {
                        (e) => {
                            dispatch(setParameter(e.target.value));
                        }}/>
            </div>
            <div id="selection-value">value
            <br/>
             <input type="text" name = "value" onChange={
                (e) => {
                    dispatch(setValue(e.target.value));
                }
             }/>
            </div>
            <div id="search-button">
                <button onClick={
                    () => {
                        console.log(generateTable());
                    }
                }>search</button>
            </div>
            {data}
        </div>
    )
}

export default Selector;
