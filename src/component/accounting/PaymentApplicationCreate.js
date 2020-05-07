import React, {useEffect, useState} from "react";
import Grid from "@material-ui/core/Grid";
import {authGet, authPost} from "../../api";
import {useDispatch, useSelector} from "react-redux";
import {useHistory, useParams} from "react-router-dom";
import {selectValueCallback, textField} from "../../utils/FormUtils";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import Button from "@material-ui/core/Button";

export default function PaymentApplicationCreate() {
  const dispatch = useDispatch();
  const token = useSelector(state => state.auth.token);
  const history = useHistory();

  const {paymentId} = useParams();

  const [infos, setInfos] = useState([]);

  const [invoices, setInvoices] = useState([]);
  const [payment, setPayment] = useState([]);

  const [selectedInvoice, setSelectedInvoice] = useState({});
  const [amount, setAmount] = useState(1);


  async function getAllUnpaidInvoices() {
    let [invoices, payment] = await Promise.all([
      authGet(dispatch, token, '/get-all-unpaid-invoices'),
      authGet(dispatch, token, '/get-payment-by-id/' + paymentId)]);

    setInvoices(invoices);
    setPayment(payment);

    setInfos([
      {title: 'Mã thanh toán', content: payment['paymentId']},
      {title: 'Khách hàng', content: payment['fromCustomerId']},
      {title: 'Ngày thanh toán', content: payment['effectiveDate']},
      {title: 'Giá trị', content: payment['amount']},
      {title: 'Số tiền còn lại', content: payment['amount'] - payment['appliedAmount']},
    ]);

    setSelectedInvoice(invoices[0]);
  }

  useEffect(() => {
    getAllUnpaidInvoices().then(r => r);
  }, []);

  async function handleSubmit() {
    let body = {
      paymentId,
      invoiceId: selectedInvoice['invoiceId'],
      amount
    };
    let response = await authPost(dispatch, token, '/create-payment-application', body).then(r => r.json());
    if (response && response['paymentApplicationId']) {
      alert('Tạo thành công mã khớp lệnh thanh toán: ' + response['paymentApplicationId']);
    }
    history.push('/payment-application/' + paymentId);
  }

  return <div>
    <h2>Khớp lệnh thanh toán</h2>
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

    {selectValueCallback('Chọn hóa đơn',
      invoices,
      e => e['invoiceId'] + ' (Chưa thanh toán ' + (e['amount'] - e['paidAmount']) + ')',
      selectedInvoice,
      newValue => {
        setSelectedInvoice(newValue);
        setAmount(1);
      }
    )}

    {textField('amount', 'Số tiền thanh toán', 'number', amount, newAmount => {
      if (newAmount > 0 && newAmount < Math.max(payment['amount'] - payment['appliedAmount'],
        selectedInvoice['amount'] - selectedInvoice['paidAmount'])) {
        setAmount(newAmount);
      }
    })}

    <Button variant="contained" color="primary" startIcon={<CloudUploadIcon/>} onClick={handleSubmit}>
      Save
    </Button>
  </div>;
}