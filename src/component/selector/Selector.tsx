import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { setParameter, setValue } from "./selectorSlice";
import Table from "react-bootstrap/Table";
import { ITool } from "./toolInterface";

const Selector : React.FC = () => {
    const dispatch = useAppDispatch();
    const parameter : string = useAppSelector((state) => state.selector.parameter);
    const value : string = useAppSelector((state) => state.selector.value);
    const [searchParam, setSearchParam] = useState<string>("");
    const [data, setData] = useState<ITool[]>([]);
    const [selectedItemID, setSelectedItemID] = useState<string[]>([]);
    const [updateParam, setUpdateParam] = useState<string>("");
    const [addParam, setAddParam] = useState<string>("");
    const url = process.env.serverURL

    async function generateTable() {
        let searchBody : string | undefined = JSONStringBuilder(searchParam.split(","));;
        let requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body : (searchBody === undefined) ? "{}" : searchBody,
        }
        let dataPromise = fetch("http://localhost:4567/" + `tools/search`, requestOptions)
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

    function JSONStringBuilder(value : string[]) : string | undefined {
        if (value.length % 2 !== 0 || value.length === 0) {alert("invalid input"); return undefined;}
        let temp : string = "{}";
        for (let i = 0; i < value.length; i += 2){
            temp = temp.substring(0, temp.length - 1);
            temp += `"${value[i]}": "${value[i+1]}"`;
            if (i < value.length - 2) temp += ",";
            temp += "}";
        }
        return temp;
    }

    async function updateTool(){
        let updateData : string[] = updateParam.split(",");
        let temp : string | undefined = JSONStringBuilder(updateData);
        if (temp === undefined) return;
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
    
    async function bulkUpdateTool(){
    }

    async function addTool(){
        let toolBody : string[] = addParam.split(",");
        const keys : string[] = ["name", "code", "diameter", "size", "angle", "status", "dateIn", "dateOut"];
        let JSONtoStringArray : string[] = [];
        for (let i = 0; i < toolBody.length; i++){
            JSONtoStringArray.push(keys[i]);
            JSONtoStringArray.push(toolBody[i]);
        }
        let temp : string | undefined = JSONStringBuilder(JSONtoStringArray);
        console.log(temp);
        if (temp === undefined) return;
        let requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body : temp,
        };
        let addToolPromise = fetch("http://localhost:4567/tools",requestOptions)
        .then(response => response.json())
        .then((parsedData) => {
            if (parameter != "" && value != "") generateTable();
            else getAllData();
        }).catch((error) => {alert(error)});
    }

    async function deleteTool(){
        let deleteToolPromise = fetch("http://localhost:4567/" + `tools/${selectedItemID[0]}`, {method : 'DELETE'})
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
            <h3>Add tool</h3>
            <div>
                {addParam}
                <input type="text" name = "addTool" placeholder="name,code,diameter,size,angle,status,in,out"
                onChange={(e) => setAddParam(e.target.value) }/>
                <button onClick={() => addTool()}>Add</button>
            </div>
            <h3>search tools inventory</h3>
            <div id="selection-parameter">
                <input type="text" name = "parameter" placeholder="parameter"
                    onChange= {
                        (e) => {
                            setSearchParam(e.target.value);
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
            <p>selected item id: {selectedItemID}</p>
            <button onClick={() => deleteTool()}>delete</button>
            <h3>Update Item</h3>
            <div id="update-parameter">
                <input type="text" name = "parameter" placeholder="parameter"
                onChange={(e) => setUpdateParam(e.target.value) }/>
                <br/>
                <button onClick={() => {
                    updateTool();
                }}>update</button>
                <button onClick = {() => bulkUpdateTool()}>bulk update</button>
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
                        <tr onClick= {() => setSelectedItemID([item._id])} key={item._id}>
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
