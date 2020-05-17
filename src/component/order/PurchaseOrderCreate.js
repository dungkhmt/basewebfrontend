import React, {useEffect, useState} from "react";
import Grid from "@material-ui/core/Grid";
import {authGet, authPost} from "../../api";
import {useDispatch, useSelector} from "react-redux";
import {selectValueByIdName, textFieldNumberFormat} from "../../utils/FormUtils";
import AddIcon from "@material-ui/icons/Add";
import Button from "@material-ui/core/Button";
import MaterialTable from "material-table";
import {useHistory, useParams} from "react-router-dom";

export default function PurchaseOrderCreate() {
  const dispatch = useDispatch();
  const token = useSelector(state => state.auth.token);
  const history = useHistory();

  const {supplierPartyId} = useParams();

  const [supplier, setSupplier] = useState({});

  const [selectedProduct, setSelectedProduct] = useState({});
  const [productList, setProductList] = useState([]);

  const [unitPrices, setUnitPrices] = useState({});

  async function getSupplier() {
    let supplier = await authGet(dispatch, token, '/get-supplier-by-id/' + supplierPartyId);
    setSupplier(supplier);
  }

  async function getProductList() {
    let response = await authPost(dispatch, token, '/get-list-product', {}).then(r => r.json());
    setProductList(response['products']);
    setSelectedProduct(response['products'][0]);
  }

  async function getUnitPrices() {
    let productPriceSuppliers = await authGet(dispatch, token,
      '/get-all-product-price-supplier-by-supplier/' + supplierPartyId);

    let unitPrices = {};

    productPriceSuppliers.forEach(productPriceSupplier => unitPrices[productPriceSupplier['productId']] = productPriceSupplier['unitPrice']);

    setUnitPrices(unitPrices);
  }

  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    Promise.all([getSupplier(), getProductList(), getUnitPrices()]).then(r => r);
  }, []);

  const [selectedProductList,] = useState([]);
  const [, rerender] = useState([]);

  function handleAdd() {
    selectedProductList.push(Object.assign({
        quantity,
        unitPrice: unitPrices[selectedProduct['productId']],
        price: unitPrices[selectedProduct['productId']] * quantity
      },
      selectedProduct));
    rerender([]);
  }

  const columns = [
    {title: 'Mã Sản phẩm', field: 'productId'},
    {title: 'Tên sản phẩm', field: 'productName'},
    {title: 'Số lượng', field: 'quantity'},
    {title: 'Đơn giá', field: 'unitPrice'},
    {title: 'Thành tiền', field: 'price'},
  ];

  async function handleSubmit() {
    let body = {
      supplierPartyId,
      productQuantities: selectedProductList
    };
    let response = await authPost(dispatch, token, '/create-purchase-order', body).then(r => r.json());
    if (response) {
      alert('Tạo thành công');
    }
    history.push('/purchase-order/list');
  }

  return <div>
    <h2>Danh sách đơn mua</h2>

    {supplier && supplier['supplierName'] ? <div><b>Nhà cung cấp: </b>{supplier['supplierName']}</div> : ''}

    <p/>

    <Grid container spacing={3}>
      <Grid item xs={4}>
        {selectValueByIdName('Chọn sản phẩm',
          productList,
          'productId',
          'productName',
          selectedProduct,
          setSelectedProduct)}
      </Grid>
      <Grid item xs={4}>
        {textFieldNumberFormat('quantity', 'Chọn số lượng', quantity, newValue => {
          if (parseInt(newValue.replace('/[.,]/g', '')) > 0) {
            setQuantity(newValue);
          }
        })}
      </Grid>

      <Grid item xs={4}>
        <Button color={'primary'} variant={'contained'} startIcon={<AddIcon/>} onClick={handleAdd}>Thêm mới</Button>
      </Grid>
    </Grid>

    <MaterialTable columns={columns} data={selectedProductList} options={{search: false}}
                   title={'Danh sách sản phẩm đã chọn'}/>

    <Button color={'primary'} variant={'contained'} onClick={handleSubmit}>Lưu</Button>
    <Button color={'secondary'} variant={'contained'} onClick={() => history.push('/purchase-order/list')}>Hủy</Button>

  </div>;
}