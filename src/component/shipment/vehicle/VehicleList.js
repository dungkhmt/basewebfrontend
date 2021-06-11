import { useDispatch, useSelector } from "react-redux";
import MaterialTable, { MTableToolbar } from "material-table";
import { authGet } from "../../../api";
import { tableIcons } from "../../../utils/iconutil";
import React from "react";
import Upload from "../../../utils/Upload";
import Grid from "@material-ui/core/Grid";

export default function VehicleList() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const columns = [
    { title: "Mã xe", field: "vehicleId" },
    { title: "Tải trọng", field: "capacity" },
    { title: "Số pallet", field: "pallet" },
    { title: "Mô tả", field: "description" },
  ];

  return (
    <div>
      <MaterialTable
        title="Danh sách xe vận chuyển"
        columns={columns}
        options={{
          search: false,
        }}
        components={{
          Toolbar: (props) => (
            <div>
              <MTableToolbar {...props} />
              <Grid container spacing={3}>
                <Grid
                  item
                  xs={8}
                  style={{ textAlign: "left", padding: "0px 30px 20px 30px" }}
                ></Grid>
                <Grid
                  item
                  xs={4}
                  style={{
                    verticalAlign: "text-bottom",
                    textAlign: "right",
                    padding: "0px 50px 10px 30px",
                  }}
                >
                  <Upload
                    url={"upload-vehicle"}
                    token={token}
                    dispatch={dispatch}
                    buttonTitle={"Tải lên danh sách xe"}
                    handleSaveCallback={() => window.location.reload()}
                  />
                </Grid>
              </Grid>
            </div>
          ),
        }}
        data={(query) =>
          new Promise((resolve) => {
            console.log(query);
            let sortParam = "";
            if (query.orderBy !== undefined) {
              sortParam =
                "&sort=" + query.orderBy.field + "," + query.orderDirection;
            }
            authGet(
              dispatch,
              token,
              "/vehicle/page" +
                "?size=" +
                query.pageSize +
                "&page=" +
                query.page +
                sortParam
            ).then(
              (response) => {
                resolve({
                  data: response.content,
                  page: response.number,
                  totalCount: response.totalElements,
                });
              },
              (error) => {
                console.log("error");
              }
            );
          })
        }
        icons={tableIcons}
      />
    </div>
  );
}
