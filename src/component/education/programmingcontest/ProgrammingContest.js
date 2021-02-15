import React, {useEffect, useState} from "react";
import MaterialTable from "material-table";
import {useDispatch, useSelector} from "react-redux";
import {API_URL} from "../../../config/config";
import {Link} from "react-router-dom";
import { authPost, authGet, authPostMultiPart } from "../../../api";


function ProgrammingContest(){
    const dispatch = useDispatch();
    const token = useSelector(state => state.auth.token);
    const [selectedFile, setSelectedFile] = useState(null);
    const [rows, setRows] = useState([]);

    const columns = [
        {field: 'test', title: 'Test'},
        {field: 'output', title: 'Result'}
      ];

    function onFileChange(event){
        setSelectedFile(event.target.files[0]);
        console.log(event.target.files[0].name);
    }
    function onFileUpload(){
        console.log("upload file " + selectedFile.name);
        let body = {
            problemId:"ADD"
        }
        let formData = new FormData();
        formData.append("inputJson",JSON.stringify(body));
        formData.append("file",selectedFile);
        authPostMultiPart(dispatch, token, "/upload-program", formData).then(
            res => {
                console.log('result submit = ',res);
                setRows(res.items);
            }
        );
        
    }
    return(
        <div>
            
            <select>
            <option value="Ford">Ford</option>
            <option value="Volvo" selected>Volvo</option>
            <option value="Fiat">Fiat</option>
            </select>

            <input type="file" onChange={onFileChange} />
                <button onClick={onFileUpload}>
                  Upload!
                </button>
            <div>
            <MaterialTable
                options={{search: true}} title={"Kết quả"}
                columns={columns}
                data={rows}
            />
            </div>    
        </div>
    );
}

export default ProgrammingContest;