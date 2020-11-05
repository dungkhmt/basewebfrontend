import React, { useRef, useState, forwardRef, useEffect } from "react";
import {
  Card,
  CardContent,
  Button,
  Typography,
  Box,
  CardHeader,
  Paper,
  Avatar,
} from "@material-ui/core";
import MaterialTable from "material-table";
import { request } from "../../../../api";
import { MuiThemeProvider } from "material-ui/styles";
import { makeStyles } from "@material-ui/core/styles";
import { FcFilledFilter } from "react-icons/fc";
import { errorNoti, successNoti } from "../../../../utils/Notification";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";

const useStyles = makeStyles((theme) => ({
  card: {
    marginTop: theme.spacing(2),
    borderRadius: "6px",
  },
  registrationBtn: {
    borderRadius: "6px",
    backgroundColor: "#1877f2",
    textTransform: "none",
    fontSize: "1rem",
    "&:hover": {
      backgroundColor: "#1834d2",
    },
  },
}));

function ClassRegistration() {
  const classes = useStyles();
  const token = useSelector((state) => state.auth.token);
  const history = useHistory();

  const [semester, setSemester] = useState("");
  const [registeredClasses, setRegisteredClasses] = useState(new Set());
  const [filterParams, setFilterParams] = useState({
    code: "",
    courseId: "",
    courseName: "",
    classType: "",
    departmentId: "",
  });

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
      field: "code",
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
      cellStyle: { alignItems: "center" },
      render: (rowData) =>
        registeredClasses.has(rowData.id) ? null : (
          <Box display="flex" justifyContent="center">
            <Button
              variant="contained"
              color="primary"
              disableRipple
              className={classes.registrationBtn}
              onClick={() => onClickRegistBtn(rowData)}
            >
              Tham gia
            </Button>
          </Box>
        ),
    },
  ];

  const tableRef = useRef(null);

  useEffect(() => {
    let cols = tableRef.current.dataManager.columns;

    cols[0].tableData.filterValue = filterParams.code;
    cols[1].tableData.filterValue = filterParams.courseId;
    cols[2].tableData.filterValue = filterParams.courseName;
    cols[3].tableData.filterValue = filterParams.classType;
    cols[4].tableData.filterValue = filterParams.departmentId;

    console.log("filter params", filterParams);
  }, [registeredClasses]);

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
        token,
        history,
        "POST",
        `/edu/class?page=${query.page}&size=${query.pageSize}`,
        (res) => {
          let { content, number, totalElements } = res.data.page;

          setFilterParams({
            code: "",
            courseId: "",
            courseName: "",
            classType: "",
            departmentId: "",
            ...data,
          });
          setSemester(res.data.semesterId);
          setRegisteredClasses(new Set(res.data.registeredClasses));

          resolve({
            data: content,
            page: number,
            totalCount: totalElements,
          });
        },
        {
          noResponse: (error) => {},
          rest: (error) => {
            console.log(error);
            reject({
              message: "Đã có lỗi xảy ra trong quá trình tải dữ liệu. Thử lại ",
              errorCause: "query",
            });
          },
        },
        data
      );
    });

  const onClickRegistBtn = (rowData) => {
    let tmp = new Set(registeredClasses);
    tmp.add(rowData.id);
    setRegisteredClasses(tmp);

    request(
      token,
      history,
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
    // axiosPost(token, "/edu/class/register", { classId: rowData.id })
    //   .then((res) => {
    //     successNoti(
    //       "Đăng ký thành công. Vui lòng chờ giảng viên phê duyệt.",
    //       2000
    //     );
    //   })
    //   .catch((e) => {
    //     let res = e.response;

    //     if (400 == res.status) {
    //       errorNoti(res.body);
    //     } else {
    //       errorNoti("Rất tiếc! Đã có lỗi xảy ra.");
    //     }
    //   });
  };

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
            icons={{
              Filter: forwardRef((props, ref) => (
                <FcFilledFilter {...props} ref={ref} />
              )),
            }}
            localization={{
              body: {
                emptyDataSourceMessage: "",
              },
              toolbar: {
                searchPlaceholder: "Tìm kiếm",
                searchTooltip: "Tìm kiếm",
              },
              pagination: {
                hover: "pointer",
                labelRowsSelect: "hàng",
                labelDisplayedRows: "{from}-{to} của {count}",
                nextTooltip: "Trang tiếp",
                lastTooltip: "Trang cuối",
                firstTooltip: "Trang đầu",
                previousTooltip: "Trang trước",
              },
            }}
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
              cellStyle: { fontSize: "1rem" },
            }}
          />
        </CardContent>
      </Card>
    </MuiThemeProvider>
  );
}

export default ClassRegistration;
