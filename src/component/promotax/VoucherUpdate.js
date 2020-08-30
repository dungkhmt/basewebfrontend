import React, {useEffect, useState} from "react";
import {textField, textFieldNumberFormat} from "../../utils/FormUtils";
import {addDays} from 'date-fns'
import {dateFromThru} from "../../utils/dateutils";
import Button from "@material-ui/core/Button";
import {useHistory, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {authGet, authPost} from "../../api";

export function VoucherUpdate() {

  const history = useHistory();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  const {voucherId} = useParams();

  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [fromDate, setFromDate] = useState(new Date());
  const [thruDate, setThruDate] = useState(addDays(new Date(), 30));
  const [minOrderValue, setMinOrderValue] = useState(0);
  const [minDiscountAmount, setMinDiscountAmount] = useState(0);
  const [maxDiscountAmount, setMaxDiscountAmount] = useState(50000);
  const [minDiscountRate, setMinDiscountRate] = useState(0.1);
  const [maxDiscountRate, setMaxDiscountRate] = useState(0.1);
  const [usageLimit, setUsageLimit] = useState(1000);
  const [usageLimitPerCustomer, setUsageLimitPerCustomer] = useState(5);

  useEffect(() => {
    getVoucher().then(r => r);
  }, []);

  async function getVoucher() {
    let voucher = await authGet(dispatch, token, `/get-voucher/${voucherId}`);
    if (voucher) {
      setCode(voucher['code']);
      setDescription(voucher['description']);
      setFromDate(voucher['fromDate']);
      setThruDate(voucher['thruDate']);
      setMinOrderValue(voucher['minOrderValue']);
      setMinDiscountAmount(voucher['minDiscountAmount']);
      setMaxDiscountAmount(voucher['maxDiscountAmount']);
      setMinDiscountRate(voucher['minDiscountRate']);
      setMaxDiscountRate(voucher['maxDiscountRate']);
      setUsageLimit(voucher['usageLimit']);
      setUsageLimitPerCustomer(voucher['usageLimitPerCustomer']);
    }
  }

  async function handleSubmit() {
    const body = {
      code,
      description,
      fromDate,
      thruDate,
      minOrderValue,
      minDiscountAmount,
      maxDiscountAmount,
      minDiscountRate,
      maxDiscountRate,
      usageLimit,
      usageLimitPerCustomer
    };
    let voucher = await authPost(dispatch, token, `/update-voucher/${voucherId}`, body).then(r => r.json());
    if (voucher && voucher['voucherId']) {
      alert('Đã cập nhật thành công mã giảm giá ' + voucher['code']);
      history.push('/promo-group/voucher-list');
    } else {
      alert('Có lỗi xảy ra');
    }
  }

  return (<div>
    <h2>Cập nhật mã giảm giá</h2>

    {textField('code', 'Mã giảm giá', 'search', code, setCode, true)}
    {textField('description', 'Mô tả', 'search', description, setDescription)}

    <div>Ngày hiệu lực:</div>
    {dateFromThru(fromDate, thruDate, setFromDate, setThruDate)}

    {textFieldNumberFormat('minOrderValue', 'Giá trị đơn tối thiểu áp dụng', minOrderValue, setMinOrderValue)}
    {textFieldNumberFormat('minDiscountAmount', 'Giá trị giảm tối thiểu', minDiscountAmount, setMinDiscountAmount)}
    {textFieldNumberFormat('maxDiscountAmount', 'Giá trị giảm tối đa', maxDiscountAmount, setMaxDiscountAmount)}
    {textFieldNumberFormat('minDiscountRate', 'Tỉ lệ giảm tối thiểu', minDiscountRate, setMinDiscountRate)}
    {textFieldNumberFormat('maxDiscountRate', 'Tỉ lệ giảm tối đa', maxDiscountRate, setMaxDiscountRate)}
    {textFieldNumberFormat('usageLimit', 'Số lượt sử dụng tối đa', usageLimit, setUsageLimit)}
    {textFieldNumberFormat(
      'usageLimitPerCustomer',
      'Số lượt sử dụng tối đa mỗi khách hàng',
      usageLimitPerCustomer,
      setUsageLimitPerCustomer)}

    <Button color={'primary'} variant={'contained'} onClick={() => handleSubmit()}>Cập nhật mã giảm giá</Button>
  </div>);
}
