// same voucher rule list
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { authGet } from "../../api";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { dateFnFormat } from "../../utils/dateutils";
import { currencyFormat } from "../../utils/NumberFormat";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import MaterialTable from "material-table";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";

export function VoucherDetail() {
  const history = useHistory();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  const { voucherId } = useParams();

  const [voucher, setVoucher] = useState({});

  async function getVoucher() {
    let voucher = await authGet(dispatch, token, `/get-voucher/${voucherId}`);
    setVoucher(voucher);
  }

  useEffect(() => {
    getVoucher().then((r) => r);
  }, []);

  const [voucherRuleColumns] = useState([
    {
      field: "type",
      title: "Loại",
      render: (rowData) =>
        rowData["type"] === "APPLY" ? "Áp dụng" : "Không áp dụng",
    },
    { field: "productId", title: "Mã sản phẩm áp dụng" },
    { field: "productCategoryId", title: "Nhóm sản phẩm áp dụng" },
    {
      field: "productTransportCategoryId",
      title: "Phương thức vận chuyển áp dụng",
    },
    { field: "vendorCode", title: "Mã nhà cung cấp áp dụng" },
    { field: "vendorCategoryId", title: "Nhóm nhà cung cấp áp dụng" },
    { field: "customerCode", title: "Mã khách hàng áp dụng" },
    { field: "customerCategoryId", title: "Nhóm khách hàng áp dụng" },
    { field: "paymentMethod", title: "Phương thức thanh toán áp dụng" },
    { field: "createdDate", title: "Ngày tạo" },
    {
      title: "",
      render: (rowData) => (
        <div>
          <Button
            variant={"contained"}
            color={"primary"}
            startIcon={<EditIcon />}
            onClick={() =>
              history.push(
                `/promo-group/edit-voucher-rule/${voucherId}/${rowData["voucherRuleId"]}`
              )
            }
          />
          <Button
            variant={"contained"}
            color={"primary"}
            startIcon={<DeleteIcon />}
            onClick={() => {
              if (window.confirm(`Xác nhận xóa?`)) {
                authGet(
                  dispatch,
                  token,
                  `/delete-voucher-rule/${rowData["voucherRuleId"]}`
                ).then((r) => {
                  window.location.reload();
                });
              }
            }}
          />
        </div>
      ),
    },
  ]);

  function handleAdd() {
    history.push(`/promo-group/create-voucher-rule/${voucherId}`);
  }

  async function getVoucherRules(pageNumber, pageSize) {
    let voucherRulePage = await authGet(
      dispatch,
      token,
      `/get-voucher-rule-page/${voucherId}?page=${pageNumber}&size=${pageSize}&sort=createdDate,desc`
    );
    return {
      data: voucherRulePage["content"],
      page: voucherRulePage["number"],
      totalCount: voucherRulePage["totalElements"],
    };
  }

  return (
    <div>
      <h2>Chi tiết mã giảm giá {voucher["code"]}</h2>

      <table style={{ width: "100%", border: "0px" }}>
        <tr>
          <td style={{ width: "50%" }}>
            <table style={{ width: "100%", border: "0px" }}>
              <tr>
                <td style={{ width: "30%" }} />
                <td style={{ width: "70%" }} />
              </tr>
              <tr>
                <td>Mô tả:</td>
                <td>
                  <b>{voucher["description"]}</b>
                </td>
              </tr>
              <tr>
                <td>Ngày hiệu lực:</td>
                <td>
                  <b>
                    {voucher["fromDate"]
                      ? dateFnFormat(
                          new Date(voucher["fromDate"]),
                          "yyyy-MM-dd"
                        )
                      : ""}
                  </b>
                </td>
              </tr>
              <tr>
                <td>Ngày kết thúc:</td>
                <td>
                  <b>
                    {voucher["thruDate"]
                      ? dateFnFormat(
                          new Date(voucher["thruDate"]),
                          "yyyy-MM-dd"
                        )
                      : ""}
                  </b>
                </td>
              </tr>
              <tr>
                <td>Ngày tạo:</td>
                <td>
                  <b>
                    {voucher["createdDate"]
                      ? dateFnFormat(
                          new Date(voucher["createdDate"]),
                          "yyyy-MM-dd"
                        )
                      : ""}
                  </b>
                </td>
              </tr>
              <tr>
                <td>Giá trị giảm tối thiểu:</td>
                <td>
                  <b>{currencyFormat(voucher["minDiscountAmount"])}</b>
                </td>
              </tr>
              <tr>
                <td>Giá trị giảm tối đa:</td>
                <td>
                  <b>{currencyFormat(voucher["maxDiscountAmount"])}</b>
                </td>
              </tr>
            </table>
          </td>
          <td style={{ width: "50%" }}>
            <table style={{ width: "100%", border: "0px" }}>
              <tr>
                <td style={{ width: "30%" }} />
                <td style={{ width: "70%" }} />
              </tr>
              <tr>
                <td>Tỉ lệ giảm tối thiểu:</td>
                <td>
                  <b>{voucher["minDiscountRate"]}</b>
                </td>
              </tr>
              <tr>
                <td>Tỉ lệ giảm tối đa:</td>
                <td>
                  <b>{voucher["maxDiscountRate"]}</b>
                </td>
              </tr>
              <tr>
                <td>Đơn tối thiểu:</td>
                <td>
                  <b>{currencyFormat(voucher["minOrderValue"])}</b>
                </td>
              </tr>
              <tr>
                <td>Số lần sử dụng:</td>
                <td>
                  <b>{voucher["usageLimit"]}</b>
                </td>
              </tr>
              <tr>
                <td>Số lần sử dụng từng khách:</td>
                <td>
                  <b>{voucher["usageLimitPerCustomer"]}</b>
                </td>
              </tr>
              <tr>
                <td>Số lần đã sử dụng:</td>
                <td>
                  <b>{voucher["usageCount"]}</b>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>

      <div style={{ textAlign: "right" }}>
        <Button
          color={"primary"}
          variant={"contained"}
          startIcon={<AddIcon />}
          onClick={handleAdd}
        >
          Thêm mới
        </Button>
      </div>
      <div>
        <MaterialTable
          columns={voucherRuleColumns}
          data={(query) => getVoucherRules(query.page, query.pageSize)}
          title={"Danh sách các quy tắc cho mã giảm giá"}
          options={{ search: false }}
        />
      </div>
    </div>
  );
}
