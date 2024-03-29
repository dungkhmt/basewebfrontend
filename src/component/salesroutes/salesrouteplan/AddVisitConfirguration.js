import {
  Button,
  Card,
  CardContent,
  CircularProgress,
  MenuItem,
  TextField,
  Typography,
} from "@material-ui/core";
import { MuiThemeProvider } from "@material-ui/core/styles";
import { Cancel, Save } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { DevTool } from "react-hook-form-devtools";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import { toast } from "react-toastify";
import { object, string } from "yup";
import { axiosGet, axiosPost } from "../../../api";
import { errorNoti } from "../../../utils/notification";

function AddVisitConfirguration(props) {
  const history = useHistory();
  const token = useSelector((state) => state.auth.token);

  // Form data.
  const [weeks, setWeeks] = useState([]);
  const [salesmans, setSalesmans] = useState([]);
  const [distributors, setDistributors] = useState([]);
  const [retailOutlets, setRetailOutlets] = useState([]);
  const [frequencies, setFrequencies] = useState([]);
  const [configs, setConfigs] = useState([]);
  const [respectiveConfigs, setRespectiveConfigs] = useState([]);

  // Form engine.
  const schema = object().shape({
    salesman: string().required("Vui lòng chọn một mục"),
    distributor: string().required("Vui lòng chọn một mục"),
    retailOutlet: string().required("Vui lòng chọn một mục"),
    frequency: string().required("Vui lòng chọn một mục"),
    startExecuteWeek: string().when("config", {
      is: (config) => config !== "" && config !== "None",
      then: string().required("Vui lòng chọn một mục"),
    }),
  });

  const { control, handleSubmit, errors, setValue, watch, clearError } =
    useForm({
      defaultValues: {
        salesman: "",
        distributor: "",
        retailOutlet: "",
        frequency: "",
        config: "",
        startExecuteWeek: "",
      },
      validationSchema: schema,
    });

  // Util
  const [loadingDistributor, setLoadingDistributors] = useState(false);
  const [loadingRetailOutlet, setLoadingRetailOutlets] = useState(false);
  const LoadingIndicator = () => (
    <CircularProgress size={30} style={{ marginLeft: "85px" }} />
  );

  // Functions.
  const getSalesmans = () => {
    axiosPost(token, "/get-list-all-salesmans", { statusId: null })
      .then((res) => {
        setSalesmans(res.data);
        console.log("Salesmans ", res.data);
      })
      .catch((error) => console.log("Error in method getSalesman: ", error));
  };

  const getVisitFrequencies = () => {
    axiosGet(token, "/get-list-sales-route-visit-frequency")
      .then((res) => {
        setFrequencies(res.data);
        console.log("Frequencies ", res.data);
      })
      .catch((error) =>
        console.log("Error in method getVisitFrequencies: ", error)
      );
  };

  const getConfigs = () => {
    axiosPost(token, "/get-list-sales-route-config", {
      statusId: null,
    })
      .then((res) => {
        setConfigs(res.data);
        console.log("Configs ", res.data);
      })
      .catch((error) => console.log("Error in method getConfigs: ", error));
  };

  const generateListOfWeeks = () => {
    console.time("generateListOfWeeks");

    let fromDate = props.location.state.fromDate;
    let toDate = props.location.state.toDate;

    fromDate = new Date(
      fromDate.slice(3, 5) + "/" + fromDate.slice(0, 2) + fromDate.slice(5)
    );

    toDate = new Date(
      toDate.slice(3, 5) + "/" + toDate.slice(0, 2) + toDate.slice(5)
    );

    // Find the first Monday from fromDate to toDate.
    const day = fromDate.getDay();
    fromDate.setDate(
      fromDate.getDate() + (day == 1 || day == 0 ? 1 - day : 8 - day)
    );

    // Generate list of weeks.
    let monday;
    let sunday;
    let listOfWeeks = [];
    let i = 1;

    while (fromDate.getTime() <= toDate.getTime()) {
      monday = `${("0" + fromDate.getDate()).slice(-2)}/${(
        "0" +
        (fromDate.getMonth() + 1)
      ).slice(-2)}/${fromDate.getFullYear()}`;

      fromDate.setDate(fromDate.getDate() + 6);

      sunday = `${("0" + fromDate.getDate()).slice(-2)}/${(
        "0" +
        (fromDate.getMonth() + 1)
      ).slice(-2)}/${fromDate.getFullYear()}`;

      listOfWeeks.push({
        id: i,
        fromDate: monday,
        toDate: sunday,
      });

      fromDate.setDate(fromDate.getDate() + 1);
      i++;
    }

    // Last week may not be enough 7 days.
    if (listOfWeeks.length > 0) {
      const lastWeek = listOfWeeks[listOfWeeks.length - 1];
      fromDate.setDate(fromDate.getDate() - 7);

      listOfWeeks[listOfWeeks.length - 1] = {
        id: lastWeek.id,

        fromDate: `${("0" + fromDate.getDate()).slice(-2)}/${(
          "0" +
          (fromDate.getMonth() + 1)
        ).slice(-2)}/${fromDate.getFullYear()}`,

        toDate: `${("0" + toDate.getDate()).slice(-2)}/${(
          "0" +
          (toDate.getMonth() + 1)
        ).slice(-2)}/${toDate.getFullYear()}`,
      };
    }

    console.timeEnd("generateListOfWeeks");

    setWeeks(listOfWeeks);
  };

  const onChangeSalesman = (salesmanId) => {
    setLoadingDistributors(true);
    setValue([{ distributor: "" }, { retailOutlet: "" }]);
    setRetailOutlets([]);

    axiosPost(token, "/get-distributors-of-salesman", {
      partySalesmanId: salesmanId,
    })
      .then((res) => {
        setDistributors(res.data);
        console.log("Distributors of salesman", res.data);
      })
      .catch((error) =>
        console.log("Error in method onChangeSalesman: ", error)
      )
      .finally(() => setLoadingDistributors(false));
  };

  const onChangeDistributor = (distributorId) => {
    setLoadingRetailOutlets(true);

    axiosPost(token, "/get-list-retail-outlets-of-salesman-and-distributor", {
      partySalesmanId: watch("salesman"),
      partyDistributorId: distributorId,
    })
      .then((res) => {
        setRetailOutlets(res.data);
        console.log("Retail outlets of salesman and distributor: ", res.data);
      })
      .catch((error) =>
        console.log("Error in method onChangeDistributor: ", error)
      )
      .finally(() => setLoadingRetailOutlets(false));
  };

  const onChangeFrequency = (visitFrequencyId) => {
    setValue([{ config: "" }, { startExecuteWeek: "" }]);
    clearError(["startExecuteWeek"]);

    setRespectiveConfigs([
      ...configs.filter((c) => c.visitFrequencyId === visitFrequencyId),
      {
        salesRouteConfigId: "None",
        days: "None",
        repeatWeek: 1,
        statusId: null,
        description: null,
      },
    ]);
  };

  const onChangeConfig = (salesRouteConfigId) => {
    if (salesRouteConfigId === "None") {
      clearError(["startExecuteWeek"]);
      setValue("startExecuteWeek", "");
    }
  };

  const onClickCancelButton = () => {
    history.goBack();
  };

  const onSubmit = (data) => {
    console.log("Form data ", data);
    // notify()

    axiosPost(token, "/create-sales-route-config-retail-outlet", {
      retailOutletSalesmanVendorId: data.retailOutlet,
      salesRoutePlanningPeriodId:
        props.location.state.salesRoutePlanningPeriodId,
      visitFrequencyId: data.frequency,
      salesRouteConfigId: data.config === "None" ? null : data.config,
      startExecuteWeek:
        data.startExecuteWeek === "" ? null : data.startExecuteWeek,
      startExecuteDate:
        data.startExecuteWeek === ""
          ? null
          : weeks[parseInt(data.startExecuteWeek) - 1].fromDate.replace(
              /\//g,
              "-"
            ),
    })
      .then(() => {
        toast.dismiss();
        history.goBack();
      })
      .catch((error) => {
        errorNoti();
        console.log("Error in method onSubmit: ", error);
      });
  };

  useEffect(() => {
    getSalesmans();
    getVisitFrequencies();
    getConfigs();
    generateListOfWeeks();
  }, []);

  return (
    <div>
      <MuiThemeProvider>
        <Card>
          <CardContent>
            {/* Title */}
            <Typography variant="h6" style={{ marginLeft: 10 }}>
              Thêm cấu hình viếng thăm
            </Typography>
            <Typography variant="subtitle1" style={{ marginLeft: 24 }}>
              Giai đoạn làm tuyến: SalesRoute
              {" " + props.location.state.fromDate} đến
              {" " + props.location.state.toDate}
            </Typography>
            <br />

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)}>
              <Controller
                as={
                  <TextField
                    select
                    error={!!errors.salesman}
                    id="salesman"
                    label="Nhân viên bán hàng*"
                    value={watch("salesman")}
                    helperText={errors.salesman?.message}
                    style={{ minWidth: "200px", marginLeft: "30px" }}
                  >
                    {/* {loadingDistributors?   <LoadingIndicator/>:*/}
                    {salesmans.map((s) => (
                      <MenuItem key={s.partyId} value={s.partyId}>
                        {s.userLoginId}
                      </MenuItem>
                    ))}
                  </TextField>
                }
                name="salesman"
                control={control}
                onChange={([, selected]) => {
                  onChangeSalesman(selected.props.value);
                  return selected.props.value;
                }}
              />
              <br />
              <br />
              <Controller
                as={
                  <TextField
                    select
                    error={!!errors.distributor}
                    id="distributor"
                    label="Nhà phân phối*"
                    value={watch("distributor")}
                    helperText={errors.distributor?.message}
                    style={{ minWidth: "200px", marginLeft: "30px" }}
                  >
                    {loadingDistributor ? (
                      <LoadingIndicator />
                    ) : (
                      distributors.map((d) => (
                        <MenuItem key={d.partyId} value={d.partyId}>
                          {d.distributorName}
                        </MenuItem>
                      ))
                    )}
                  </TextField>
                }
                name="distributor"
                control={control}
                onChange={([, selected]) => {
                  onChangeDistributor(selected.props.value);
                  return selected.props.value;
                }}
              />
              <br />
              <br />
              <Controller
                as={
                  <TextField
                    select
                    error={!!errors.retailOutlet}
                    id="retailOutlet"
                    label="Đại lý bán lẻ*"
                    value={watch("retailOutlet")}
                    helperText={errors.retailOutlet?.message}
                    style={{ minWidth: "200px", marginLeft: "30px" }}
                  >
                    {loadingRetailOutlet ? (
                      <LoadingIndicator />
                    ) : (
                      retailOutlets.map((ro) => (
                        <MenuItem
                          key={ro.retailOutletSalesmanVendorId}
                          value={ro.retailOutletSalesmanVendorId}
                        >
                          {ro.retailOutletName}
                        </MenuItem>
                      ))
                    )}
                  </TextField>
                }
                name="retailOutlet"
                control={control}
              />
              <br />
              <br />
              <Controller
                as={
                  <TextField
                    select
                    error={!!errors.frequency}
                    id="frequency"
                    label="Tần suất thăm*"
                    value={watch("frequency")}
                    helperText={errors.frequency?.message}
                    style={{ minWidth: "200px", marginLeft: "30px" }}
                  >
                    {frequencies.map((f) => (
                      <MenuItem
                        key={f.visitFrequencyId}
                        value={f.visitFrequencyId}
                      >
                        {f.description}
                      </MenuItem>
                    ))}
                  </TextField>
                }
                name="frequency"
                control={control}
                onChange={([, selected]) => {
                  onChangeFrequency(selected.props.value);
                  return selected.props.value;
                }}
              />
              <br />
              <br />
              <Controller
                as={
                  <TextField
                    select
                    id="config"
                    label="Cấu hình thăm"
                    value={watch("config")}
                    style={{ minWidth: "200px", marginLeft: "30px" }}
                  >
                    {respectiveConfigs.map((c) => (
                      <MenuItem
                        key={c.salesRouteConfigId}
                        value={c.salesRouteConfigId}
                      >
                        {c.days}
                      </MenuItem>
                    ))}
                  </TextField>
                }
                name="config"
                control={control}
                onChange={([, selected]) => {
                  onChangeConfig(selected.props.value);
                  return selected.props.value;
                }}
              />
              <br />
              <br />
              <Controller
                as={
                  <TextField
                    select
                    error={!!errors.startExecuteWeek}
                    id="startExecuteWeek"
                    label="Tuần bắt đầu"
                    value={watch("startExecuteWeek")}
                    helperText={errors.startExecuteWeek?.message}
                    style={{ minWidth: "280px", marginLeft: "30px" }}
                    disabled={
                      watch("config") === "" || watch("config") === "None"
                    }
                  >
                    {weeks.map((week) => (
                      <MenuItem key={week.id} value={week.id}>
                        {`Tuần ${week.id} (${week.fromDate} - ${week.toDate})`}
                      </MenuItem>
                    ))}
                  </TextField>
                }
                name="startExecuteWeek"
                control={control}
              />
              <br />
              <br />
              <Button
                variant="contained"
                size="medium"
                color="primary"
                startIcon={<Cancel />}
                onClick={onClickCancelButton}
                style={{
                  background: "grey",
                  color: "white",
                  marginRight: "10px",
                  margin: "0px 10px 0px 30px",
                }}
              >
                HỦY
              </Button>
              <Button
                variant="contained"
                color="primary"
                size="medium"
                startIcon={<Save />}
                type="submit"
              >
                LƯU
              </Button>
            </form>
            <DevTool control={control} />
          </CardContent>
        </Card>
      </MuiThemeProvider>
    </div>
  );
}

export default AddVisitConfirguration;
