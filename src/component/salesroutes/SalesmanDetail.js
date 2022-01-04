import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { MuiThemeProvider } from "@material-ui/core/styles";
import MaterialTable from "material-table";
import { tableIcons } from "../../utils/iconutil";
import { CardContent, Card } from "@material-ui/core";

function SalesmanDetail() {
  const history = useHistory();
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();

  // Table
  const [data, setData] = useState([
    {
      retailOutletCode: "RO00001",
      retailOutletName: "VM+ DCV",
      distributorCode: "D001",
      distributorName: "HBT",
      visitFrequency: "1 tuần thăm 1 lần",
      visitConfig: "Thứ 4",
    },
  ]);
  const columns = [
    {
      field: "retailOutletCode",
      title: "Mã ĐLBL",
    },
    {
      field: "retailOutletName",
      title: "Tên ĐLBL",
    },
    {
      field: "distributorCode",
      title: "Mã NPP",
    },
    {
      field: "distributorName",
      title: "Tên NPP",
    },
    {
      field: "visitFrequency",
      title: "Tần suất thăm",
    },
    {
      field: "visitConfig",
      title: "Cấu hình thăm",
    },
  ];

  const getSalesmanDetail = () => {};

  useEffect(() => {
    getSalesmanDetail();
  }, []);

  return (
    <div>
      <MuiThemeProvider>
        <Card>
          <CardContent>
            <MaterialTable
              title="Chi tiết nhân viên bán hàng"
              columns={columns}
              data={data}
              icons={tableIcons}
              options={{
                search: false,
                actionsColumnIndex: -1,
              }}
              localization={{
                header: {
                  actions: "",
                },
                body: {
                  emptyDataSourceMessage: "Không có bản ghi nào để hiển thị",
                },
              }}
              actions={[
                (rowData) => ({
                  icon: "edit",
                  tooltip: "Thiết lập",
                  isFreeAction: true,
                  onClick: (rowData) => history.push("/salesroutes/plan"),
                }),
              ]}
            />
          </CardContent>
        </Card>
      </MuiThemeProvider>
    </div>
  );
}

export default SalesmanDetail;
