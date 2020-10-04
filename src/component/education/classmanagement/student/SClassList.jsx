import React, { useRef, useEffect, useState, forwardRef } from "react";
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
import { authGet, axiosGet } from "../../../../api";
import { MuiThemeProvider } from "material-ui/styles";
import { FcViewDetails, FcApproval, FcFilledFilter } from "react-icons/fc";
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
  const token = useSelector((state) => state.auth.token);
  const history = useHistory();

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
      field: "name",
      title: "Tên học phần",
    },
    {
      field: "classType",
      title: "Loại lớp",
      ...headerProperties,
    },
    {
      field: "semester",
      title: "Học kỳ",
      ...headerProperties,
    },
    {
      field: "status",
      title: "Trạng thái",
      filtering: false,
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

  const [data, setData] = useState([]);

  const tableRef = useRef(null);

  // Functions.
  const getClasses = () => {
    axiosGet(token, "/edu/class/list/student")
      .then((res) => setData(res.data))
      .catch((e) => alert(e.response.body));
  };

  useEffect(() => {
    getClasses();
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
            icons={{
              Filter: forwardRef((props, ref) => (
                <FcFilledFilter {...props} ref={ref} />
              )),
            }}
            localization={{
              body: {
                emptyDataSourceMessage: "Không có bản ghi nào để hiển thị",
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
              filtering: true,
              search: false,
              pageSize: 20,
              debounceInterval: 300,
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
