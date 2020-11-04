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
import { FcApproval } from "react-icons/fc";
import { errorNoti, successNoti } from "../../../utils/Notification";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import RegistrationDetail from "./RegistrationDetail";
import { localization, tableIcons } from "../../../utils/MaterialTableUtils";

const useStyles = makeStyles((theme) => ({
  card: {
    marginTop: theme.spacing(2),
  },
}));

function NewApprove() {
  const classes = useStyles();
  const history = useHistory();
  const token = useSelector((state) => state.auth.token);

  const [rolesArr, setRolesArr] = useState([]); // for rendering select-box.
  const [rolesMap, setRolesMap] = useState({}); // for displaying roles.
  const [grantedRoles, setGrantedRoles] = useState({});
  const [currRowChanged, setCurrRowChanged] = useState();

  // Table.
  const tableRef = useRef(null);
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

  // Functions.
  const getData = () => {
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

        // Convert registered roles from string to array.
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
        setRolesArr(res.data.roles);
        setRolesMap(roles);
      },
      {
        rest: (error) => {
          console.log(error);
        },
      }
    );
  };

  const handleApprove = (currRowChanged, userLoginId, assignedRoles) => {
    request(
      token,
      history,
      "post",
      `/user/approve-registration`,
      (res) => {
        let change = {};

        change[userLoginId] = assignedRoles
          .map((id) => rolesMap[id])
          .join(", ");

        setCurrRowChanged(currRowChanged);
        setGrantedRoles({ ...grantedRoles, ...change });
      },
      {
        400: (e) => {
          if ("approved" == e.response.data.error) {
            errorNoti("Tài khoản đã được phê duyệt trước đó.");
          } else {
            errorNoti("Rất tiếc! Đã có lỗi xảy ra. Vui lòng thử lại.");
          }
        },
        404: (e) => {
          if ("not existed" == e.response.data.error) {
            errorNoti("Đăng ký không tồn tại hoặc đã bị xoá.");
          } else {
            errorNoti("Rất tiếc! Đã có lỗi xảy ra. Vui lòng thử lại.");
          }
        },
        rest: (error) => {
          errorNoti("Rất tiếc! Đã có lỗi xảy ra. Vui lòng thử lại.");
        },
      },
      { userLoginId: userLoginId, roles: assignedRoles }
    );
  };

  const toggle = (id) => {
    if (tableRef.current && registrations.length) {
      const { detailPanel } = tableRef.current.props;

      if (id > -1) {
        let row = registrations.find((regist) => regist.tableData.id == id);

        row.tableData = {
          ...row.tableData,
          showDetailPanel:
            typeof detailPanel === "function"
              ? detailPanel
              : detailPanel[0].render,
        };
      } else {
        registrations.forEach((row) => {
          row.tableData = {
            ...row.tableData,
            showDetailPanel:
              typeof detailPanel === "function"
                ? detailPanel
                : detailPanel[0].render,
          };
        });
      }
    }
  };

  useEffect(() => {
    toggle(currRowChanged);
  }, [grantedRoles]);

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
            localization={localization}
            icons={tableIcons}
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
            detailPanel={(rowData) => (
              <RegistrationDetail
                data={rowData}
                roles={rolesArr}
                grantedRoles={grantedRoles}
                handleApprove={handleApprove}
              />
            )}
            onRowClick={(event, rowData, togglePanel) => togglePanel()}
          />
        </CardContent>
      </Card>
    </MuiThemeProvider>
  );
}

export default NewApprove;
