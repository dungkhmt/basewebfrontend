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

    function onFileChange(event){
        setSelectedFile(event.target.files[0]);
        console.log(event.target.files[0].name);
    }
    function onFileUpload(){
        console.log("upload file " + selectedFile.name);
        let body = {
            problem:"ADD"
        }
        let formData = new FormData();
        formData.append("inputJson",JSON.stringify(body));
        formData.append("file",selectedFile);
        authPostMultiPart(dispatch, token, "/upload-program", formData);
    }
    return(
        <div>
            Programming Contest
            <input type="file" onChange={onFileChange} />
                <button onClick={onFileUpload}>
                  Upload!
                </button>
        </div>
    );
}

export default ProgrammingContest;