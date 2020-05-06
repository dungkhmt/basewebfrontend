import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import Grid from "@material-ui/core/Grid";
import MaterialTable from "material-table";
import {authGet} from "../../api";
import {Link, useHistory, useParams} from "react-router-dom";
import Button from "@material-ui/core/Button";

export function Invoice() {
  const dispatch = useDispatch();
  const token = useSelector(state => state.auth.token);

  const columns = [
    {
      'title': 'Mã hóa đơn',
      render: rowData => <Link to={'/invoice-detail/' + rowData['invoiceId']}>{rowData['invoiceId']}</Link>
    },
    {'title': 'Ngày hóa đơn', field: 'invoiceDate'},
    {'title': 'Khách hàng', field: 'fromVendorId'},
    {'title': 'Thành tiền', field: 'amount'},
  ];

  const [dataTable, setDataTable] = useState([]);

  async function getDataTable() {
    let response = await authGet(dispatch, token, '/get-all-invoice');
    setDataTable(response);
  }

  useEffect(() => {
    getDataTable().then(r => r);
  }, []);

  return <div>
    <InvoiceDataTable
      title={'Danh sách hóa đơn'}
      columns={columns}
      dataTable={dataTable}
    />
  </div>;
}

export function InvoiceDetail() {
  const dispatch = useDispatch();
  const token = useSelector(state => state.auth.token);

  const {invoiceId} = useParams();

  const invoiceItemColumns = [
    {'title': 'Mã chi tiết hóa đơn', field: 'invoiceItemSeqId'},
    {'title': 'Sản phẩm', field: 'productName'},
    {'title': 'Thành tiền', field: 'amount'},
  ];

  const paymentApplicationColumns = [
    {'title': 'Mã thanh toán', field: 'paymentId'},
    {'title': 'Ngày thanh toán', field: 'effectiveDate'},
    {'title': 'Thành tiền', field: 'amountApplied'},
  ];

  const [invoiceItemInfos, setInvoiceItemInfos] = useState([
    {title: 'Mã hóa đơn', content: invoiceId}
  ]);

  const [invoice, setInvoice] = useState({});
  const [invoiceItemDataTable, setInvoiceItemDataTable] = useState([]);
  const [paymentApplicationDataTable, setPaymentApplicationDataTable] = useState([]);

  async function getDataTable() {
    let [invoice, invoiceItemDataTable, paymentApplicationDataTable] =
      await Promise.all([
        authGet(dispatch, token, '/get-invoice-by-id/' + invoiceId),
        authGet(dispatch, token, '/get-all-invoice-item-by-invoice-id/' + invoiceId),
        authGet(dispatch, token, '/get-all-payment-by-invoice-id/' + invoiceId)])

    setInvoice(invoice);
    setInvoiceItemInfos([{title: 'Mã hóa đơn', content: invoiceId}, {
      title: 'Ngày hóa đơn',
      content: invoice['invoiceDate']
    }]);

    setInvoiceItemDataTable(invoiceItemDataTable);

    setPaymentApplicationDataTable(paymentApplicationDataTable);
  }

  useEffect(() => {
    getDataTable().then(r => r);
  }, []);

  return <div>
    <InvoiceDataTable
      title={'Chi tiết hóa đơn'}
      columns={invoiceItemColumns}
      dataTable={invoiceItemDataTable}
      infos={invoiceItemInfos}
    />

    <InvoiceDataTable
      title={'Danh sách thanh toán'}
      columns={paymentApplicationColumns}
      dataTable={paymentApplicationDataTable}
    />
  </div>;
}

export function Payment() {
  const dispatch = useDispatch();
  const token = useSelector(state => state.auth.token);
  const history = useHistory();

  const columns = [
    {
      'title': 'Mã thanh toán',
      render: rowData => <Link to={'/payment-application/' + rowData['paymentId']}>{rowData['paymentId']}</Link>
    },
    {'title': 'Ngày thanh toán', field: 'effectiveDate'},
    {'title': 'Khách hàng thanh toán', field: 'fromPartyId'},
    {'title': 'Số tiền', field: 'amount'},
  ];

  const [dataTable, setDataTable] = useState([]);

  async function getDataTable() {
    let response = await authGet(dispatch, token, '/get-all-payment');
    setDataTable(response);
  }

  useEffect(() => {
    getDataTable().then(r => r);
  }, []);

  return <div>
    <Button color="primary" variant="contained" onClick={() => history.push('/create-payment')}>Thêm mới</Button>
    <InvoiceDataTable
      title={'Danh sách thanh toán'}
      columns={columns}
      dataTable={dataTable}
    />
  </div>;
}

export function PaymentApplication() {
  const dispatch = useDispatch();
  const token = useSelector(state => state.auth.token);

  const {paymentId} = useParams();

  const columns = [
    {'title': 'Mã khớp lệnh thanh toán', field: 'paymentId'},
    {'title': 'Ngày khớp lệnh thanh toán', field: 'effectiveDate'},
    {'title': 'Mã hóa đơn', field: 'fromPartyId'},
    {'title': 'Số tiền khớp lệnh', field: 'amount'},
  ];

  const [infos, setInfos] = useState([
    {title: 'Mã thanh toán', content: paymentId},
  ]);

  const [payment, setPayment] = useState([]);
  const [paymentApplications, setPaymentApplications] = useState([]);

  async function getDataTable() {
    let [payment, paymentApplications] = await Promise.all([
      authGet(dispatch, token, '/get-payment-by-id/' + paymentId),
      authGet(dispatch, token, '/get-payment-detail-by-payment-id/' + paymentId)]);

    setPayment(payment);
    setPaymentApplications(paymentApplications);

    setInfos([{title: 'Mã thanh toán', content: paymentId},
      {title: 'Khách hàng', content: payment['fromCustomerId']},
      {title: 'Ngày thanh toán', content: payment['effectiveDate']}])
  }

  useEffect(() => {
    getDataTable().then(r => r);
  }, []);

  return <div>
    <Button color="primary" variant="contained" onClick={() => history.push('/create-payment-application')}>
      Thêm mới</Button>
    <InvoiceDataTable
      title={'Chi tiết thanh toán'}
      tableTitle={'Danh sách khớp lệnh thanh toán'}
      columns={columns}
      dataTable={paymentApplications}
      infos={infos}
    />
  </div>;
}

function InvoiceDataTable(props) {

  const {title, tableTitle = '', infos = [], columns = [], dataTable = []} = props;

  return <div>
    <h2>{title}</h2>
    <Grid container spacing={3}>
      <Grid item xs={8} style={{textAlign: 'left', padding: '0px 30px 20px 30px'}}>
        {infos.map(value => (
          <div><b>{value['title'] + ': '} </b> {value['content']} <p/></div>
        ))}
      </Grid>
      <Grid item xs={4}
            style={{verticalAlign: 'text-bottom', textAlign: 'right', padding: '0px 50px 10px 30px'}}>
      </Grid>
    </Grid>
    <MaterialTable columns={columns} data={dataTable} title={tableTitle} options={{search: false}}/>
  </div>;
}

