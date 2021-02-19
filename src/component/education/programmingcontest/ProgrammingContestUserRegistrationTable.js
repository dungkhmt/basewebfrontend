import {
    Button, Card, CardActions, CardContent, TextField, Typography,
    MenuItem, Checkbox, 
  } from "@material-ui/core/";
  import React, { useState, useEffect } from "react";
  import { useHistory } from "react-router-dom";
  import { authPost, authGet, authPostMultiPart } from "../../../api";
  import { useDispatch, useSelector } from "react-redux";
  import { useParams } from "react-router";
  import MaterialTable from "material-table";
  import {Link} from "react-router-dom";
  
function ProgrammingContestUserRegistrationTable(){
    const params = useParams();
    const dispatch = useDispatch();
    const token = useSelector(state => state.auth.token);
    const history = useHistory();
    const [contestUserRegistrations, setContestUserRegistrations] = useState([]);

    const columns = [
        { title: 'Contest', field: 'contestId'},
        { title: 'User', field: 'userLoginId' }
    ];

    async function getProgrammingContestUserRegistration(){
        let lst = await authGet(dispatch, token, '/get-all-programming-contest-user-registration-list');
        setContestUserRegistrations(lst);
    }
    useEffect(() => {
        getProgrammingContestUserRegistration();
    },[]);

    return(
        <Card>
            <CardContent>
                <MaterialTable
                title={"Danh sách user đăng ký Contest"}
                columns={columns}
                data = {contestUserRegistrations}    
                /> 
            </CardContent>
        </Card>
    );
}

export default ProgrammingContestUserRegistrationTable;