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
import AlertDialog from '../AlertDialog';

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

export default function CreateProject() {
	const dispatch = useDispatch();
	const token = useSelector(state => state.auth.token);
	const classes = useStyles();
	const [backlogProjectId, setProjectId] = useState(null);
	const [backlogProjectName, setProjectName] = useState(null);
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
		if(backlogProjectId === '' || backlogProjectId == null || backlogProjectId === undefined
			|| backlogProjectName === '' || backlogProjectName === null || backlogProjectName === undefined
		) {
			reDirect = null;
			setAlertSeverty('warning');
			setAlertMessage({
				title: "Vui lòng nhập đầy đủ thông tin cần thiết",
				content: "Một số thông tin yêu cầu cần phải được điền đầy đủ. Vui lòng kiểm tra lại."
			});
			setOpenAlert(true);
			return;
		}

		let body = {backlogProjectId, backlogProjectName};
		let project = await authPost(dispatch, token, '/backlog/create-project', body).then(r => r.json());

		if(project && project['backlogProjectId']) {
			reDirect = '/backlog/project-list';
			setAlertSeverty('success');
			setAlertMessage({
				title: "Tạo dự án mới thành công",
				content: "Ấn OK để trở lại danh sách dự án."
			});
			setOpenAlert(true);
			return;
		} else {
			reDirect = null;
			setAlertSeverty('error');
			setAlertMessage({
				title: "Tạo dự án mới thất bại",
				content: "Mã dự án đã tồn tại, vui lòng nhập mã dự án khác."
			});
			setOpenAlert(true);
			return;
		}
	}

	return (
		<MuiPickersUtilsProvider utils={DateFnsUtils}>
			<Card>
				<CardContent>
					<Typography variant="h5" component="h2">
						Tạo dự án mới
          </Typography>
					<form className={classes.root} noValidate autoComplete="off">
						<div>
							<TextField
								autoFocus
								required
								id="projectId"
								label="Mã dự án"
								placeholder="Nhập mã dự án"
								value={backlogProjectId}
								onChange={(event) => {
									setProjectId(event.target.value);
								}}
							/>
						</div>
						<div>
							<TextField
								required
								id="projectName"
								label="Tên dự án"
								placeholder="Nhập tên dự án"
								value={backlogProjectName}
								onChange={(event) => {
									setProjectName(event.target.value);
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
