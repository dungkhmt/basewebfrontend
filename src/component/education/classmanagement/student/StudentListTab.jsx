import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  Link,
  Paper,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import MaterialTable from "material-table";
import React, { useEffect, useRef, useState } from "react";
import { FcConferenceCall } from "react-icons/fc";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import { request } from "../../../../api";
import changePageSize, {
  localization,
  tableIcons,
} from "../../../../utils/MaterialTableUtils";

const useStyles = makeStyles((theme) => ({
  card: {
    marginTop: theme.spacing(2),
  },
}));

function StudentListTab({ classId }) {
  const classes = useStyles();
  const token = useSelector((state) => state.auth.token);
  const history = useHistory();

  const [students, setStudents] = useState([]);

  // Table refs.
  const studentTableRef = useRef(null);

  const headerProperties = {
    headerStyle: {
      textAlign: "center",
    },
    cellStyle: {
      textAlign: "center",
      fontSize: "1rem",
    },
  };
  const studentCols = [
    {
      field: "name",
      title: "Họ và tên",
      ...headerProperties,
    },
    {
      field: "email",
      title: "Email",
      ...headerProperties,
      render: (rowData) => (
        <Link href={`mailto:${rowData.email}`}>{rowData.email}</Link>
      ),
    },
  ];

  const getStudentsOfClass = () => {
    request(
      // token, history,
      "get",
      `/edu/class/${classId}/students`,
      (res) => {
        changePageSize(res.data.length, studentTableRef);
        setStudents(res.data);
      }
    );
  };

  useEffect(() => {
    getStudentsOfClass();
  }, []);

  return (
    <Card className={classes.card}>
      <CardHeader
        avatar={
          <Avatar style={{ background: "white" }}>
            {/*#ffeb3b <PeopleAltRoundedIcon /> */}
            <FcConferenceCall size={40} />
          </Avatar>
        }
        title={<Typography variant="h5">Danh sách sinh viên</Typography>}
      />

      <CardContent>
        <MaterialTable
          title=""
          columns={studentCols}
          icons={tableIcons}
          tableRef={studentTableRef}
          localization={localization}
          data={students}
          components={{
            Container: (props) => <Paper {...props} elevation={0} />,
          }}
          options={{
            filtering: true,
            search: false,
            pageSize: 10,
            debounceInterval: 500,
            headerStyle: {
              backgroundColor: "#673ab7",
              fontWeight: "bold",
              fontSize: "1rem",
              color: "white",
            },
            filterCellStyle: { textAlign: "center" },
            cellStyle: { fontSize: "1rem" },
            toolbarButtonAlignment: "left",
          }}
        />
      </CardContent>
    </Card>
  );
}

export default StudentListTab;
