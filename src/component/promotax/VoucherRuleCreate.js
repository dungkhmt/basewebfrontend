import React, { useState } from "react";
import { selectValueCallback, textField } from "../../utils/FormUtils";
import Button from "@material-ui/core/Button";
import { useHistory, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { authPost } from "../../api";

const TYPE_LIST = [
  { code: "APPLY", text: "Áp dụng" },
  { code: "DO_NOT_APPLY", text: "Không áp dụng" },
];

export function VoucherRuleCreate() {
  const history = useHistory();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  const { voucherId } = useParams();

  const [type, setType] = useState(TYPE_LIST[0]);
  const [productId, setProductId] = useState("");
  const [productCategoryId, setProductCategoryId] = useState("");
  const [productTransportCategoryId, setProductTransportCategoryId] =
    useState("");
  const [vendorCode, setVendorCode] = useState("");
  const [vendorCategoryId, setVendorCategoryId] = useState("");
  const [customerCode, setCustomerCode] = useState("");
  const [customerCategoryId, setCustomerCategoryId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");

  async function handleSubmit() {
    const body = {
      type: type["code"],
      productId,
      productCategoryId,
      productTransportCategoryId,
      vendorCode,
      vendorCategoryId,
      customerCode,
      customerCategoryId,
      paymentMethod,
    };
    let voucherRule = await authPost(
      dispatch,
      token,
      `/create-voucher-rule/${voucherId}`,
      body
    ).then((r) => r.json());
    if (voucherRule && voucherRule["voucherRuleId"]) {
      alert("Đã tạo thành công quy tắc cho mã giảm giá.");
      history.push(`/promo-group/voucher-detail/${voucherId}`);
    } else {
      alert("Có lỗi xảy ra");
    }
  }

  return (
    <div>
      <h2>Tạo mới quy tắc mã giảm giá</h2>

      {selectValueCallback(
        "Chọn hình thức",
        TYPE_LIST,
        (e) => e["text"],
        type,
        setType
      )}
      {textField("productId", "Mã sản phẩm áp dụng", productId, setProductId)}
      {textField(
        "productCategoryId",
        "Nhóm sản phẩm áp dụng",
        "search",
        productCategoryId,
        setProductCategoryId
      )}
      {textField(
        "productTransportCategoryId",
        "Phương thức vận chuyển áp dụng",
        "search",
        productTransportCategoryId,
        setProductTransportCategoryId
      )}
      {textField(
        "vendorCode",
        "Mã nhà cung cấp áp dụng",
        "search",
        vendorCode,
        setVendorCode
      )}
      {textField(
        "vendorCategoryId",
        "Nhóm nhà cung cấp áp dụng",
        "search",
        vendorCategoryId,
        setVendorCategoryId
      )}
      {textField(
        "customerCode",
        "Mã khách hàng áp dụng",
        "search",
        customerCode,
        setCustomerCode
      )}
      {textField(
        "customerCategoryId",
        "Nhóm khách hàng áp dụng",
        "search",
        customerCategoryId,
        setCustomerCategoryId
      )}
      {textField(
        "paymentMethod",
        "Phương thức thanh toán áp dụng",
        "search",
        paymentMethod,
        setPaymentMethod
      )}

      <Button
        color={"primary"}
        variant={"contained"}
        onClick={() => handleSubmit()}
      >
        Tạo quy tắc
      </Button>
    </div>
  );
}
