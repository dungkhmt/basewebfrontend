import React, { useRef, useEffect, useState, forwardRef } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { axiosGet, axiosPost } from "../../../../api";
import { MuiThemeProvider } from "material-ui/styles";
import { makeStyles } from "@material-ui/core/styles";
import { FcFilledFilter } from "react-icons/fc";

const useStyles = makeStyles((theme) => ({
  card: {
    marginTop: theme.spacing(2),
  },
  registrationBtn: {
    borderRadius: "6px",
  },
}));

function ClassRegistration() {
  const classes = useStyles();
  const token = useSelector((state) => state.auth.token);

  const [semester, setSemester] = useState("");
  const [registeredClasses, setRegisteredClasses] = useState(new Set());

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

  // Functions.
  const getData = (query) =>
    new Promise((resolve, reject) => {
      // console.log("Query", query);

      // let filterParam = "";
      // filterParam = "&search=" + query.search;

      axiosGet(token, `/edu/class?page=${query.page}&size=${query.pageSize}`)
        .then((res) => {
          let { content, number, totalElements } = res.data.page;

          setSemester(res.data.semesterId);
          setRegisteredClasses(new Set(res.data.registeredClasses));

          resolve({
            data: content,
            page: number,
            totalCount: totalElements,
          });
        })
        .catch((e) => {
          reject({
            message: "Đã có lỗi xảy ra trong quá trình tải dữ liệu. Thử lại ",
            errorCause: "query",
          });
        });
    });

  const onClickRegistBtn = (rowData) => {
    let tmp = new Set(registeredClasses);
    tmp.add(rowData.id);
    setRegisteredClasses(tmp);

    // Xu ly dang ky
    axiosPost(token, "/edu/class/register", { classId: rowData.id })
      .then((res) => alert("Đăng ký thành công"))
      .catch((e) => {
        let res = e.response;

        if (400 == res.status) {
          alert(res.body);
        } else {
          alert("error");
        }
      });
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
              // filtering: true,
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
