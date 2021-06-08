import React, { useState } from "react";
import { textField, textFieldNumberFormat } from "../../utils/FormUtils";
import { addDays } from "date-fns";
import { dateFromThru } from "../../utils/dateutils";
import Button from "@material-ui/core/Button";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { authPost } from "../../api";

export function VoucherCreate() {
  const history = useHistory();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [fromDate, setFromDate] = useState(new Date());
  const [thruDate, setThruDate] = useState(addDays(new Date(), 30));
  const [minOrderValue, setMinOrderValue] = useState(0);
  const [minDiscountAmount, setMinDiscountAmount] = useState(0);
  const [maxDiscountAmount, setMaxDiscountAmount] = useState(50000);
  const [minDiscountRate, setMinDiscountRate] = useState(0.1);
  const [maxDiscountRate, setMaxDiscountRate] = useState(0.1);
  const [usageLimit, setUsageLimit] = useState(1000);
  const [usageLimitPerCustomer, setUsageLimitPerCustomer] = useState(5);

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
      usageLimitPerCustomer,
    };
    let voucher = await authPost(dispatch, token, "/create-voucher", body).then(
      (r) => r.json()
    );
    if (voucher && voucher["voucherId"]) {
      alert("Đã tạo thành công mã giảm giá " + voucher["code"]);
      history.push("/promo-group/voucher-list");
    } else {
      alert("Có lỗi xảy ra");
    }
  }

  return (
    <div>
      <h2>Tạo mới mã giảm giá</h2>

      {textField("code", "Mã giảm giá", "search", code, setCode)}
      {textField("description", "Mô tả", "search", description, setDescription)}

      <div>Ngày hiệu lực:</div>
      {dateFromThru(fromDate, thruDate, setFromDate, setThruDate)}

      {textFieldNumberFormat(
        "minOrderValue",
        "Giá trị đơn tối thiểu áp dụng",
        minOrderValue,
        setMinOrderValue
      )}
      {textFieldNumberFormat(
        "minDiscountAmount",
        "Giá trị giảm tối thiểu",
        minDiscountAmount,
        setMinDiscountAmount
      )}
      {textFieldNumberFormat(
        "maxDiscountAmount",
        "Giá trị giảm tối đa",
        maxDiscountAmount,
        setMaxDiscountAmount
      )}
      {textFieldNumberFormat(
        "minDiscountRate",
        "Tỉ lệ giảm tối thiểu",
        minDiscountRate,
        setMinDiscountRate
      )}
      {textFieldNumberFormat(
        "maxDiscountRate",
        "Tỉ lệ giảm tối đa",
        maxDiscountRate,
        setMaxDiscountRate
      )}
      {textFieldNumberFormat(
        "usageLimit",
        "Số lượt sử dụng tối đa",
        usageLimit,
        setUsageLimit
      )}
      {textFieldNumberFormat(
        "usageLimitPerCustomer",
        "Số lượt sử dụng tối đa mỗi khách hàng",
        usageLimitPerCustomer,
        setUsageLimitPerCustomer
      )}

      <Button
        color={"primary"}
        variant={"contained"}
        onClick={() => handleSubmit()}
      >
        Tạo mã giảm giá
      </Button>
    </div>
  );
}
