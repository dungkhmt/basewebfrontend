import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import MaterialTable from "material-table";
import {authGet, authPost} from "../../api";
import {selectValueByIdName, textFieldNumberFormat} from "../../utils/FormUtils";
import Button from "@material-ui/core/Button";

export default function ProductPriceSupplier() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  const columns = [
    {title: 'Mã sản phẩm', field: 'productId'},
    {title: 'Tên sản phẩm', field: 'productName'},
    {title: 'Đơn giá', field: 'unitPrice'},
  ];

  const [productPriceSupplierList, setProductPriceSupplierList] = useState([]);
  const [supplierList, setSupplierList] = useState([]);
  const [productList, setProductList] = useState([]);

  const [selectedSupplier, setSelectedSupplier] = useState({});
  const [selectedProduct, setSelectedProduct] = useState({});

  const [unitPrice, setUnitPrice] = useState(1);

  async function getProductPriceSupplierList() {
    let productPriceSupplier = await authGet(dispatch,
      token,
      "/get-all-product-price-supplier-by-supplier/" + selectedSupplier['partyId']);
    setProductPriceSupplierList(productPriceSupplier);
  }

  async function getSupplierList() {
    let supplierList = await authGet(dispatch, token, '/get-all-supplier');
    setSupplierList(supplierList);
    setSelectedSupplier(supplierList[0]);
  }

  async function getProductList() {
    let productList = await authPost(dispatch, token, '/get-list-product', {}).then(r => r.json());
    setProductList(productList['products']);
    setSelectedProduct(productList['products'][0]);
  }

  useEffect(() => {
    if (selectedSupplier['partyId']) {
      getProductPriceSupplierList().then(r => r);
    }
  }, [selectedSupplier]);

  useEffect(() => {
    Promise.all([
      getSupplierList().then(r => r),
      getProductList().then(r => r),
    ]).then(r => r);
  }, []);

  async function handleSubmit() {
    let body = {supplierPartyId: selectedSupplier['partyId'], productId: selectedProduct['productId'], unitPrice};
    let productPriceSupplier = await authPost(dispatch, token, '/set-product-price-supplier', body).then(r => r.json());
    if (productPriceSupplier && productPriceSupplier['productPriceSupplierId']) {
      alert('Đã thiết lập thành công giá, productPriceSupplierId = ' + productPriceSupplier['productPriceSupplierId']);
    }
    await getProductPriceSupplierList();
  }

  return (<div>
    <h2>Danh sách giá mua</h2>

    {selectValueByIdName('Chọn nhà cung cấp',
      supplierList,
      'supplierCode',
      'supplierName',
      selectedSupplier,
      setSelectedSupplier)}

    {selectValueByIdName('Chọn sản phẩm',
      productList,
      'productId',
      'productName',
      selectedProduct,
      setSelectedProduct)}

    {textFieldNumberFormat('unitPrice', 'Giá nhà cung cấp', unitPrice, newUnitPrice => {
      if (parseInt(newUnitPrice.replace('/[.,]/g', '')) > 0) {
        setUnitPrice(newUnitPrice);
      }
    })}

    <Button color={'primary'} variant={'contained'} onClick={handleSubmit}>Thiết lập giá</Button>

    <MaterialTable columns={columns}
                   data={productPriceSupplierList}
                   title={'Danh sách giá mua sản phẩm'}
                   options={{search: false}}/>
  </div>);
}