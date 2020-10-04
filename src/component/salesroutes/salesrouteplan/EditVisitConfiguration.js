import React, { useState, useEffect } from "react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import Card from "material-ui/Card";
import MenuItem from "material-ui/MenuItem";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { axiosGet, axiosPut } from "../../../api";
import { useDispatch, useSelector } from "react-redux";
import { Save, Cancel } from "@material-ui/icons";
import { Controller, useForm } from "react-hook-form";
import { DevTool } from "react-hook-form-devtools";
import { useHistory } from "react-router";
import { errorNoti } from "../Notification";
import { object, string } from "yup";
import { toast } from "react-toastify";

function EditVisitConfirguration(props) {
  const dispatch = useDispatch();
  const history = useHistory();
  const token = useSelector((state) => state.auth.token);
  const data = props.location.state;

  // Form data.
  const [weeks, setWeeks] = useState([]);
  const [frequencies, setFrequencies] = useState([]);
  const [configs] = useState(data.configs);
  const [respectiveConfigs, setRespectiveConfigs] = useState([
    ...data.configs.filter((c) => c.visitFrequencyId === data.visitFrequencyId),
    {
      salesRouteConfigId: "None",
      days: "None",
    },
  ]);

  // Form engine.
  const schema = object().shape({
    frequency: string().required("Vui lòng chọn một mục"),
    startExecuteWeek: string().when("config", {
      is: (config) => config !== "" && config !== "None",
      then: string().required("Vui lòng chọn một mục"),
    }),
  });

  const {
    control,
    handleSubmit,
    errors,
    setValue,
    watch,
    clearError,
  } = useForm({
    defaultValues: {
      frequency: data.visitFrequencyId,
      config: data.salesRouteConfigId,
      startExecuteWeek: data.startExecuteWeek,
    },
    validationSchema: schema,
  });

  // Functions.
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

  const generateListOfWeeks = () => {
    console.time("generateListOfWeeks");

    let fromDate = data.fromDate;
    let toDate = data.toDate;

    fromDate = new Date(
      fromDate.slice(3, 5) + "/" + fromDate.slice(0, 2) + fromDate.slice(5)
    );

    toDate = new Date(
      toDate.slice(3, 5) + "/" + toDate.slice(0, 2) + toDate.slice(5)
    );

    // Find the first Monday from fromDate to toDate.
    const day = fromDate.getDay();
    fromDate.setDate(
      fromDate.getDate() + (day === 1 || day === 0 ? 1 - day : 8 - day)
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

  const onChangeFrequency = (visitFrequencyId) => {
    setValue([{ config: "" }, { startExecuteWeek: "" }]);
    clearError(["startExecuteWeek"]);

    setRespectiveConfigs([
      ...configs.filter((c) => c.visitFrequencyId === visitFrequencyId),
      {
        salesRouteConfigId: "None",
        days: "None",
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

  const onSubmit = (formData) => {
    console.log("Form data ", formData);
    // notify()

    if (
      formData.frequency === data.visitFrequencyId &&
      formData.config === data.salesRouteConfigId &&
      formData.startExecuteWeek === data.startExecuteWeek
    ) {
      history.goBack();
    } else {
      axiosPut(token, "/update-sales-route-config-retail-outlet", {
        salesRouteConfigRetailOutletId: data.salesRouteConfigRetailOutletId,
        visitFrequencyId: formData.frequency,
        salesRouteConfigId: formData.config === "None" ? null : formData.config,
        startExecuteWeek:
          formData.startExecuteWeek === "" ? null : formData.startExecuteWeek,
        startExecuteDate:
          formData.startExecuteWeek === ""
            ? null
            : weeks[parseInt(formData.startExecuteWeek) - 1].fromDate.replace(
                /\//g,
                "-"
              ),
      })
        .then((res) => {
          toast.dismiss();
          history.goBack();
        })
        .catch((error) => {
          errorNoti();
          console.log("Error in method onSubmit: ", error);
        });
    }
  };

  useEffect(() => {
    getVisitFrequencies();
    generateListOfWeeks();
  }, []);

  return (
    <div>
      <MuiThemeProvider>
        <Card>
          <CardContent>
            {/* Title */}
            <Typography variant="h6" style={{ marginLeft: 10 }}>
              Thiết lập cấu hình viếng thăm cho đại lý bán lẻ
            </Typography>
            <Typography variant="subtitle1" style={{ marginLeft: 24 }}>
              Giai đoạn làm tuyến: SalesRoute {data.fromDate} đến {data.toDate}
            </Typography>
            <br />
            <Typography variant="subtitle1" style={{ marginLeft: 30 }}>
              Đại lý bán lẻ: {data.retailOutletName}
              <br />
              Nhân viên bán hàng: {data.salesmanName}
              <br />
              Nhà phân phối: {data.distributorName}
              <br />
            </Typography>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)}>
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

export default EditVisitConfirguration;
