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
  import AddIcon from '@material-ui/icons/Add';
function ContestTableForRegistration(){
    const params = useParams();
    const dispatch = useDispatch();
    const token = useSelector(state => state.auth.token);
    const history = useHistory();
    const [contests, setContests] = useState([]);

    const columns = [
        { title: 'ID Contest', field: 'contestId',
            render: rowData => (
                <Link to={"/edu/contest-registration/" + rowData["contestId"]}>
                {rowData["contestId"]}
                </Link>
            )
        },
        { title: 'Tên Contest', field: 'contestName' },
        { title: 'Contest Type', field: 'contestTypeId' },
        { title: 'Người tạo', field: 'createdByUserLoginId' },
        
      ];

      async function getContesList(){
        let lst = await authGet(dispatch, token, '/get-all-programming-contest-list');
        setContests(lst);
        
    }
  
      useEffect(() => {
          
        getContesList();
        }, []);
     

    return(
        <Card>
            <CardContent>
            <MaterialTable
                title={"Danh sách Contest"}
                columns={columns}
                data = {contests}    
                
                />                
            </CardContent>
        </Card>
    );
}

export default ContestTableForRegistration;