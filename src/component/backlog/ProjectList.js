import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import MaterialTable from "material-table";
import { authGet } from "../../api";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import { CardContent } from "@material-ui/core";
import Card from "@material-ui/core/Card";

export default function ProjectList() {
  const dispatch = useDispatch();
  const token = useSelector(state => state.auth.token);
  const history = useHistory();

  const columns = [
    {
      title: 'Mã dự án',
      field: 'backlogProjectId',
      // render: rowData => <Link to={"/backlog/project/" + rowData.backlogProjectId}>{rowData.backlogProjectId}</Link>
    },
    { title: 'Tên dự án', field: 'backlogProjectName' },
  ];

  let [projectList, setProjectList] = useState([]);

  async function getProjectList() {
    projectList = await authGet(dispatch, token, '/backlog/get-all-project-by-user');
    setProjectList(projectList);
  }

  useEffect(() => {
    getProjectList().then(r => r);
  }, []);

  return <div>
    <Card>
      <CardContent>
        <div>
          <Grid container spacing={3}>
            <Grid item xs={12} style={{verticalAlign: 'text-bottom', textAlign: 'right', padding: '0px 50px 10px 30px'}}>
              <Button color={'primary'} variant={'contained'} onClick={() => history.push('/backlog/create-project')}>
                Thêm mới
              </Button>
            </Grid>
          </Grid>
        </div>
        <p></p>
        <MaterialTable
          title={"Danh sách dự án"}
          columns={columns}
          data={projectList}
          options={{ search: false }}
          onRowClick={(event, rowData) => {
            history.push("/backlog/project/" + rowData.backlogProjectId);
          }}
        />
      </CardContent>
    </Card>


  </div >;
}