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
  Link,
  Grid,
  TextField,
  MenuItem,
} from "@material-ui/core";
import MaterialTable from "material-table";
import { request } from "../../../api";
import { MuiThemeProvider } from "material-ui/styles";
import { makeStyles } from "@material-ui/core/styles";
import { FcApproval, FcFilledFilter } from "react-icons/fc";
import { errorNoti, successNoti } from "../../../utils/Notification";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import RegistrationDetail from "./RegistrationDetail";

const useStyles = makeStyles((theme) => ({
  card: {
    marginTop: theme.spacing(2),
  },
}));

function NewApprove() {
  const classes = useStyles();
  const history = useHistory();
  const token = useSelector((state) => state.auth.token);

  const [roles, setRoles] = useState([]);

  // Table.
  const [registrations, setRegistrations] = useState([]);
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
      field: "id",
      title: "Tên đăng nhập",
      ...headerProperties,
    },
    {
      field: "fullName",
      title: "Tên đầy đủ",
      ...headerProperties,
    },
    {
      field: "email",
      title: "Email",
      render: (rowData) => (
        <Link
          href={`mailto:${rowData.email}`}
          onClick={(e) => e.stopPropagation()}
        >
          {rowData.email}
        </Link>
      ),
    },
  ];

  const tableRef = useRef(null);

  // Functions.
  const getData = () =>
    request(
      token,
      history,
      "get",
      `/user/registration-list`,
      (res) => {
        let registrations;
        let roles = {};

        res.data.roles.forEach((role) => {
          roles[role.id] = role.name;
        });

        // Convert registered roles to array.
        registrations = res.data.regists.map((regist) => {
          return {
            ...regist,
            roleIds: regist.roles.split(","),
            roleNames: regist.roles
              .split(",")
              .map((id) => roles[id])
              .join(", "),
          };
        });

        setRegistrations(registrations);
        setRoles(res.data.roles);
      },
      {
        noResponse: (error) => {},
        rest: (error) => {
          console.log(error);
        },
      }
    );

  useEffect(() => {
    getData();
  }, []);

  return (
    <MuiThemeProvider>
      <Card className={classes.card}>
        <CardHeader
          avatar={
            <Avatar style={{ background: "white" }}>
              <FcApproval size={40} />
            </Avatar>
          }
          title={
            <Typography variant="h5">
              Phê duyệt đăng ký tài khoản hệ thống
            </Typography>
          }
        />
        <CardContent>
          <MaterialTable
            title=""
            columns={columns}
            tableRef={tableRef}
            data={registrations}
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
              detailPanelType: "single",
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
            detailPanel={(rowData) => (
              <RegistrationDetail data={rowData} roles={roles} />
            )}
            onRowClick={(event, rowData, togglePanel) => togglePanel()}
          />
        </CardContent>
      </Card>
    </MuiThemeProvider>
  );
}

export default NewApprove;
