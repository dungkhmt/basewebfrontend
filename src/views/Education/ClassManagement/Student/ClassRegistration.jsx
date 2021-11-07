import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  Paper,
  Typography,
} from "@material-ui/core";
import { makeStyles, MuiThemeProvider } from "@material-ui/core/styles";
import MaterialTable from "material-table";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import { request } from "../../../../api";
import PositiveButton from "../../../../component/education/classmanagement/PositiveButton";
import changePageSize, {
  localization,
  tableIcons,
} from "../../../../utils/MaterialTableUtils";
import { errorNoti, successNoti } from "../../../../utils/notification";

const useStyles = makeStyles((theme) => ({
  card: {
    marginTop: theme.spacing(2),
    borderRadius: "6px",
  },
  registrationBtn: {},
}));

function ClassRegistration() {
  const classes = useStyles();
  const token = useSelector((state) => state.auth.token);
  const history = useHistory();

  const [semester, setSemester] = useState("");
  const [registeredClasses, setRegisteredClasses] = useState(new Set());

  // Table.
  const tableRef = useRef(null);
  const [filterParams, setFilterParams] = useState({
    code: "",
    courseId: "",
    courseName: "",
    classType: "",
    departmentId: "",
  });

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
      title: "Mã học phần",
      ...headerProperties,
    },
    {
      field: "courseName",
      title: "Tên học phần",
    },
    {
      field: "classType",
      title: "Loại lớp",
      ...headerProperties,
    },
    {
      field: "departmentId",
      title: "Khoa/Viện",
      ...headerProperties,
    },
    {
      field: "",
      title: "",
      cellStyle: { textAlign: "center" },
      render: (rowData) =>
        registeredClasses.has(rowData.id) ? null : (
          <PositiveButton
            label="Tham gia"
            disableRipple
            className={classes.registrationBtn}
            onClick={() => onRegist(rowData)}
          />
        ),
    },
  ];

  // Functions.
  const getData = (query) =>
    new Promise((resolve, reject) => {
      // console.log("Query", query);

      const filters = query.filters; // array.
      const data = {};

      if (filters.length > 0) {
        filters.map((filter) => {
          data[filter.column.field] = filter.value;
        });
      }

      request(
        // token,
        // history,
        "POST",
        `/edu/class?page=${query.page}&size=${query.pageSize}`,
        (res) => {
          let { content, number, totalElements } = res.data.page;

          setFilterParams({
            code: "",
            classCode: "",
            courseId: "",
            courseName: "",
            classType: "",
            departmentId: "",
            ...data,
          });
          setSemester(res.data.semesterId);
          setRegisteredClasses(new Set(res.data.registeredClasses));

          changePageSize(content.length, tableRef);
          resolve({
            data: content,
            page: number,
            totalCount: totalElements,
          });
        },
        {
          onError: (e) => {
            console.log(e);
            changePageSize(5, tableRef);
            reject({
              message: "Đã có lỗi xảy ra trong quá trình tải dữ liệu. Thử lại ",
              errorCause: "query",
            });
          },
        },
        data
      );
    });

  const onRegist = (rowData) => {
    let tmp = new Set(registeredClasses);
    tmp.add(rowData.id);
    setRegisteredClasses(tmp);

    request(
      // token,
      // history,
      "POST",
      "/edu/class/register",
      () => {
        successNoti(
          "Đăng ký thành công. Vui lòng chờ giảng viên phê duyệt.",
          3000
        );
      },
      {
        400: (e) => {
          errorNoti(e.response.body);
        },
      },
      { classId: rowData.id }
    );
  };

  useEffect(() => {
    let cols = tableRef.current.dataManager.columns;

    cols[0].tableData.filterValue = filterParams.code;
    cols[1].tableData.filterValue = filterParams.courseId;
    cols[2].tableData.filterValue = filterParams.courseName;
    cols[3].tableData.filterValue = filterParams.classType;
    cols[4].tableData.filterValue = filterParams.departmentId;

    console.log("filter params", filterParams);
  }, [registeredClasses]);

  return (
    <MuiThemeProvider>
      <Card className={classes.card}>
        <CardHeader
          avatar={<Avatar style={{ background: "#ff5722" }}>R</Avatar>}
          title={
            <Typography variant="h5">
              Đăng ký lớp học - Học kỳ {semester}
            </Typography>
          }
        />
        <CardContent>
          <MaterialTable
            title=""
            columns={columns}
            tableRef={tableRef}
            data={getData}
            icons={tableIcons}
            localization={localization}
            components={{
              Container: (props) => <Paper {...props} elevation={0} />,
            }}
            options={{
              filtering: true,
              search: false,
              pageSize: 20,
              debounceInterval: 500,
              headerStyle: {
                backgroundColor: "#673ab7",
                fontWeight: "bold",
                fontSize: "1rem",
                color: "white",
              },
              sorting: false,
              filterCellStyle: { textAlign: "center" },
              cellStyle: { fontSize: "1rem" },
            }}
          />
        </CardContent>
      </Card>
    </MuiThemeProvider>
  );
}

export default ClassRegistration;
