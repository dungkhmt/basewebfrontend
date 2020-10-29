import DateFnsUtils from "@date-io/date-fns";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";

import {
	MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { authPost, authGet } from "../../api";
import { useDispatch, useSelector } from "react-redux";

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

export default function CreateProject() {
	const dispatch = useDispatch();
	const token = useSelector(state => state.auth.token);
	const classes = useStyles();
	const [backlogProjectId, setProjectId] = useState(null);
	const [backlogProjectName, setProjectName] = useState(null);
	const history = useHistory();

	async function handleSubmit() {
		if(backlogProjectId === '') {
			alert('Nhập mã dự án rồi thử lại');
		}
		if(backlogProjectName === '') {
			alert('Nhập tên dự án rồi thử lại');
		}

		let body = {backlogProjectId, backlogProjectName};
		let project = await authPost(dispatch, token, '/backlog/create-project', body).then(r => r.json());
		console.log(JSON.stringify(project));
		if(project && project['backlogProjectId']) {
			alert('Tạo thành công dự án mới');
		} else {
			alert('Tạo dự án mới thất bại. Mã dự án đã tồn tại');
		}
		history.push('/backlog/list');
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
            onClick={() => history.push("/backlog/list")}
          >
            Hủy
          </Button>
        </CardActions>
			</Card>
		</MuiPickersUtilsProvider>
	);
}
