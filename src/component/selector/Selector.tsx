import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { setParameter, setValue } from "./selectorSlice";
import Table from "react-bootstrap/Table";
import { ITool } from "./toolInterface";
import Cookies from "universal-cookie";
//import 'bootstrap/dist/css/bootstrap.min.css';
import './Selector.css';
import axios from "axios";

const Selector : React.FC = () => {
    const dispatch = useAppDispatch();
    const parameter : string = useAppSelector((state) => state.selector.parameter);
    const value : string = useAppSelector((state) => state.selector.value);
    const [searchParam, setSearchParam] = useState<string>("");
    const [data, setData] = useState<ITool[]>([]);
    const [selectedItemID, setSelectedItemID] = useState<string[]>([]);
    const [updateParam, setUpdateParam] = useState<string>("");
    const [addParam, setAddParam] = useState<string>("");

    //clicked item
    const [activeRow, setActiveRow] = useState<string[]>([]);
    const url : string = "https://tools-inventory-backend-1-d6f2b0c3a7ae.herokuapp.com/";
    const cookies = new Cookies();
    const token = cookies.get('token');
    async function generateTable() {
        let searchBody : string | undefined = JSONStringBuilder(searchParam.split(","));;
        let requestOptions = {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization' : 'Bearer ' + token,
        },
            body : (searchBody === undefined) ? "{}" : searchBody,
        }
        let dataPromise = fetch(url + `tools/search`, requestOptions)
        .then(response => response.json())
        .then((parsedData) => {
            const toolData = parsedData.tool;
            console.log(toolData);
            setData(toolData);
        }).catch((error) => {alert(error)});
    }

    async function getAllData() {
        console.log(token);
        try {
            let dataPromise = fetch(url + `tools`, {headers : {'Authorization' : 'Bearer ' + token}})
            .then(response => response.json())
            .then((parsedData) => {
                const toolData = parsedData.tools;
                setData(toolData);
            }).catch((error) => {alert("unable to fetch or invalid token")});
        } catch (error) {
            alert("login first");
        }
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
        let bodyData : object = {
            ids : activeRow,
            updateParams : updatedObj,
        }
        const requestOptions = {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization' : 'Bearer ' + token,
            },
            body : JSON.stringify(bodyData),
        };
        let dataPromise = fetch(url+ `tools/update`, requestOptions)
        .then(response => response.json())
        .then((parsedData) => {
            if (parameter !== "" && value !== "") generateTable();
            else getAllData();
        }).catch((error) => {alert(error)});
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
            headers: { 
                'Content-Type': 'application/json',
                'Authorization' : 'Bearer ' + token,
            },
            body : temp,
        };
        let addToolPromise = fetch(url + "tools",requestOptions)
        .then(response => response.json())
        .then((parsedData) => {
            if (parameter !== "" && value !== "") generateTable();
            else getAllData();
        }).catch((error) => {alert(error)});
    }


    async function deleteTool(){
        const deleteItems = {
            ids : activeRow
        }
        let deleteItemsString = JSON.stringify(deleteItems);
        const requestOptions = {
            method: 'POST',
            headers : { 'Content-Type' : 'application/json',
                        'Authorization' : 'Bearer ' + token,
                       },
            body : deleteItemsString,
        }
        let deleteToolPromise = fetch(url + `tools/delete`, requestOptions)
        .then(response => response.json())
        .then((parsedData) => {
            if (parameter !== "" && value !== "") generateTable();
            else getAllData();
        }).catch((error) => {alert(error)});
    }

    function toggleActive(i :  string) {
        if (activeRow.includes(i)) {
            setActiveRow(activeRow.filter((item) => item !== i));
        } else {
            setActiveRow([...activeRow, i]);
        }
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
            </div>
            <div id="search-button">
                <button onClick={
                    () => {
                        console.log(generateTable());
                    }
                }>search</button>
            </div>
            <button onClick={() => deleteTool()}>delete</button>
            <h3>Update Item</h3>
            <div id="update-parameter">
                <input type="text" name = "parameter" placeholder="parameter"
                onChange={(e) => setUpdateParam(e.target.value) }/>
                <br/>
                <button onClick={() => {
                    updateTool();
                }}>update</button>
            </div>
            <Table bordered = {true}>
                <thead className="table-border">
                    <tr>
                        <th>name</th>
                        <th>code</th>
                        <th>diameter</th>
                        <th>size</th>
                        <th>angle</th>
                        <th>Status</th>
                        <th>Material</th>
                        <th>Date in</th>
                        <th>Date out</th>
                    </tr>
                </thead>
                <tbody>
                    {data && data.map((item) => (
                        <tr
                            id={activeRow.includes(item._id) ? "selected" : "not-selected"}
                            onClick= {() =>  {
                                            setSelectedItemID([item._id]);
                                            toggleActive(item._id);
                                            }}
                            key={item._id}>
                            <td >{item.name}</td>
                            <td >{item.code}</td>
                            <td >{item.diameter}</td>
                            <td >{item.size}</td>
                            <td >{item.angle}</td>
                            <td>{item.material && item.material}</td>
                            <td >{item.status && item.status}</td>
                            <td >{item.dateIn && item.dateIn.toString()}</td>
                            <td >{item.dateOut && item.dateOut.toString()}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    )
}

export default Selector;
