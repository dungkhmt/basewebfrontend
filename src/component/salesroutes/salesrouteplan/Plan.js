import MomentUtils from "@date-io/moment";
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@material-ui/core";
import { MuiThemeProvider } from "@material-ui/core/styles";
import { Cancel, Save } from "@material-ui/icons";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import MaterialTable, { MTableToolbar } from "material-table";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { axiosPost } from "../../../api";
import { tableIcons } from "../../../utils/iconutil";
import {
  processingNoti,
  updateErrorNoti,
  updateSuccessNoti,
} from "../../../utils/notification";

// const Transition = forwardRef((props, ref) => <Slide direction="down" ref={ref} {...props}/>);

function Plan() {
  const token = useSelector((state) => state.auth.token);

  // Modal.
  const [creationDialogOpen, setCreationDialogOpen] = useState(false);
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const { register, handleSubmit } = useForm();

  // Snackbar.
  const toastId = React.useRef(null);

  // Table.
  const [plans, setPlans] = useState([]);
  const columns = [
    {
      field: "salesRoutePlanningPeriodId",
      title: "Mã giai đoạn",
      render: (rowData) => (
        <Link
          to={{
            pathname: "/salesroutes/plan/period",
            state: {
              salesRoutePlanningPeriodId: rowData["salesRoutePlanningPeriodId"],
              fromDate: rowData["fromDate"],
              toDate: rowData["toDate"],
            },
          }}
        >
          {rowData["salesRoutePlanningPeriodId"]}
        </Link>
      ),
    },
    {
      field: "description",
      title: "Mô tả",
    },
    {
      field: "fromDate",
      title: "Ngày bắt đầu",
    },
    {
      field: "toDate",
      title: "Ngày kết thúc",
    },
  ];

  const getListSalesRoutePlanningPeriod = () => {
    axiosPost(token, "/get-list-sales-route-planning-period", {
      statusId: null,
    })
      .then((res) => {
        console.log("getListSalesRoutePlanningPeriod, plans ", res.data);

        let plans = res.data;
        let len = plans.length;
        let fromDate, toDate;

        for (let i = 0; i < len; i++) {
          fromDate = new Date(plans[i].fromDate);
          toDate = new Date(plans[i].toDate);

          plans[i] = {
            ...plans[i],

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

        setPlans(plans);
      })
      .catch((error) =>
        console.log("getListSalesRoutePlanningPeriod, error ", error)
      );
  };

  const onDialogClose = () => {
    setCreationDialogOpen(false);
    setFromDate(new Date());
    setToDate(new Date());
  };

  const onClickSaveButton = (data) => {
    setCreationDialogOpen(false);
    processingNoti(toastId, false);

    axiosPost(token, "/create-sales-route-planning-period", {
      fromDate,
      toDate,
      description: data["Description"],
    })
      .then((res) => {
        console.log("onClickSaveButton, new plan ", res.data);

        const newPlan = res.data;
        let fromDate = new Date(newPlan.fromDate);
        let toDate = new Date(newPlan.toDate);

        setPlans([
          ...plans,
          {
            ...newPlan,

            fromDate: `${("0" + fromDate.getDate()).slice(-2)}/${(
              "0" +
              (fromDate.getMonth() + 1)
            ).slice(-2)}/${fromDate.getFullYear()}`,

            toDate: `${("0" + toDate.getDate()).slice(-2)}/${(
              "0" +
              (toDate.getMonth() + 1)
            ).slice(-2)}/${toDate.getFullYear()}`,
          },
        ]);

        updateSuccessNoti(toastId, "Đã thêm");
      })
      .catch((error) => {
        console.log("onClickSaveButton, error ", error);

        updateErrorNoti(toastId, "Rất tiếc! Đã xảy ra lỗi :((");
      });
  };

  useEffect(() => {
    getListSalesRoutePlanningPeriod();
  }, []);

  return (
    <div>
      <MuiThemeProvider>
        <Card>
          <CardContent>
            <MaterialTable
              title="Kế hoạch tuyến bán hàng"
              columns={columns}
              data={plans}
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
              options={{
                search: false,
                actionsColumnIndex: -1,
              }}
              components={{
                Toolbar: (props) => (
                  <div>
                    <MTableToolbar {...props} />
                    <MuiThemeProvider>
                      <Box display="flex" justifyContent="flex-end" width="98%">
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => setCreationDialogOpen(true)}
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
                    </MuiThemeProvider>
                  </div>
                ),
              }}
            />
            <Dialog
              open={creationDialogOpen}
              onClose={onDialogClose}
              // TransitionComponent={Transition}
            >
              <DialogTitle>Thêm mới kế hoạch tuyến bán hàng</DialogTitle>
              <form onSubmit={handleSubmit(onClickSaveButton)}>
                <DialogContent>
                  <MuiPickersUtilsProvider utils={MomentUtils}>
                    <KeyboardDatePicker
                      margin="normal"
                      id="fromdate"
                      label="Ngày bắt đầu"
                      format="YYYY-MM-DD"
                      value={fromDate}
                      onChange={(date) => setFromDate(date)}
                      KeyboardButtonProps={{
                        "aria-label": "change date",
                      }}
                    />
                    <br />
                    <KeyboardDatePicker
                      margin="normal"
                      id="todate"
                      label="Ngày kết thúc"
                      format="YYYY-MM-DD"
                      value={toDate}
                      onChange={(date) => setToDate(date)}
                      KeyboardButtonProps={{
                        "aria-label": "change date",
                      }}
                    />
                  </MuiPickersUtilsProvider>
                  <TextField
                    required
                    multiline
                    margin="normal"
                    label="Mô tả"
                    name="Description"
                    inputRef={register({ required: true })}
                    fullWidth
                  />
                </DialogContent>
                <DialogActions>
                  <Button
                    variant="contained"
                    size="medium"
                    color="primary"
                    startIcon={<Cancel />}
                    onClick={onDialogClose}
                    style={{ background: "grey", color: "white" }}
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
                </DialogActions>
              </form>
            </Dialog>
          </CardContent>
        </Card>
      </MuiThemeProvider>
    </div>
  );
}

export default Plan;
