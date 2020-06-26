import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { authPost } from "../../../api";

import MaterialTable, { MTableToolbar } from "material-table";
import { tableIcons } from "../../../utils/iconutil";
import { MuiThemeProvider } from "material-ui/styles";
import { Card, CardContent, Box, Button } from "@material-ui/core";
import { useHistory } from "react-router";

function SalesRouteConfig() {
  const history = useHistory();
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();

  // Table
  const [data, setData] = useState([{}]);
  const columns = [
    // {
    //     field: "salesRouteConfigId",
    //     title: "Mã cấu hình",
    // },
    {
      field: "description",
      title: "Mô tả",
    },
    {
      field: "days",
      title: "Ngày",
    },
    {
      field: "repeatWeek",
      title: "Lặp tuần",
    },
  ];

  // Functions
  const getListSalesRouteConfig = () => {
    authPost(dispatch, token, "/get-list-sales-route-config", {
      statusId: null,
    })
      .then((res) => res.json())
      .then((res) => {
        setData(res);
      });
  };

  useEffect(() => {
    getListSalesRouteConfig();
  }, []);

  return (
    <div>
      <MuiThemeProvider>
        <Card>
          <CardContent>
            <MaterialTable
              title="Cấu hình viếng thăm"
              columns={columns}
              data={data}
              icons={tableIcons}
              localization={{
                header: {
                  actions: "",
                },
                body: {
                  emptyDataSourceMessage: "Không có bản ghi nào để hiển thị",
                },
              }}
              options={{
                search: false,
                actionsColumnIndex: -1,
              }}
              components={{
                Toolbar: (props) => (
                  <div>
                    <MTableToolbar {...props} />
                    <Box display="flex" justifyContent="flex-end" width="98%">
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() =>
                          history.push("/salesroutes/configs/create-new")
                        }
                      >
                        Thêm mới
                      </Button>
                      {/* <IconButton
                                                    children={  <IconContext.Provider>
                                                                    <RiMenuAddLine style={{fontSize: 24}}/>
                                                                </IconContext.Provider>}
                                                    size='medium'
                                                    tooltip='Thêm mới'
                                                    onClick={() => setCreationDialogOpen(true)}
                                                /> */}
                    </Box>
                  </div>
                ),
              }}
            />
          </CardContent>
        </Card>
      </MuiThemeProvider>
    </div>
  );
}

export default SalesRouteConfig;
