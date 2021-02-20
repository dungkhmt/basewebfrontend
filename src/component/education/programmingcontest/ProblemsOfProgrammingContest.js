
import DateFnsUtils from "@date-io/date-fns";
import Button from "@material-ui/core/Button";
import {
	Card, CardActions, CardContent, TextField, Typography
} from "@material-ui/core/";
import { makeStyles } from "@material-ui/core/styles";
import {
	MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { authPost, authGet } from "../../../api";
import { useDispatch, useSelector } from "react-redux";
import AlertDialog from '../../common/AlertDialog';
import { Editor } from "react-draft-wysiwyg";
import { ContentState, convertToRaw, EditorState } from "draft-js";
import { useParams } from "react-router";
import draftToHtml from "draftjs-to-html";
import {Link} from "react-router-dom";
import AddIcon from '@material-ui/icons/Add';
import MaterialTable from "material-table";

const useStyles = makeStyles((theme) => ({
	root: {
		padding: theme.spacing(4),
		"& .MuiTextField-root": {
			margin: theme.spacing(1),
			width: '100%',
			minWidth: 120,
		},
	},
	formControl: {
		margin: theme.spacing(1),
		minWidth: 120,
		maxWidth: 300,
	},
}));

let reDirect = null;

const editorStyle = {
	toolbar: {
	  background: "#90caf9",
	},
	editor: {
	  border: "1px solid black",
	  minHeight: "300px",
	},
  };

function ProblemsOfProgrammingContest(props){
    const params = useParams();
    //const contestId = params.contestId;
    const contestId = props.contestId;

    const dispatch = useDispatch();
    const token = useSelector(state => state.auth.token);
    const classes = useStyles();
    const [problems, setProblems] = useState([]);

    const [alertMessage, setAlertMessage] = useState({
		title: "Vui lòng nhập đầy đủ thông tin cần thiết",
		content: "Một số thông tin yêu cầu cần phải được điền đầy đủ. Vui lòng kiểm tra lại."
	});
	const [alertSeverity, setAlertSeverty] = useState('info');
	const [openAlert, setOpenAlert] = useState(false);
	const history = useHistory();

    const columns = [
        { title: 'ID bài tập', field: 'problemId', 
          render: rowData => (
            <Link to={"/edu/contest-problem/detail/" + rowData["problemId"]}>
            {rowData["problemId"]}
            </Link>
          )
        },
        { title: 'Tên bài tập', field: 'problemName' },
        { title: 'Mô tả', field: 'problemStatement' },
      ];

	const handleCloseAlert = () => {
		setOpenAlert(false);
	}

	const onClickAlertBtn = () => {
		setOpenAlert(false);
		if(reDirect != null) {
			history.push(reDirect);
		}
	}

    async function handleSubmit() {
		
		let body = {contestId:contestId
		};
		//let body = {problemId,problemName,statement};
        let contest = await authPost(dispatch, token, '/register-programming-contest', body);
        console.log('return contest registration  ',contest);
        
		history.push("contestprogramming");
    }
    async function getProblemsOfTheProgrammingContest(){
        let lst = await authGet(dispatch, token, '/get-problems-of-programming-contest/' + contestId);
        setProblems(lst);
    }
    useEffect(()=>{
        getProblemsOfTheProgrammingContest();
    },[]);
    return(
                <MaterialTable
                title={"Danh sách Bài"}
                columns={columns}
                data = {problems}
                actions={[
                    {
                      icon: () => { return <AddIcon color='primary' fontSize='large' /> },
                      tooltip: 'Thêm bài thi',
                      isFreeAction: true,
                      onClick: () => { history.push('add-problem-to-programming-contest/' + contestId) }
                    },
                  ]}
                />

    );
}

export default ProblemsOfProgrammingContest;