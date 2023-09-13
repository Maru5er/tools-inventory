import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { setParameter, setValue } from "./selectorSlice";
import Table from "react-bootstrap/Table";
import { ITool } from "./toolInterface";
import Cookies from "universal-cookie";
//import 'bootstrap/dist/css/bootstrap.min.css';
import './Selector.css';
import axios from "axios";


interface EntryI {
    name : string,
    code : string,
    diameter : string,
    size : string, 
    angle: string,
    material : string,
    height : string,
    status : string,
    machine : string,
    description : string,
    dateIn : string,
    dateOut : string,
}

const initialEntry = {
    name : "",
    code : "",
    diameter : "",
    size : "",
    angle : "",
    material : "",
    height : "",
    status : "",
    machine : "",
    description : "",
    dateIn : "",
    dateOut : "",
}


const Selector : React.FC = () => {
    const dispatch = useAppDispatch();
    const parameter : string = useAppSelector((state) => state.selector.parameter);
    const value : string = useAppSelector((state) => state.selector.value);
    const [searchParam, setSearchParam] = useState<string>("");
    const [data, setData] = useState<ITool[]>([]);
    const [selectedItemID, setSelectedItemID] = useState<string[]>([]);
    const [updateParam, setUpdateParam] = useState<string>("");
    const [addParam, setAddParam] = useState<string>("");
    const [entry, setEntry] = useState<EntryI>(initialEntry);

    //clicked item
    const [activeRow, setActiveRow] = useState<string[]>([]);
    const url : string = `${process.env.REACT_APP_SERVER_URL}`;
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
        const keys : string[] = ["name", "code", "diameter", "size", "angle", "material","height", "status", "machine", "description", "dateIn", "dateOut"];
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

    function entryBuilder(entryParam : string) {
        console.log("entry builder")
        const keys : string[] = ["name", "code", "diameter", "size", "angle", "material","height", "status", "machine", "description", "dateIn", "dateOut"];
        let addEntries : string[] = entryParam.split(",");
        for (let i = 0; i < addEntries.length; i++){
            setEntry({...entry, [keys[i]] : addEntries[i]});
            console.log(entry);
        }
    }

    function generateEntriesJSX() : JSX.Element[] {
        const keys : string[] = ["name", "code", "diameter", "size", "angle", "material","height", "status", "machine", "description", "dateIn", "dateOut"];
        let entries : JSX.Element[] = [];
        for (let i = 0; i < keys.length; i++){
            entries.push(
                <div>
                    <p className="search-item-text">{keys[i]}: </p>
                    <input className="search-item" placeholder={keys[i]} value={entry[keys[i] as keyof EntryI]} 
                    onChange={(e) => {
                        setEntry({...entry, [keys[i]] : e.target.value});
                    }}/>
                </div>
            );
        }
        return entries;
    }

    return (
        <div>  
            <div className="add-container">
                <h3 className="top-search-text">Add tool</h3>
                <input className="top-search" type="text" name = "addTool" placeholder="name,code,diameter,size,angle,status,in,out" id="addTopEntry"
                onChange={(e) => {
                    setAddParam(e.target.value);
                    entryBuilder((document.getElementById("addTopEntry") as HTMLInputElement).value);
                }}/>
                {generateEntriesJSX()}

                <button className="add-button" onClick={() => addTool()}>Add</button>
            </div>
            <h3>search tools inventory</h3>
            <div className="search-container">
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
                        <th>Material</th>
                        <th>Height</th>
                        <th>Status</th>
                        <th>Machine</th>
                        <th>Date in</th>
                        <th>Date out</th>
                        <th>Description</th>
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
                            <td >{item.material && item.material}</td>
                            <td >{item.height && item.height}</td>
                            <td >{item.status && item.status}</td>
                            <td >{item.machine && item.machine}</td>
                            <td >{item.dateIn && item.dateIn.toString()}</td>
                            <td >{item.dateOut && item.dateOut.toString()}</td>
                            <td >{item.description && item.description}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    )
}

export default Selector;
