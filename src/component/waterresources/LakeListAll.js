import React, { useEffect, useState } from "react";
import MaterialTable from "material-table";
import { useDispatch, useSelector } from "react-redux";
import { API_URL } from "../../config/config";
import { Link } from "react-router-dom";
import { Button, Grid } from "@material-ui/core";
import LakeOnMap from "./LakeOnMap";
function LakeListAll(props) {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const [lakes, setLakes] = useState([]);
  const [nameButton, setNameButton] = useState("Xem trên bản đồ");

  const columns = [
    {
      field: "lakeId",
      title: "Mã hồ đập",
      render: (rowData) => (
        <Link to={"/lake/info/" + rowData["lakeId"]}>{rowData["lakeId"]}</Link>
      ),
    },
    {
      field: "lakeName",
      title: "Tên hồ đập",
    },
  ];
  const requestOptionsGet = {
    method: "GET",
    headers: { "Content-Type": "application/json", "X-Auth-Token": token },
  };
  function getLakeList() {
    //console.log("getDepartmentList....");
    fetch(API_URL + "/get-all-lakes", requestOptionsGet)
      .then((response) => response.json())
      .then(
        (response) => {
          /*
                console.log(response);
                let arr = [];
                response.forEach(d => {
                  arr.push(d);
                });
                setLakes(arr);
                //console.log('getDepartmentList = ',departments);
                */
          setLakes(response);
        },
        (error) => {
          setLakes([]);
        }
      );
  }

  useEffect(() => {
    getLakeList();
  }, []);

  const handleClickViewButton = () => {
    nameButton === "Xem trên danh sách"
      ? setNameButton("Xem trên bản đồ")
      : setNameButton("Xem trên danh sách");
  };
  if (nameButton === "Xem trên bản đồ") {
    return (
      <>
        <Grid container justify="flex-end">
          <Button
            color={"primary"}
            variant={"contained"}
            style={{ marginBottom: "10px" }}
            onClick={() => handleClickViewButton()}
          >
            {nameButton}
          </Button>
        </Grid>
        <MaterialTable
          options={{ search: true }}
          title={"Danh sách tất cả hồ đập"}
          columns={columns}
          data={lakes}
        />
        ;
      </>
    );
  }
  return (
    <>
      <Grid container justify="flex-end">
        <Button
          color={"primary"}
          variant={"contained"}
          style={{ marginBottom: "10px" }}
          onClick={() => handleClickViewButton()}
        >
          {nameButton}
        </Button>
      </Grid>
      <LakeOnMap lakes={lakes} />;
    </>
  );
}

export default LakeListAll;
