import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useHistory, useParams} from "react-router-dom";
import {authGet, authPost} from "../../api";
import Button from "@material-ui/core/Button";
import {textFieldNumberFormat} from "../../utils/FormUtils";
import {dateFromThru, getDateFromNowPlus, toFormattedDateTime} from "../../utils/dateutils";

export default function ProductPriceCreate() {
  const dispatch = useDispatch();
  const token = useSelector(state => state.auth.token);
  const history = useHistory();

  const {productId} = useParams();

  const [product, setProduct] = useState({});

  const [fromDate, setFromDate] = useState(new Date());
  const [thruDate, setThruDate] = useState(getDateFromNowPlus(1, 0, 0));
  const [price, setPrice] = useState(1);

  async function getProduct() {
    let product = await authGet(dispatch, token, '/product/' + productId);
    setProduct(product);
  }

  useEffect(() => {
    getProduct().then(r => r);
  }, []);

  async function handleSubmit() {
    let body = {productId, fromDate: toFormattedDateTime(fromDate), thruDate: toFormattedDateTime(thruDate), price};
    let response = await authPost(dispatch, token, '/set-product-price', body).then(r => r.json());
    if (response && response['productPriceId']) {
      alert('Đã tạo thành công giá với mã: ' + response['productPriceId']);
    }
    history.push('/product/' + productId);
  }

  return (<div>
    <h2>Chi tiết sản phẩm</h2>

    <p><b>Mã sản phẩm: </b> {productId}</p>
    <p><b>Tên sản phẩm: </b> {product ? product['productName'] : ''}</p>
    <p>{dateFromThru(fromDate, thruDate, setFromDate, setThruDate)}</p>
    <p>{textFieldNumberFormat('price', 'Giá bán', price, newPrice => {
      if (parseInt(newPrice) > 0) {
        setPrice(newPrice);
      }
    })}</p>

    <Button color={'primary'} variant={'contained'} onClick={handleSubmit}>Lưu</Button>
    <Button color={'secondary'} variant={'contained'} onClick={() => history.push('/product/' + productId)}>Hủy</Button>

  </div>);
}
