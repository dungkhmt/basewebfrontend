import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useHistory, useParams} from "react-router-dom";
import {authGet, authPost} from "../../api";
import {textFieldNumberFormat} from "../../utils/FormUtils";
import Button from "@material-ui/core/Button";

export default function QuickInvoicePayment() {
  const dispatch = useDispatch();
  const token = useSelector(state => state.auth.token);
  const history = useHistory();

  const {invoiceId} = useParams();

  const [invoice, setInvoice] = useState({});
  const [amount, setAmount] = useState(1);

  async function getInvoice() {
    let invoice = await authGet(dispatch, token, '/get-invoice-by-id/' + invoiceId);
    setInvoice(invoice);

    setAmount(invoice['amount'] - invoice['paidAmount'])
  }

  useEffect(() => {
    getInvoice().then(r => r);
  }, []);

  async function handleSubmit() {
    let body = {invoiceId, amount};
    let response = await authPost(dispatch, token, '/create-payment-application', body).then(r => r.json())
    if (response && response['paymentApplicationId']) {
      alert('Đã tạo khớp lệnh thanh toán thành công, paymentApplicationId = ' + response['paymentApplicationId']);
    }
    history.push('/invoice-detail/' + invoiceId);
  }

  return (<div>
    <h2>Thanh toán</h2>

    {textFieldNumberFormat('amount', 'Nhập số tiền: ', amount, newAmount => {
      if (parseInt(newAmount.replace('/[.,]/g', '')) >= (invoice['amount'] - invoice['paidAmount'] || 1)) {
        setAmount(newAmount);
      }
    })}
    <Button color={'primary'} variant={'contained'} onClick={handleSubmit}>Xác nhận</Button>
    <Button color={'secondary'} variant={'contained'}
            onClick={() => history.push('/invoice-detail/' + invoiceId)}>Hủy</Button>
  </div>);
}