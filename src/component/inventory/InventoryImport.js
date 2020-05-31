import React, {useEffect, useState} from "react";
import Grid from "@material-ui/core/Grid";
import {authGet, authPost} from "../../api";
import {useDispatch, useSelector} from "react-redux";
import {selectValueByIdName, textFieldNumberFormat} from "../../utils/FormUtils";
import AddIcon from "@material-ui/icons/Add";
import Button from "@material-ui/core/Button";
import MaterialTable from "material-table";
import {useHistory} from "react-router-dom";

export default function InventoryImport() {
  const dispatch = useDispatch();
  const token = useSelector(state => state.auth.token);
  const history = useHistory();

  const [facilityList, setFacilityList] = useState([]);
  const [selectedFacility, setSelectedFacility] = useState({});

  async function getAllFacility() {
    let response = await authGet(dispatch, token, '/facility/all');
    setFacilityList(response);
    setSelectedFacility(response[0]);
  }

  const [selectedProduct, setSelectedProduct] = useState({});
  const [productList, setProductList] = useState([]);

  async function getProductList() {
    let response = await authPost(dispatch, token, '/get-list-product', {}).then(r => r.json());
    setProductList(response['products']);
    setSelectedProduct(response['products'][0]);
  }

  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    Promise.all([getAllFacility(), getProductList()]).then(r => r);
  }, []);

  const [selectedProductList,] = useState([]);
  const [, rerender] = useState([]);

  function handleAdd() {
    selectedProductList.push(Object.assign({quantity}, selectedProduct));
    rerender([]);
  }

  const columns = [
    {title: 'Mã Sản phẩm', field: 'productId'},
    {title: 'Tên sản phẩm', field: 'productName'},
    {title: 'Số lượng', field: 'quantity'},
  ];

  async function handleSubmit() {
    let body = {
      inventoryItems: selectedProductList.map(value => ({
        productId: value['productId'],
        facilityId: selectedFacility['facilityId'],
        quantityOnHandTotal: value['quantity']
      }))
    };
    let response = await authPost(dispatch, token, '/import-inventory-items', body).then(r => r.json());
    if (response === 'ok') {
      alert('Import successful');
    }
    history.push('/inventory/list');
  }

  return <div>
    <h2>Tạo mới nhập kho</h2>

    {selectValueByIdName('Chọn kho', facilityList, 'facilityId', 'facilityName', selectedFacility, setSelectedFacility)}

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
    <Button color={'secondary'} variant={'contained'} onClick={() => history.push('/inventory/list')}>Hủy</Button>

  </div>;
}
