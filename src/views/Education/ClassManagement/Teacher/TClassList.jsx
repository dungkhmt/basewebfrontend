import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  Paper,
  Typography,
  IconButton,
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import { makeStyles, MuiThemeProvider } from "@material-ui/core/styles";
import MaterialTable from "material-table";
import React, { useEffect, useRef, useState } from "react";
import { FaListUl } from "react-icons/fa";
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

function TClassList() {
  const classes = useStyles();
  const history = useHistory();
  const token = useSelector((state) => state.auth.token);

  // Table.
  const headerProperties = {
    headerStyle: {
      textAlign: "center",
    },
    cellStyle: {
      textAlign: "center",
      fontSize: "1rem",
    },
  };

  const columns = [
    {
      field: "classCode",
      title: "Mã lớp",
      ...headerProperties,
    },
    {
      field: "courseId",
      title: "Mã môn",
      ...headerProperties,
    },
    {
      field: "courseName",
      title: "Tên môn",
      ...headerProperties,
    },
    {
      field: "createdByUserLoginId",
      title: "Người tạo",
      ...headerProperties,
    },

    {
      field: "semester",
      title: "Học kỳ",
      ...headerProperties,
    },

    {
      field: "statusId",
      title: "Trạng thái",
      ...headerProperties,
    },
  ];

  const cols = [
    {
      field: "classCode",
      title: "Mã lớp",
      ...headerProperties,
    },
    {
      field: "courseId",
      title: "Mã học phần",
      ...headerProperties,
    },
    {
      field: "name",
      title: "Tên học phần",
      headerStyle: {
        textAlign: "center",
      },
    },
    {
      field: "classType",
      title: "Loại lớp",
      ...headerProperties,
    },
    {
      field: "department",
      title: "Khoa/Viện",
      ...headerProperties,
    },
    {
      field: "semester",
      title: "Học kỳ",
      ...headerProperties,
    },
    {
      field: "statusId",
      title: "Trạng thái",
      ...headerProperties,
    },
  ];

  const [data, setData] = useState([]);
  const [classesOfUser, setClassesOfUser] = useState([]);
  const tableRef = useRef(null);

  // Functions.

  function onUpdateClass(classId) {
    alert("Edit Class ", classId);
  }
  const getClasses = () => {
    request(
      // token, history,
      "get",
      "/edu/class/list/teacher",
      (res) => {
        changePageSize(res.data.length, tableRef);
        setData(res.data);
      }
    );
  };

  function getClassesOfUser() {
    request(
      // token, history,
      "get",
      "/edu/class/get-classes-of-user/null",
      (res) => {
        //let lst = [];
        //res.data.map((e) => {
        //  lst.push(e);s
        //});
        console.log("getClassesOfUser, res.data = ", res.data);
        //console.log("getClassesOfUser, lst = ", lst);
        setClassesOfUser(res.data);
      }
    );
  }

  useEffect(() => {
    getClasses();
    getClassesOfUser();
  }, []);

  return (
    <MuiThemeProvider>
      <Card className={classes.card}>
        <CardHeader
          avatar={
            <Avatar style={{ background: "#ff7043" }}>
              <FaListUl size={24} />
            </Avatar>
          }
          title={<Typography variant="h5">Danh sách lớp</Typography>}
        />
        <CardContent>
          <MaterialTable
            title=""
            columns={cols}
            icons={tableIcons}
            tableRef={tableRef}
            localization={localization}
            data={data}
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
            }}
            onRowClick={(event, rowData) => {
              // console.log(rowData);
              history.push({
                //pathname: `/edu/teacher/class/${rowData.id}`,
                pathname: `/edu/teacher/class/detail/${rowData.id}`,
                state: {},
              });
            }}
          />
        </CardContent>

        <CardContent>
          <MaterialTable
            title=""
            columns={columns}
            icons={tableIcons}
            //tableRef={tableRef}
            //localization={localization}
            data={classesOfUser}
            onRowClick={(event, rowData) => {
              // console.log(rowData);
              history.push({
                //pathname: `/edu/teacher/class/${rowData.id}`,
                pathname: `/edu/teacher/class/detail/${rowData.classId}`,
                state: {},
              });
            }}
          />
        </CardContent>
      </Card>
    </MuiThemeProvider>
  );
}

export default TClassList;
// export default withAsynchScreenSecurity(TClassList, "SCR_TCLASSLIST");
