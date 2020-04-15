import React from "react";
import MaterialTable from "material-table";
import {authGet} from "../../../api";
import {tableIcons} from "../../../utils/iconutil";
import {useDispatch, useSelector} from "react-redux";
import {Link} from "react-router-dom";

export default function DeliveryPlanList() {

  const dispatch = useDispatch();
  const token = useSelector(state => state.auth.token);
  const columns = [
    {
      title: "Mã đợt giao hàng",
      field: "deliveryPlanId",
      render: rowData => <Link to={'/delivery-plan/' + rowData['deliveryPlanId']}>{rowData['deliveryPlanId']}</Link>
    },
    {title: "Mô tả", field: "description"},
    {title: "Tài khoản tạo", field: "createdByUserLoginId"},
    {title: "Ngày tạo", field: "deliveryDate", type: 'date'},
    {title: "Số chuyến", field: "numberTrips"},
    {title: "Tổng khối lượng (kg)", field: "totalWeight"},
    {title: "Tổng khối lượng đã xếp chuyến (kg)", field: "totalWeightScheduled"},
  ];

  return <div>
    <MaterialTable
      title="Danh sách đợt giao hàng"
      columns={columns}
      options={{
        search: false
      }}
      data={query =>
        new Promise(async resolve => {
          console.log(query);
          let sortParam = "";
          if (query.orderBy !== undefined) {
            sortParam = "&sort=" + query.orderBy.field + ',' + query.orderDirection;
          }
          let response = await authGet(dispatch, token,
            "/delivery-plan" + "?size=" + query.pageSize + "&page=" + query.page + sortParam);

          let [shipmentItems, deliveryTrips] = await Promise.all(
            [Promise.all(response.content.map(deliveryPlan =>
              authGet(dispatch, token, "/shipment-item-delivery-plan/" + deliveryPlan['deliveryPlanId'] + "/all"))),

              Promise.all(response.content.map(deliveryPlan =>
                authGet(dispatch, token, "/delivery-trip/" + deliveryPlan['deliveryPlanId'] + "/all")))]);

          for (let i = 0; i < response.content.length; i++) {
            let deliveryPlan = response.content[i];
            deliveryPlan['numberTrips'] = deliveryTrips[i].length;
            let totalWeight = 0;
            let totalWeightScheduled = 0;
            shipmentItems[i].forEach(shipmentItem => totalWeight += shipmentItem['weight']);
            deliveryTrips[i].forEach(deliveryTrip => totalWeightScheduled += deliveryTrip['totalWeight']);

            totalWeight = Math.round(totalWeight * 100000) / 100;
            totalWeightScheduled = Math.round(totalWeightScheduled * 100000) / 100;

            deliveryPlan['totalWeight'] = totalWeight;
            deliveryPlan['totalWeightScheduled'] = totalWeightScheduled;
          }

          resolve({data: response.content, page: response.number, totalCount: response.totalElements})
        })
      }
      icons={tableIcons}

    />
  </div>
}