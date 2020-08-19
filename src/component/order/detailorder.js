import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import {makeStyles} from "@material-ui/core/styles";
import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useParams} from "react-router-dom";
import {authGet} from "../../api";
import MaterialTable from "material-table";
import {tableIcons} from "../../utils/iconutil";
import DialogContent from "@material-ui/core/DialogContent";
import Dialog from "@material-ui/core/Dialog";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4),
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: 200
    }
  }
}));

function DetailOrder(props) {

  const {orderId} = useParams();
  const token = useSelector(state => state.auth.token);
  const dispatch = useDispatch();
  const [orderItems, setOrderItems] = useState([]);
  const [order, setOrder] = useState([]);
  const orderItemColumns = [
    {title: "Tên sản phẩm", field: "productName"},
    {title: "Số lượng", field: "quantity"},
    {title: "Uom", field: "uom"},
    {title: "Giá đơn vị", field: "unitPrice"}
  ];

  const [paymentOpen, setPaymentOpen] = useState(false);
  const [invoiceOpen, setInvoiceOpen] = useState(false);
  const [shipmentOpen, setShipmentOpen] = useState(false);

  const paymentColumns = [
    {title: "Mã thanh toán", field: "paymentId"},
    {title: "Loại thanh toán", field: "paymentType"},
    {title: "Phương thức thanh toán", field: "paymentMethod"},
    {title: "Từ khách hàng", field: "fromCustomerId"},
    {title: "Đến nhà cung cấp", field: "toVendorId"},
    {title: "Tổng thanh toán", field: "amount"},
    {title: "Thanh toán đã khớp đơn", field: "appliedAmount"},
    {title: "Loại tiền tệ", field: "currencyUomId"},
    {title: "Ngày thanh toán", field: "effectiveDate"},
    {title: "Trạng thái", field: "statusId"},
  ];

  const paymentApplicationColumns = [
    {title: "Mã thanh toán", field: "paymentId"},
    {title: "Mã hóa đơn", field: "invoiceId"},
    {title: "Lượng thanh toán", field: "appliedAmount"},
    {title: "Đơn vị tiền tệ", field: "currencyUomId"},
    {title: "Ngày thanh toán", field: "effectiveDate"},
  ];

  const invoiceColumns = [
    {title: "Mã hóa đơn", field: "invoiceId"},
    {title: "Loại hóa đơn", field: "invoiceType"},
    {title: "Mã trạng thái", field: "statusId"},
    {title: "Ngày hóa đơn", field: "invoiceDate"},
    {title: "Khách hàng thanh toán", field: "toPartyCustomerId"},
    {title: "Thanh toán cho nhà cung cấp", field: "fromVendorId"},
    {title: "Tổng cần thanh toán", field: "amount"},
    {title: "Đã thanh toán", field: "paidAmount"},
    {title: "Đơn vị tiền tệ", field: "currencyUomId"},
  ];

  const invoiceItemColumns = [
    {title: "Mã hóa đơn", field: "invoiceId"},
    {title: "Mã chi tiết hóa đơn", field: "invoiceItemSeqId"},
    {title: "Loại hóa đơn", field: "invoiceItemType"},
    {title: "Lượng thanh toán", field: "amount"},
    {title: "Đơn vị tiền tệ", field: "currencyUomId"},
  ];

  const shipmentColumns = [
    {title: "Mã đơn vận chuyển", field: "shipmentId"},
    {title: "Loại vận chuyển", field: "shipmentTypeId"},
  ];

  const shipmentItemColumns = [
    {title: "Mã chi tiết đơn vận chuyển", field: "shipmentItemId"},
    {title: "Mã đơn vận chuyển", field: "shipmentId"},
    {title: "Mã kho", field: "facilityId"},
    {title: "Số lượng", field: "quantity"},
    {title: "Số pallet", field: "pallet"},
    {title: "Mã đơn hàng", field: "orderId"},
  ];


  useEffect(() => {
    authGet(dispatch, token, "/orders/" + orderId).then(
      res => {
        setOrder(res);
        console.log('order detail = ', order);
        setOrderItems(res.orderItems);
        console.log('order-items = ', orderItems);
        console.log(res.orderItems);
      },
    );
  }, []);

  function checkNull(a, ifNotNull = a, ifNull = '') {
    return a ? ifNotNull : ifNull;
  }

  function dialogTableData(open, setOpen, title1, columns1, data1, title2, columns2, data2) {
    return (
      <div>
        <Dialog open={open} maxWidth={'xl'} fullWidth={true} onClose={() => setOpen(false)}>
          <DialogContent>
            {
              checkNull(title1 && columns1 && data1,
                (<MaterialTable columns={columns1} data={data1} options={{search: false}} title={title1}/>))
            }
            {
              checkNull(title2 && columns2 && data2,
                (<MaterialTable columns={columns2} data={data2} options={{search: false}} title={title2}/>))
            }
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  function paymentDialog() {
    let title1 = null;
    let columns1 = null;
    let data1 = null;
    let title2 = null;
    let columns2 = null;
    let data2 = null;
    if (order['paymentDetailViews']) {
      title1 = 'Danh sách thanh toán'
      columns1 = paymentColumns;
      data1 = order['paymentDetailViews'];
    }
    if (order['paymentApplicationDetailViews']) {
      title2 = 'Danh sách khớp lệnh thanh toán'
      columns2 = paymentApplicationColumns;
      data2 = order['paymentApplicationDetailViews'];
    }
    return dialogTableData(paymentOpen, setPaymentOpen, title1, columns1, data1, title2, columns2, data2);
  }

  function invoiceDialog() {
    let title1 = null;
    let columns1 = null;
    let data1 = null;
    let title2 = null;
    let columns2 = null;
    let data2 = null;
    if (order['invoiceDetailViews']) {
      title1 = 'Danh sách hóa đơn'
      columns1 = invoiceColumns;
      data1 = order['invoiceDetailViews'];
    }
    if (order['invoiceItemDetailViews']) {
      title2 = 'Danh sách chi tiết hóa đơn'
      columns2 = invoiceItemColumns;
      data2 = order['invoiceItemDetailViews'];
    }
    return dialogTableData(invoiceOpen, setInvoiceOpen, title1, columns1, data1, title2, columns2, data2);
  }

  function shipmentDialog() {
    let title1 = null;
    let columns1 = null;
    let data1 = null;
    let title2 = null;
    let columns2 = null;
    let data2 = null;
    if (order['shipmentDetailViews']) {
      title1 = 'Danh sách đơn vận chuyển'
      columns1 = shipmentColumns;
      data1 = order['shipmentDetailViews'];
    }
    if (order['shipmentItemDetailViews']) {
      title2 = 'Danh sách chi tiết đơn vận chuyển'
      columns2 = shipmentItemColumns;
      data2 = order['shipmentItemDetailViews'];
    }
    return dialogTableData(shipmentOpen, setShipmentOpen, title1, columns1, data1, title2, columns2, data2);
  }

  function exportPdf() {

  }

  return (
    <div>
      <Card>
        <CardContent>
          <div>
            <Grid container spacing={3}>
              <Grid xs={8}>
                <div>
                  <div style={{padding: '0px 30px'}}>
                    <b>OrderId: </b> {order.orderId} <p/>
                    <b>Customer: </b> {checkNull(order['customerName'])} <p/>
                    <b>Vendor: </b> {checkNull(order['vendorName'])} <p/>
                    <b>Salesman: </b> {checkNull(order['salesmanName'])} <p/>
                    <b>Date: </b> {checkNull(order['orderDate'])} <p/>
                    <b>Total: </b> {checkNull(order['total'])}<p/>

                  </div>
                </div>
              </Grid>
              <Grid item xs={4}
                    style={{verticalAlign: 'text-bottom', textAlign: 'right', padding: '0px 50px 10px 30px'}}>
                <Button color={'primary'} variant={'contained'} onClick={() => exportPdf()}>
                  PDF
                </Button>
                <Button color={'primary'} variant={'contained'} onClick={() => setPaymentOpen(true)}>
                  Thanh toán
                </Button>
                <Button color={'primary'} variant={'contained'} onClick={() => setInvoiceOpen(true)}>
                  Hóa đơn
                </Button>
                <Button color={'primary'} variant={'contained'} onClick={() => setShipmentOpen(true)}>
                  Phiếu xuất kho
                </Button>
              </Grid>
            </Grid>
          </div>

          <MaterialTable
            title="OrderItems"
            columns={orderItemColumns}
            options={{
              filtering: true,
              search: false
            }}
            data={orderItems}
            icons={tableIcons}
            onRowClick={(event, rowData) => {
              console.log("select ", rowData);
            }}
          />
        </CardContent>
      </Card>

      {paymentDialog()}
      {invoiceDialog()}
      {shipmentDialog()}

    </div>
  );
}

export default DetailOrder;
