import {
  Box,
  Card,
  CardContent,
  IconButton,
  Typography,
} from "@material-ui/core";
import { MuiThemeProvider } from "@material-ui/core/styles";
import MaterialTable, { MTableToolbar } from "material-table";
import React, { useEffect, useState } from "react";
import { FcRadarPlot, FcViewDetails } from "react-icons/fc";
import { IconContext } from "react-icons/lib/cjs";
import { RiMenuAddLine } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { authGet, authPost, axiosPost } from "../../../api";
import { tableIcons } from "../../../utils/iconutil";
import SelectSalesmanDialog from "./SelectSalesmanDialog";

function PlanPeriod(props) {
  const history = useHistory();
  const id = props.location.state.salesRoutePlanningPeriodId;
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();

  // Select Salesman Modal.
  const [salesmans, setSalesmans] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Table.
  const [data, setData] = useState([]);
  const columns = [
    {
      field: "retailOutletCode",
      title: "Mã ĐLBL",
      filtering: false,
    },
    {
      field: "retailOutletName",
      title: "Tên ĐLBL",
      filtering: false,
    },
    {
      field: "salesmanName",
      title: "NVBH",
    },
    {
      field: "distributorName",
      title: "Tên NPP",
      filtering: false,
    },
    {
      field: "visitFrequency",
      title: "Tần suất thăm",
      filtering: false,
    },
    {
      field: "visitConfig",
      title: "Cấu hình thăm",
      filtering: false,
    },
    {
      field: "repeatWeek",
      title: "Tuần lặp",
      filtering: false,
    },
    {
      field: "startExecuteWeek",
      title: "Tuần bắt đầu",
      filtering: false,
    },
  ];

  const getSalesroutesConfigRetailOutlets = () => {
    authGet(
      dispatch,
      token,
      "/get-sales-route-config-retail-outlets/" + id
    ).then((res) => {
      // Filter salesman
      // Solution 1: use map
      const output = [];
      const map = new Map();

      for (const item of res) {
        if (!map.has(item.salesmanName)) {
          map.set(item.salesmanName, true); // set any value to Map,
          output.push({
            salesmanName: item.salesmanName,
            partySalesmanId: item.partySalesmanId,
          });
        }
      }

      setSalesmans(output);

      // Solution 2: use filter method
      // setSalesmans( res.filter((saleman, index, self) => (
      //     index === self.findIndex(s => (s.salesmanName === saleman.salesmanName)
      // ))))

      // Solution 3: use third-party library: ramda,...

      setData(res);
    });
  };

  const onClickDetailButton = () => {
    history.push({
      pathname: "/salesroutes/plan/period/detail",
      state: {
        salesRoutePlanningPeriodId: id,
        fromDate: props.location.state.fromDate,
        toDate: props.location.state.toDate,
      },
    });
  };

  const onClickGSRDButton = () => {
    setDialogOpen(true);
  };

  const onClickCreatButton = () => {
    history.push({
      pathname: "/salesroutes/plan/period/add/visit-confirguration",
      state: {
        salesRoutePlanningPeriodId: id,
        fromDate: props.location.state.fromDate,
        toDate: props.location.state.toDate,
      },
    });
  };

  const onClickEditButton = (rowData) => {
    console.log("onClickEditButton, rowData ", rowData);

    axiosPost(token, "/get-list-sales-route-config", {
      statusId: null,
    })
      .then((res) => {
        console.log("onClickEditButton, configs ", res.data);

        history.push({
          pathname: "/salesroutes/plan/period/edit/visit-confirguration",
          state: {
            salesRouteConfigRetailOutletId:
              rowData.salesRouteConfigRetailOutletId,
            fromDate: props.location.state.fromDate,
            toDate: props.location.state.toDate,
            retailOutletName: rowData.retailOutletName,
            salesmanName: rowData.salesmanName,
            distributorName: rowData.distributorName,
            visitFrequencyId: rowData.visitFrequencyId,
            configs: res.data,
            salesRouteConfigId:
              rowData.visitConfig === "Chưa thiết lập"
                ? ""
                : res.data.find(
                    (c) =>
                      c.visitFrequencyId === rowData.visitFrequencyId &&
                      c.days === rowData.visitConfig
                  ).salesRouteConfigId,
            startExecuteWeek:
              rowData.startExecuteWeek === "Chưa thiết lập"
                ? ""
                : parseInt(rowData.startExecuteWeek),
          },
        });
      })
      .catch((error) => console.log("onClickEditButton, error ", error));
  };

  const handleDialogClose = (partySalesmanId) => {
    setDialogOpen(false);

    if (partySalesmanId !== undefined) {
      authPost(dispatch, token, "/generate-sales-route-detail", {
        partySalesmanId: partySalesmanId,
        salesRoutePlanningPeriodId: id,
      })
        .then((res) => res.json())
        .then(() => {
          onClickDetailButton();
        });
    }
  };

  useEffect(() => {
    getSalesroutesConfigRetailOutlets();
  }, []);

  return (
    <div>
      <MuiThemeProvider>
        <Card>
          <CardContent>
            <Typography variant="h6" style={{ marginLeft: 10 }}>
              Thiết lập cấu hình viếng thăm cho đại lý bán lẻ
            </Typography>
            <Typography variant="subtitle1" style={{ marginLeft: 24 }}>
              Giai đoạn làm tuyến: SalesRoute
              {" " + props.location.state.fromDate} đến
              {" " + props.location.state.toDate}
            </Typography>
            <br />
            <MaterialTable
              title="Danh sách cấu hình viếng thăm"
              columns={columns}
              data={data}
              icons={tableIcons}
              localization={{
                header: {
                  actions: "",
                },
                body: {
                  emptyDataSourceMessage: "Không có bản ghi nào để hiển thị",
                  filterRow: {
                    filterTooltip: "Lọc",
                  },
                },
              }}
              actions={[
                {
                  icon: "edit",
                  tooltip: "Sửa",
                  onClick: (event, rowData) => onClickEditButton(rowData),
                },
              ]}
              options={{
                search: false,
                filtering: true,
                actionsColumnIndex: -1,
              }}
              components={{
                Toolbar: (props) => (
                  <div>
                    <MTableToolbar {...props} />
                    <Box display="flex" justifyContent="flex-end" width="98%">
                      <IconButton
                        children={
                          <IconContext.Provider>
                            <FcViewDetails style={{ fontSize: 24 }} />
                          </IconContext.Provider>
                        }
                        size="medium"
                        tooltip="Xem chi tiết tuyến"
                        style={{ marginLeft: 25 }}
                        onClick={onClickDetailButton}
                      />
                      <IconButton
                        children={
                          <IconContext.Provider>
                            <FcRadarPlot style={{ fontSize: 24 }} />
                          </IconContext.Provider>
                        }
                        size="medium"
                        tooltip="Sinh chi tiết tuyến"
                        onClick={onClickGSRDButton}
                      />
                      <IconButton
                        children={
                          <IconContext.Provider>
                            <RiMenuAddLine style={{ fontSize: 24 }} />
                          </IconContext.Provider>
                        }
                        size="medium"
                        tooltip="Thêm mới"
                        onClick={onClickCreatButton}
                      />
                    </Box>
                  </div>
                ),
              }}
            />
            <SelectSalesmanDialog
              items={salesmans}
              open={dialogOpen}
              onClose={handleDialogClose}
            />
          </CardContent>
        </Card>
      </MuiThemeProvider>
    </div>
  );
}

export default PlanPeriod;
