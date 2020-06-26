import React, { useState, useEffect } from "react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import Card from "material-ui/Card";
import MenuItem from "material-ui/MenuItem";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { authPost, authGet, authPut } from "../../../api";
import { useDispatch, useSelector } from "react-redux";
import { Save, Cancel } from "@material-ui/icons";
import { Controller, useForm } from "react-hook-form";
import { DevTool } from "react-hook-form-devtools";
import { useHistory } from "react-router";
import { errorNoti } from "../Notification";

function EditVisitConfirguration(props) {
  const history = useHistory();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const data = props.location.state;

  // Form
  const [frequencies, setFrequencies] = useState([]);
  const [configs] = useState(data.configs);
  const [respectiveConfigs, setRespectiveConfigs] = useState([
    ...data.configs.filter((c) => c.visitFrequencyId === data.visitFrequencyId),
    {
      salesRouteConfigId: "None",
      days: "None",
    },
  ]);

  const {
    register,
    control,
    handleSubmit,
    errors,
    getValues,
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      frequency: data.frequency,
      config: data.selectedConfig,
      fromWeek: "",
    },
  });

  const [payLoad, setPayLoad] = useState({
    salesRouteConfigId: "",
    visitFrequencyId: data.visitFrequencyId,
  });

  // Functions
  const getVisitFrequencies = () => {
    authGet(dispatch, token, "/get-list-sales-route-visit-frequency").then(
      (res) => {
        console.log(res);
        setFrequencies(res);
      }
    );
  };

  const onChangeFrequency = (child) => {
    setValue([{ config: "" }, { fromWeek: "" }]);
    setPayLoad(() => ({ ...payLoad, visitFrequencyId: child.key }));
    setRespectiveConfigs([
      ...configs.filter((c) => c.visitFrequencyId === child.key),
      {
        salesRouteConfigId: "None",
        days: "None",
      },
    ]);
  };

  const onChangeConfig = (child) => {
    setValue("fromWeek", "");
    setPayLoad(() => ({ ...payLoad, salesRouteConfigId: child.key }));
  };

  const onClickCancelButton = () => {
    history.goBack();
  };

  const onSubmit = (formData) => {
    if (
      formData.frequency !== data.frequency ||
      formData.config !== data.selectedConfig
    ) {
      authPut(dispatch, token, "/update-sales-route-config-retail-outlet", {
        salesRouteConfigRetailOutletId: data.salesRouteConfigRetailOutletId,
        visitFrequencyId: payLoad.visitFrequencyId,
        salesRouteConfigId:
          payLoad.salesRouteConfigId === "None"
            ? null
            : payLoad.salesRouteConfigId,
        startExecuteWeek: formData.fromWeek,
      }).then((res) => {
        if (res.ok) {
          history.goBack();
        } else {
          errorNoti();
        }
      });
    }
  };

  useEffect(() => {
    getVisitFrequencies();
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
            </Typography>
            <Typography variant="subtitle1" style={{ marginLeft: 30 }}>
              Nhân viên bán hàng: {data.salesmanName}
            </Typography>
            <Typography variant="subtitle1" style={{ marginLeft: 30 }}>
              Nhà phân phối: {data.distributorName}
            </Typography>
            <br />

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)}>
              <Controller
                as={
                  <TextField
                    required
                    select
                    error={!!errors.frequency}
                    id="frequency"
                    label="Tần suất thăm"
                    value={getValues("frequency")}
                    helperText={errors.frequency?.message}
                    style={{ minWidth: "200px", marginLeft: "30px" }}
                  >
                    {frequencies.map((f) => (
                      <MenuItem key={f.visitFrequencyId} value={f.description}>
                        {f.description}
                      </MenuItem>
                    ))}
                  </TextField>
                }
                name="frequency"
                rules={{ required: "Vui lòng chọn một mục" }}
                control={control}
                onChange={(e) => {
                  onChangeFrequency(e[1]);
                  return e[1].props.value;
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
                    value={getValues("config")}
                    style={{ minWidth: "200px", marginLeft: "30px" }}
                  >
                    {respectiveConfigs.map((c) => (
                      <MenuItem key={c.salesRouteConfigId} value={c.days}>
                        {c.days}
                      </MenuItem>
                    ))}
                  </TextField>
                }
                name="config"
                control={control}
                onChange={(e) => {
                  onChangeConfig(e[1]);
                  return e[1].props.value;
                }}
              />
              <br />
              <br />
              <TextField
                disabled={watch("config") === "" || watch("config") === "None"}
                id="fromWeek"
                name="fromWeek"
                label="Tuần bắt đầu"
                helperText="Ví dụ: 1,2,3"
                inputRef={register}
                style={{ minWidth: "200px", marginLeft: "30px" }}
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
