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
  Chip,
} from "@material-ui/core";
import MaterialTable from "material-table";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { authGet } from "../../../../api";
import { MuiThemeProvider } from "material-ui/styles";
import { FcViewDetails, FcApproval } from "react-icons/fc";
import { Avatar } from "material-ui";
import { makeStyles } from "@material-ui/core/styles";
import { FaListUl } from "react-icons/fa";
import { GiSandsOfTime } from "react-icons/gi";

const useStyles = makeStyles((theme) => ({
  card: {
    marginTop: theme.spacing(2),
  },
  approved: {
    color: "green",
    borderColor: "green",
    fontSize: "1rem",
    width: 160,
  },
  pendingApproval: {
    fontSize: "1rem",
  },
}));

function SClassList() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const history = useHistory();

  const columns = [
    {
      field: "id",
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
    {
      field: "status",
      title: "Trạng thái",
      headerStyle: {
        textAlign: "center",
      },

      render: (rowData) => (
        <Box display="flex" justifyContent="center">
          {rowData.status === "APPROVED" ? (
            <Chip
              icon={<FcApproval size={24} />}
              label="Đã phê duyệt"
              variant="outlined"
              className={classes.approved}
            />
          ) : (
            <Chip
              icon={<GiSandsOfTime size={24} />}
              label="Chờ phê duyệt"
              color="primary"
              variant="outlined"
              className={classes.pendingApproval}
            />
          )}
        </Box>
      ),
    },
  ];

  const data = [
    {
      id: "387435",
      courseName: "Cấu trúc dữ liệu và thuật toán",
      semesterId: "20192",
      status: "APPROVED",
    },
    {
      id: "435839",
      courseName: "Java nâng cao",
      semesterId: "20201",
      status: "PENDING_APPROVAL",
    },
    {
      id: "123456",
      courseName: "Thuật toán ứng dụng",
      semesterId: "20202",
      status: "PENDING_APPROVAL",
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
            data={data}
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
            }}
            onRowClick={(event, rowData) => {
              console.log(rowData);

              if (rowData.status === "APPROVED") {
                history.push(`/edu/student/class/${rowData.id}`);
              } else {
                alert("Bạn cần được phê duyệt để xem thông tin lớp này");
              }
            }}
          />
        </CardContent>
      </Card>
    </MuiThemeProvider>
  );
}

export default SClassList;
