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
      render: rowData => <Link
        to={'/invoice-group/invoice-detail/' + rowData['invoiceId']}>{rowData['invoiceId']}</Link>
    },
    {'title': 'Ngày hóa đơn', field: 'invoiceDate'},
    {'title': 'Tên khách hàng', field: 'toPartyCustomerName'},
    {'title': 'Thành tiền (VND)', field: 'amount'},
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
  const history = useHistory();

  const {invoiceId} = useParams();

  const invoiceItemColumns = [
    {'title': 'Mã chi tiết hóa đơn', field: 'invoiceItemSeqId'},
    {'title': 'Sản phẩm', field: 'productName'},
    {'title': 'Thành tiền (VND)', field: 'amount'},
    {
      title: 'Mã đơn hàng',
      render: rowData => <Link to={'/orders/detail/' + rowData['orderId']}>{rowData['orderId']}</Link>
    }
  ];

  const paymentApplicationColumns = [
    {
      'title': 'Mã thanh toán',
      render: rowData => <Link
        to={'/payment-group/payment-application/' + rowData['paymentId']}>{rowData['paymentId']}</Link>
    },
    {'title': 'Ngày thanh toán', field: 'effectiveDate'},
    {'title': 'Thành tiền', field: 'appliedAmount'},
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
        authGet(dispatch, token, '/get-all-payment-application-by-invoice-id/' + invoiceId)])

    setInvoice(invoice);
    setInvoiceItemInfos([
      {title: 'Mã hóa đơn', content: invoiceId},
      {title: 'Ngày hóa đơn', content: invoice['invoiceDate']},
      {title: 'Tên khách hàng', content: invoice['toPartyCustomerName']},
      {title: 'Tổng tiền hóa đơn', content: invoice['amount']},
      {title: 'Tổng tiền đã thanh toán', content: invoice['paidAmount']},
      {title: 'Trạng thái hóa đơn', content: invoice['statusId']},
    ]);

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
      actions={invoiceId && (invoice['amount'] - invoice['paidAmount'] > 0) ? [(
        <Button color={"primary"} variant={"contained"}
                onClick={() => history.push('/payment-group/quick-create-payment-application/' + invoiceId)}>
          Thanh toán
        </Button>)] : []}
    />

    <InvoiceDataTable
      title={'Danh sách khớp lệnh thanh toán'}
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
      render: rowData => <Link
        to={'/payment-group/payment-application/' + rowData['paymentId']}>{rowData['paymentId']}</Link>
    },
    {'title': 'Ngày thanh toán', field: 'effectiveDate'},
    {'title': 'Khách hàng thanh toán', field: 'fromCustomerId'},
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
    <Button color="primary" variant="contained" onClick={() => history.push('/payment-group/create-payment')}>Thêm
      mới</Button>
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
  const history = useHistory();

  const {paymentId} = useParams();

  const columns = [
    {'title': 'Mã khớp lệnh thanh toán', field: 'paymentApplicationId'},
    {'title': 'Ngày khớp lệnh thanh toán', field: 'effectiveDate'},
    {
      'title': 'Mã hóa đơn',
      render: rowData => <Link
        to={'/invoice-group/invoice-detail/' + rowData['invoiceId']}>{rowData['invoiceId']}</Link>
    },
    {'title': 'Số tiền khớp lệnh (VND)', field: 'appliedAmount'},
  ];

  const [infos, setInfos] = useState([
    {title: 'Mã thanh toán', content: paymentId},
  ]);

  const [payment, setPayment] = useState([]);
  const [paymentApplications, setPaymentApplications] = useState([]);

  async function getDataTable() {
    let [payment, paymentApplications] = await Promise.all([
      authGet(dispatch, token, '/get-payment-by-id/' + paymentId),
      authGet(dispatch, token, '/get-payment-application-by-payment-id/' + paymentId)]);

    setPayment(payment);
    setPaymentApplications(paymentApplications);

    setInfos([
      {title: 'Mã thanh toán', content: paymentId},
      {title: 'Tên khách hàng', content: payment['fromCustomerName']},
      {title: 'Ngày thanh toán', content: payment['effectiveDate']},
      {title: 'Số tiền thanh toán', content: payment['amount']},
      {title: 'Số tiền còn lại', content: payment['amount'] - payment['appliedAmount']},
    ])
  }

  useEffect(() => {
    getDataTable().then(r => r);
  }, []);

  return <div>
    <Button color="primary" variant="contained"
            onClick={() => history.push('/payment-group/create-payment-application/' + paymentId)}>
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

export function DistributorUnpaidInvoiceList() {
  const dispatch = useDispatch();
  const token = useSelector(state => state.auth.token);

  const columns = [
    {
      'title': 'Mã nhà phân phối',
      render: rowData => <Link
        to={'/distributor-unpaid-invoice-detail/' + rowData['partyId']}>{rowData['distributorCode']}</Link>
    },
    {'title': 'Khách hàng', field: 'distributorName'},
    {'title': 'Tổng nợ', field: 'totalUnpaid'},
  ];

  const [dataTable, setDataTable] = useState([]);

  async function getDataTable() {
    let response = await authGet(dispatch, token, '/get-unpaid-invoices-group-by-distributor-id');
    setDataTable(response);
  }

  useEffect(() => {
    getDataTable().then(r => r);
  }, []);

  return <div>
    <InvoiceDataTable
      title={'Danh sách công nợ của nhà phân phối'}
      columns={columns}
      dataTable={dataTable}
    />
  </div>;
}

export function DistributorUnpaidInvoiceDetail() {
  const dispatch = useDispatch();
  const token = useSelector(state => state.auth.token);
  const {partyDistributorId} = useParams();

  const columns = [
    {'title': 'Mã Hóa đơn', field: 'invoiceId'},
    {'title': 'Ngày hóa đơn', field: 'invoiceDate'},
    {'title': 'Tổng nợ', render: rowData => rowData['amount'] - rowData['paidAmount']},
  ];

  const [infos, setInfos] = useState([]);

  const [dataTable, setDataTable] = useState([]);

  async function getDataTable() {
    let response = await authGet(dispatch, token, '/get-unpaid-invoice-by-distributor-id/' + partyDistributorId);
    setDataTable(response);

    setInfos([
      {title: 'Nhà phân phối', content: response['distributorName']}
    ])
  }

  useEffect(() => {
    getDataTable().then(r => r);
  }, []);

  return <div>
    <InvoiceDataTable
      title={'Chi tiết công nợ của nhà phân phối'}
      columns={columns}
      dataTable={dataTable}
      infos={infos}
    />
  </div>;
}

function InvoiceDataTable(props) {

  const {title, tableTitle = '', infos = [], actions = [], columns = [], dataTable = []} = props;

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
        {actions.map(value => <div>{value}</div>)}
      </Grid>
    </Grid>
    <MaterialTable columns={columns} data={dataTable} title={tableTitle} options={{search: false}}/>
  </div>;
}

