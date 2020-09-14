import React, { useRef, useEffect } from "react";
import {
  Card,
  CardContent,
  Button,
  Typography,
  Box,
  CardHeader,
  Paper,
  Grid,
} from "@material-ui/core";
import MaterialTable from "material-table";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { authGet } from "../../../../api";
import { MuiThemeProvider } from "material-ui/styles";
import { FcViewDetails } from "react-icons/fc";
import { Avatar } from "material-ui";
import { makeStyles } from "@material-ui/core/styles";
import { FaListUl } from "react-icons/fa";

const useStyles = makeStyles((theme) => ({
  card: {
    marginTop: theme.spacing(2),
  },
}));

function ClassList() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const history = useHistory();

  const columns = [
    {
      field: "classId",
      title: "Mã lớp",
      headerStyle: {
        textAlign: "center",
      },
      cellStyle: {
        textAlign: "center",
        fontSize: "1rem",
      },
    },
    {
      field: "courseName",
      title: "Tên môn học",
    },
    {
      field: "semesterId",
      title: "Học kỳ",
    },
  ];

  const data = [
    {
      classId: "387435",
      courseName: "Cấu trúc dữ liệu và thuật toán",
      semesterId: "20192",
    },
    {
      classId: "435839",
      courseName: "Java nâng cao",
      semesterId: "20201",
    },
    {
      classId: "123456",
      courseName: "Thuật toán ứng dụng",
      semesterId: "20202",
    },
  ];

  const tableRef = useRef(null);

  // Functions.
  const onClickRegistrationBtn = (e) => {
    console.log("Click button", e);
  };

  useEffect(() => {
    tableRef.current.dataManager.changePageSize(20);
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
            columns={columns}
            tableRef={tableRef}
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
            data={
              data
              //  (query) =>
              //   new Promise((resolve, reject) => {
              //     console.log(query);

              //     let filterParam = "";
              //     filterParam = "&search=" + query.search;

              //     authGet(
              //       dispatch,
              //       token,
              //       "/supplier" +
              //         "?page=" +
              //         (query.page + 1) +
              //         "&limit=20" +
              //         // query.pageSize +
              //         filterParam
              //     )
              //       .then((res) => {
              //         console.log(res);

              //         let { content, number, size, totalElements } = res;
              //         let data = content.map((item, index) => {
              //           let tmp = Object.assign({}, item, {
              //             stt: number * size + index + 1,
              //           });
              //           return tmp;
              //         });

              //         resolve({
              //           data: data,
              //           page: number,
              //           totalCount: totalElements,
              //         });
              //       })
              //       .catch((e) => {
              //         reject({
              //           message: "Đã có lỗi xảy ra trong quá trình tải dữ liệu. Thử lại ",
              //           errorCause: "query",
              //         });
              //       });
              //   })
            }
            components={{
              Container: (props) => <Paper {...props} elevation={0} />,
            }}
            options={{
              debounceInterval: 500,
              headerStyle: {
                backgroundColor: "#673ab7",
                fontWeight: "bold",
                fontSize: "1rem",
                color: "white",
              },
              sorting: false,
              cellStyle: { fontSize: "1rem" },
              // rowStyle: {
              //   textAlign: "left",
              // },
            }}
            onRowClick={(event, rowData) => {
              console.log(rowData);
              history.push({
                pathname: `/edu/teacher/class/${rowData.classId}`,
                state: {},
              });
            }}
          />
        </CardContent>
      </Card>
    </MuiThemeProvider>
  );
}

export default ClassList;
