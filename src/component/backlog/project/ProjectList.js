import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import MaterialTable from "material-table";
import { authGet } from "../../../api";
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
} from '../../../utils/MaterialTableUtils';
import {
  TABLE_STRIPED_ROW_COLOR
} from '../BacklogConfig';

export default function ProjectList() {
  const dispatch = useDispatch();
  const token = useSelector(state => state.auth.token);
  const history = useHistory();

  const columns = [
    { title: 'ID dự án', field: 'backlogProjectId' },
    { title: 'Mã dự án', field: 'backlogProjectCode' },
    { title: 'Tên dự án', field: 'backlogProjectName' },
  ];

  let [projectList, setProjectList] = useState([]);

  async function getProjectList() {
    projectList = await authGet(dispatch, token, '/backlog/get-all-project-by-user');
    projectList.sort((a, b) => { return (a.backlogProjectCode > b.backlogProjectCode) - (a.backlogProjectCode < b.backlogProjectCode) });
    setProjectList(projectList);
  }

  useEffect(() => {
    getProjectList();
  }, []);

  return (
    <div>
      <CardContent>
        <MaterialTable
          title={"Danh sách dự án"}
          columns={columns}
          data={projectList}
          options={{
            search: false,
            rowStyle: rowData => { return { backgroundColor: TABLE_STRIPED_ROW_COLOR[rowData.tableData.id % TABLE_STRIPED_ROW_COLOR.length] } },
          }}
          localization={localization}
          onRowClick={(event, rowData) => {
            history.push("/backlog/project/" + rowData.backlogProjectId);
          }}
          actions={[
            {
              icon: () => { return <AddIcon color='primary' fontSize='large' /> },
              tooltip: 'Thêm dự án mới',
              isFreeAction: true,
              onClick: () => { history.push('/backlog/create-project') }
            },
          ]}
        />
      </CardContent>
    </div >
  );
}