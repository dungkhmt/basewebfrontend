import React, {useEffect, useState} from "react";
import Grid from "@material-ui/core/Grid";
import {authGet} from "../../api";
import {useDispatch, useSelector} from "react-redux";
import {useParams} from "react-router-dom";
import {selectValueCallback, textField} from "../../utils/FormUtils";

export default function PaymentApplicationCreate() {
  const dispatch = useDispatch();
  const token = useSelector(state => state.auth.token);

  const {paymentId} = useParams();

  const [infos, setInfos] = useState([]);

  const [invoices, setInvoices] = useState([]);
  const [payment, setPayment] = useState([]);

  const [selectedInvoice, setSelectedInvoice] = useState({});
  const [amount, setAmount] = useState(1);


  async function getAllUnpaidInvoices() {
    let [invoices, payment] = await Promise.all([
      authGet(dispatch, token, '/get-all-unpaid-invoices'),
      authGet(dispatch, token, '/get-payment-by-id' + paymentId)]);

    setInvoices(invoices);
    setPayment(payment);

    setInfos([
      {title: 'Mã thanh toán', content: payment['paymentId']},
      {title: 'Khách hàng', content: payment['fromCustomerId']},
      {title: 'Ngày thanh toán', content: payment['effectiveDate']},
      {title: 'Giá trị', content: payment['amount']},
      {title: 'Số tiền còn lại', content: payment['amount'] - payment['appliedAmount']},
    ]);
  }

  useEffect(() => {
    getAllUnpaidInvoices().then(r => r);
  }, []);

  return <div>
    <Grid container spacing={3}>
      <h2>Khớp lệnh thanh toán</h2>
      <Grid item xs={8} style={{textAlign: 'left', padding: '0px 30px 20px 30px'}}>
        {infos.map(value => (
          <div><b>{value['title'] + ': '} </b> {value['content']} <p/></div>
        ))}
      </Grid>
      <Grid item xs={4}
            style={{verticalAlign: 'text-bottom', textAlign: 'right', padding: '0px 50px 10px 30px'}}>
      </Grid>

      {selectValueCallback('invoice',
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
    </Grid>
  </div>;
}