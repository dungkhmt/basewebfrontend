import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import MaterialTable from "material-table";
import { authGet } from "../../api";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import { useHistory } from "react-router-dom";
import { CardContent, Tooltip, IconButton, BarChartIcon } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import AddIcon from '@material-ui/icons/Add';
import { makeStyles } from "@material-ui/core/styles";
import changePageSize, {
  localization,
  tableIcons,
} from '../../utils/MaterialTableUtils';

const useStyles = makeStyles((theme) => ({
  grid: {
    verticalAlign: 'text-bottom',
    textAlign: 'right',
    padding: '0px 50px 10px 30px'
  }
}));

export default function ProjectList() {
  const dispatch = useDispatch();
  const token = useSelector(state => state.auth.token);
  const history = useHistory();
  const classes = useStyles();

  const columns = [
    {
      title: 'Mã dự án',
      field: 'backlogProjectId',
    },
    { title: 'Tên dự án', field: 'backlogProjectName' },
  ];

  let [projectList, setProjectList] = useState([]);

  async function getProjectList() {
    projectList = await authGet(dispatch, token, '/backlog/get-all-project-by-user');
    setProjectList(projectList);
  }

  useEffect(() => {
    getProjectList();
  }, []);

  return <div>
      <CardContent>
        <MaterialTable
          title={"Danh sách dự án"}
          columns={columns}
          data={projectList}
          options={{ search: false }}
          localization={localization}
          onRowClick={(event, rowData) => {
            history.push("/backlog/project/" + rowData.backlogProjectId);
          }}
          actions={[
            {
              icon: () => { return <AddIcon color='primary' fontSize='large'/> },
              tooltip: 'Thêm dự án mới',
              isFreeAction: true,
              onClick: () => { history.push('/backlog/create-project') }
            },
          ]}
        />
      </CardContent>

  </div >;
}