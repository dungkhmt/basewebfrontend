import { Grid, IconButton, InputAdornment, Paper, TextField, Typography } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import { makeStyles } from "@material-ui/core/styles";
import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";
import SearchRoundedIcon from '@material-ui/icons/SearchRounded';
import MaterialTable from "material-table";
import { default as React, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { authGet } from "../../api";
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
  },
  table: {
    minWidth: "50%",
    maxWidth: "80%",
  },
}));
export default function InvoicePopup(props) {
  const classes = useStyles();
  const tableRef = React.createRef();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const [filtering, setFiltering] = useState("aaaa");
  const [invoiceIdFilter, setInvoiceIdFilter] = useState("");
  const [toPartyCustomerIdFilter, setToPartyCustomerIdFilter] = useState("");
  const handleInvoiceIdFilterChange = (event) => {
    setInvoiceIdFilter(event.target.value);
  };
  const url = "/get-page-unpaid-invoices";
  const handleToPartyCustomerIdFilterChange = (event) => {
    setToPartyCustomerIdFilter(event.target.value);
  };
  const columns = [
    {
      title: "Mã hóa đơn",
      render: (rowData) => (
        <Link to={"/invoice-detail/" + rowData["invoiceId"]}>
          {rowData["invoiceId"]}
        </Link>
      ),
    },
    { title: "Ngày hóa đơn", field: "invoiceDate" },
    { title: "Khách hàng", field: "toPartyCustomerId" },
    { title: "Thành tiền", field: "amount" },
  ];

  // const handleUpdateFilter = () => {
  //   console.log(filterParam);
  //   setFiltering(filterParam);
  // };
  return (
    <Dialog
      fullWidth={true}
      maxWidth={"lg"}
      onClose={props.handleClose}
      open={props.open}
      PaperProps={{
        style: {
          backgroundColor: 'transparent',
          boxShadow: 'none',
        },
      }}
    >
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <Typography variant="h5" component="h2" align="left">
              Invoice List
            </Typography>
            <TextField
              id="invoice-search"
              label="with Invoice Code"
              variant="outlined"
              size="small"
              value={invoiceIdFilter}
              onChange={handleInvoiceIdFilterChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <KeyboardArrowRightIcon />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              id="customer-search"
              label="with Customer Code"
              variant="outlined"
              size="small"
              value={toPartyCustomerIdFilter}
              onChange={handleToPartyCustomerIdFilterChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <KeyboardArrowRightIcon />
                  </InputAdornment>
                ),
              }}
            />

            <IconButton  onClick={()=>tableRef.current.onQueryChange() }>
              <SearchRoundedIcon color="primary" />
            </IconButton>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <MaterialTable
            tableRef={tableRef}
            columns={columns}
            data={(query) =>
              new Promise((resolve, reject) => {
                let sortParam = "";
                let filterParam = "";
                if (invoiceIdFilter !== "")
                  filterParam = "invoiceId:" + invoiceIdFilter;
                if (toPartyCustomerIdFilter !== "") {
                  if (filterParam !== "") filterParam += ",";
                  filterParam =
                    filterParam +
                    "toPartyCustomerId:" +
                    toPartyCustomerIdFilter;
                }
                if (filterParam !== "")
                  filterParam = "&filtering=" + filterParam;
                authGet(
                  dispatch,
                  token,
                  url +
                    "?size=" +
                    query.pageSize +
                    "&page=" +
                    query.page +
                    sortParam +
                    filterParam
                ).then((res) => {
                  resolve({
                    data: res,
                    page: res.number,
                    totalCount: res.totalElements,
                  });
                });
              })
            }
            title={""}
            options={{ search: false }}
            
          />
        </Grid>
      </Grid>
    </Dialog>
  );
}
