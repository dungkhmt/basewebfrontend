
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

function CreateContestProblem(){
    const dispatch = useDispatch();
    const token = useSelector(state => state.auth.token);
    const classes = useStyles();
    const [problemId, setProblemId] = useState(null);
    const [problemName, setProblemName] = useState(null);
    const [problemStatement, setProblemStatement] = useState(null);
    const [alertMessage, setAlertMessage] = useState({
		title: "Vui lòng nhập đầy đủ thông tin cần thiết",
		content: "Một số thông tin yêu cầu cần phải được điền đầy đủ. Vui lòng kiểm tra lại."
	});
	const [alertSeverity, setAlertSeverty] = useState('info');
	const [openAlert, setOpenAlert] = useState(false);
	const history = useHistory();

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
        console.log("handleSubmit");
        let body = {problemId,problemName,problemStatement};
        let contestProblem = await authPost(dispatch, token, '/create-contest-problem', body);
        console.log('return contest problem ',contestProblem);
        
    }
    
    return(
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
			<Card>
				<CardContent>
					<Typography variant="h5" component="h2">
						Tạo bài tập
          </Typography>
					<form className={classes.root} noValidate autoComplete="off">
						<div>
							<TextField
								autoFocus
								required
								id="problemId"
								label="Mã bài tập"
								placeholder="Nhập mã bài tập"
								value={problemId}
								onChange={(event) => {
									setProblemId(event.target.value);
								}}
							/>
						</div>
						<div>
							<TextField
								required
								id="problemName"
								label="Tên bài tập"
								placeholder="Nhập tên bài tập"
								value={problemName}
								onChange={(event) => {
									setProblemName(event.target.value);
								}}
							/>
						</div>
                        <div>
							<TextField
								required
								id="problemStatement"
								label="Mô tả bài tập"
								placeholder="Mô tả bài tập"
								value={problemStatement}
								onChange={(event) => {
									setProblemStatement(event.target.value);
								}}
							/>
						</div>
                        
					</form>
				</CardContent>
				<CardActions>
          <Button
            variant="contained"
            color="primary"
            style={{ marginLeft: "45px" }}
            onClick={handleSubmit}
          >
            Lưu
          </Button>
          <Button
            variant="contained"
            onClick={() => history.push("/backlog/project-list")}
          >
            Hủy
          </Button>
        </CardActions>
			</Card>

			<AlertDialog
				open={openAlert}
				onClose={handleCloseAlert}
				severity={alertSeverity}
        {...alertMessage}
        buttons={[
          {
            onClick: onClickAlertBtn,
            color: "primary",
            autoFocus: true,
            text: "OK"
          }
        ]}
			/>
		</MuiPickersUtilsProvider>
    );
}

export default CreateContestProblem;