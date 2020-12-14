import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import MaterialTable from "material-table";
import { authGet } from "../../../api";
import { useHistory } from "react-router-dom";
import { 
  CardContent, Card 
} from "@material-ui/core";

export default function AssignSuggestionProjectList() {
  const dispatch = useDispatch();
  const token = useSelector(state => state.auth.token);
  const history = useHistory();

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
    getProjectList().then(r => r);
  }, []);

  return <div>
    <Card>
      <CardContent>
        <MaterialTable
          title={"Danh sách dự án"}
          columns={columns}
          data={projectList}
          options={{ search: false }}
          onRowClick={(event, rowData) => {
            history.push("/backlog/assign-suggestion/task-list/" + rowData.backlogProjectId);
          }}
        />
      </CardContent>
    </Card>
  </div >;
}