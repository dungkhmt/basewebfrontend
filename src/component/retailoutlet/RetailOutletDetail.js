import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { authGet, authPost } from "../../api";
import { MenuItem, TextField } from "@material-ui/core";
import Toolbar from "@material-ui/core/Toolbar";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";

import MaterialTable from "material-table";
import { tableIcons } from "../../utils/iconutil";

function RetailOutletDetail(props) {
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  const { partyId } = useParams();
  const [RetailOutletDetail, setRetailOutletDetail] = useState({});
  const [salesmanList, setSalesmanList] = useState([]);
  const [DistributorList, setDistributorList] = useState([]);
  const [selectedDistributor, setSelectedDistributor] = useState({
    distributorName: "",
  });
  const [selectedSalesman, setSelectedSalesman] = useState({ userLoginId: "" });

  const requestGetOption = {
    method: "GET",
    headers: { "Content-Type": "application/json", "X-Auth-Token": token },
  };

  const columns = [
    {
      field: "distributorName",
      title: "Nhà phân phối",

      editComponent: () => (
        <TextField
          id="distributorName"
          select
          value={selectedDistributor.distributorName}
          label="Nhà phân phối"
          onChange={(e) =>
            setSelectedDistributor({ distributorName: e.target.value })
          }
          style={{
            minWidth: "12rem",
          }}
        >
          {DistributorList.map((distributor) => (
            <MenuItem
              key={distributor.partyId}
              value={distributor.distributorName}
            >
              {distributor.distributorName}
            </MenuItem>
          ))}
        </TextField>
      ),
    },
    {
      field: "salesmanName",
      title: "Nhân viên bán hàng",
      editComponent: () => (
        <TextField
          id="salesmanName"
          select
          value={selectedSalesman.userLoginId}
          label="Nhân viên bán hàng"
          onChange={(e) => setSelectedSalesman({ userLoginId: e.target.value })}
          style={{
            minWidth: "12rem",
          }}
        >
          {salesmanList.map((salesman) => (
            <MenuItem
              key={salesman.partySalesman.partyId}
              value={salesman.userLoginId}
            >
              {salesman.userLoginId}
            </MenuItem>
          ))}
        </TextField>
      ),
    },
  ];

  function getRetailOutletDetail() {
    authGet(dispatch, token, "/retailoutlet/" + partyId).then(
      (res) => {
        setRetailOutletDetail(res);
        console.log("Retail outlet detail", res);
      },
      (error) => {
        setRetailOutletDetail({});
      }
    );
  }

  const getSalesmanList = () => {
    authGet(dispatch, token, "/get-all-salesman").then(
      (res) => {
        setSalesmanList(res);
        console.log("List of salesman", res);
      },
      (error) => {
        setSalesmanList({});
      }
    );
  };

  const getDistributorList = () => {
    authGet(dispatch, token, "/get-distributor-candidates/" + partyId).then(
      (res) => {
        setDistributorList(res);
        console.log("List of distributor", res);
      },
      (error) => {
        setDistributorList();
      }
    );
  };

  useEffect(() => {
    getRetailOutletDetail();
    getSalesmanList();
    getDistributorList();
  }, []);

  return (
    <div>
      <Card>
        <CardContent>
          <Toolbar>
            <div style={{ padding: "0px 30px" }}>
              <b>partyId: </b> {partyId} <p />
              <b>Tên ĐLBL: </b>{" "}
              {RetailOutletDetail === null
                ? ""
                : RetailOutletDetail.retailOutletName}{" "}
              <p />
              <b>Mã ĐLBL: </b>{" "}
              {RetailOutletDetail === null
                ? ""
                : RetailOutletDetail.retailOutletCode}{" "}
              <p />
            </div>
          </Toolbar>

          <MaterialTable
            title="Danh sách nhà phân phối"
            columns={columns}
            data={RetailOutletDetail.retailOutletSalesmanDistributorModels}
            icons={tableIcons}
            options={{
              //filtering: true,
              actionsColumnIndex: -1,
            }}
            editable={{
              onRowAdd: (newData) =>
                new Promise((resolve) => {
                  const distributor = DistributorList.find(
                    (distributor) =>
                      distributor.distributorName ===
                      selectedDistributor.distributorName
                  );
                  const salesman = salesmanList.find(
                    (salesman) =>
                      salesman.userLoginId === selectedSalesman.userLoginId
                  );

                  const inputModel = {
                    partyRetailOutletId: partyId,
                    partySalesmanId: salesman.partySalesman.partyId,
                    partyDistributorId: distributor.partyId,
                  };

                  authPost(
                    dispatch,
                    token,
                    "/add-retail-outlet-distributor-salesman",
                    inputModel
                  ).then(() => {
                    getDistributorList();
                    getRetailOutletDetail();
                    setSelectedDistributor({ distributorName: "" });
                    setSelectedSalesman({ userLoginId: "" });
                  });
                  resolve();
                }),

              onRowDelete: (oldData) =>
                new Promise((resolve) => {
                  fetch(
                    "http://localhost:8080/api/delete-retail-outlet-distributor-salesman/" +
                      oldData.retailOutletSalesmanVendorId,
                    requestGetOption
                  ).then(() => {
                    getDistributorList();
                    getRetailOutletDetail();
                  });
                  resolve();
                }),
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}

export default RetailOutletDetail;
