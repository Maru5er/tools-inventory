import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { setParameter, setValue } from "./selectorSlice";
import Table from "react-bootstrap/Table";
import { ITool } from "./toolInterface";

const Selector : React.FC = () => {
    const dispatch = useAppDispatch();
    const parameter : string = useAppSelector((state) => state.selector.parameter);
    const value : string = useAppSelector((state) => state.selector.value);
    const [data, setData] = useState<ITool[]>([]);
    const [selectedItemID, setSelectedItemID] = useState<string>("");
    const url = process.env.serverURL
    async function generateTable() {
        let dataPromise = fetch("http://localhost:4567/" + `tools/${parameter}&${value}`)
        .then(response => response.json())
        .then((parsedData) => {
            const toolData = parsedData.tool;
            console.log(toolData);
            setData(toolData);
        }).catch((error) => {alert(error)});
    }

    
    useEffect(() => {
        async function getAllData() {
            let dataPromise = fetch("http://localhost:4567/tools")
            .then(response => response.json())
            .then((parsedData) => {
                const toolData = parsedData.tools;
                setData(toolData);
            }).catch((error) => {alert(error)});
        }
        getAllData();
    },[]);




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
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>name</th>
                        <th>code</th>
                        <th>diameter</th>
                        <th>size</th>
                        <th>angle</th>
                        <th>Date in</th>
                        <th>Date out</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {data && data.map((item) => (
                        <tr onClick= {() => setSelectedItemID(item._id)}>
                            <td>{item.name}</td>
                            <td>{item.code}</td>
                            <td>{item.diameter}</td>
                            <td>{item.size}</td>
                            <td>{item.angle}</td>
                            <td>{item.dateIn && item.dateIn.toString()}</td>
                            <td>{item.dateOut && item.dateOut.toString()}</td>
                            <td>{item.status && item.status}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            selected item id: {selectedItemID}
        </div>
    )
}

export default Selector;
