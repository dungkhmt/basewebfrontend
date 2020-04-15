import React, {useState} from "react";
import Upload from "../../../utils/Upload";
import MaterialTable from "material-table";
import Directions from "../../google/Directions";
import {parseLatLng} from "../../../utils/MapUtils";

export default function ItemDelivery() {

  const columns = [
    {field: 'collectorCode', title: 'Mã bưu tá'},
    {title: 'Số điểm giao', render: rowData => rowData['points'].length},
    {field: 'totalDistance', title: 'Tổng khoảng cách (m)'},
    {field: 'totalTime', title: 'Tổng thời gian (s)'},
    {field: 'totalWeight', title: 'Tổng khối lượng (g)'},
  ];

  const [dataTable, setDataTable] = useState([]);

  return <div>

    <Upload
      fullUrl={'http://localhost:8081/postsystem/delivery/upload-input'}
      buttonTitle={'Upload input'}
      handleSaveCallback={response => {
        setDataTable(response['routes'])
      }}
    />

    <MaterialTable columns={columns} data={dataTable} options={{search: false}}/>

    <Directions
      routes={dataTable.map(route => {
        let postLatLng = parseLatLng(route['postLatLng']);
        return {
          post: {
            label: route['postCode'],
            title: route['postCode'],
            lat: postLatLng[0],
            lng: postLatLng[1]
          },
          items: route['points'].map(point => {
            let latLng = parseLatLng(point['latLng']);
            return {
              label: point['locationCode'],
              title: point['locationCode'],
              lat: latLng[0],
              lng: latLng[1]
            };
          })
        };
      })}
    />

  </div>

}