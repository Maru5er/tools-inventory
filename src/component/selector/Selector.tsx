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
    const [updateParam, setUpdateParam] = useState<string>("");
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

    async function getAllData() {
        let dataPromise = fetch("http://localhost:4567/tools")
        .then(response => response.json())
        .then((parsedData) => {
            const toolData = parsedData.tools;
            setData(toolData);
        }).catch((error) => {alert(error)});
    }

    async function updateTool(){
        let updateData : string[] = updateParam.split(",");
        let temp : string = "{}";
        if (updateData.length % 2 != 0) {alert("invalid input"); return;}
        for (let i = 0; i < updateData.length; i += 2){
            //let temp : string = JSON.stringify(updateObj);
            temp = temp.substring(0, temp.length - 1);
            temp += `"${updateData[i]}": "${updateData[i+1]}"`;
            if (i < updateData.length - 2) temp += ",";
            temp += "}";
        }
        console.log(temp);
        let updatedObj : object = JSON.parse(temp);
        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body : JSON.stringify(updatedObj),
        };
        let dataPromise = fetch("http://localhost:4567/" + `tools/${selectedItemID}`, requestOptions)
        .then(response => response.json())
        .then((parsedData) => {
            if (parameter != "" && value != "") generateTable();
            else getAllData();
        }).catch((error) => {alert(error)});
    }
    
    useEffect(() => {
        getAllData();
    },[]);

    return (
        <div>
            <h3>search tools inventory</h3>
            <div id="selection-parameter">
                <input type="text" name = "parameter" placeholder="parameter"
                    onChange= {
                        (e) => {
                            dispatch(setParameter(e.target.value));
                        }}
                />
             <input type="text" name = "value" placeholder="value" 
                    onChange={
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
            selected item id: {selectedItemID}
            <h3>Update Item</h3>
            <div id="update-parameter">
                <input type="text" name = "parameter" placeholder="parameter"
                onChange={(e) => setUpdateParam(e.target.value) }/>
                <input type="text" name = "value" placeholder="value"/>
                <button onClick={() => {
                    updateTool();
                }}>update</button>
            </div>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>name</th>
                        <th>code</th>
                        <th>diameter</th>
                        <th>size</th>
                        <th>angle</th>
                        <th>Status</th>
                        <th>Date in</th>
                        <th>Date out</th>
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
                            <td>{item.status && item.status}</td>
                            <td>{item.dateIn && item.dateIn.toString()}</td>
                            <td>{item.dateOut && item.dateOut.toString()}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    )
}

export default Selector;
