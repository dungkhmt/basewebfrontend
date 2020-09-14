import React, { useRef, useEffect } from "react";
import {
  Card,
  CardContent,
  Button,
  Typography,
  Box,
  CardHeader,
  Paper,
} from "@material-ui/core";
import MaterialTable from "material-table";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { authGet } from "../../../../api";
import { MuiThemeProvider } from "material-ui/styles";

function ClassRegistration() {
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
      field: "",
      title: "",
      cellStyle: { alignItems: "center" },
      render: (rowData) => (
        <Box display="flex" justifyContent="center">
          <Button
            variant="contained"
            color="primary"
            onClick={() => onClickRegistrationBtn(rowData)}
          >
            Tham gia
          </Button>
        </Box>
      ),
    },
  ];

  const data = [
    {
      classId: "387435",
      courseName: "Cấu trúc dữ liệu và thuật toán",
    },
    {
      classId: "435839",
      courseName: "Java nâng cao",
    },
    {
      classId: "123456",
      courseName: "Thuật toán ứng dụng",
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
      <Card>
        <CardHeader
          title={<Typography variant="h4">Đăng ký lớp học</Typography>}
          subheader={<Typography variant="h6">Học kỳ: 20201</Typography>}
        />
        <CardContent>
          <br />
          <br />
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
                backgroundColor: "#a5c3f2",
                fontWeight: "bold",
                fontSize: "1rem",
              },
              sorting: false,
              cellStyle: { fontSize: "1rem" },
              // rowStyle: {
              //   textAlign: "left",
              // },
            }}
          />
        </CardContent>
      </Card>
    </MuiThemeProvider>
  );
}

export default ClassRegistration;
