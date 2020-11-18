import React, {useEffect, useState} from "react";
import MaterialTable from "material-table";
import {useDispatch, useSelector} from "react-redux";
import {API_URL} from "../../config/config";
import {Link} from "react-router-dom";
function LakeListAll(props) {

  const dispatch = useDispatch();
  const token = useSelector(state => state.auth.token);

  const [lakes, setLakes] = useState([]);

  const columns = [
    {  
        field: 'lakeId', 
        title: 'Mã hồ đập',
        render: rowData => (
            <Link to={'/lake/info/' + rowData['lakeId']}>{rowData['lakeId']}</Link>)
    },
    {
        field: 'lakeName', 
        title: 'Tên hồ đập'
    }
  ];
  const requestOptionsGet = {
    method: 'GET',
    headers: {'Content-Type': 'application/json', "X-Auth-Token": token}
  };

  function getLakeList() {
    //console.log("getDepartmentList....");
    fetch(API_URL + '/get-all-lakes', requestOptionsGet)
      .then(response => response.json())
      .then(response => {
        /*
        console.log(response);
        let arr = [];
        response.forEach(d => {
          arr.push(d);
        });
        setLakes(arr);
        //console.log('getDepartmentList = ',departments);
        */
       setLakes(response);
      },
      error => {
        setLakes([]);
      }
      );
  }

  useEffect(() => {
    getLakeList();
  }, []);

  return (
    <div>
      <MaterialTable
        options={{search: true}} title={"Danh sách tất cả hồ đập"}
        columns={columns}
        data={lakes}
      />
    </div>

  );
}

export default LakeListAll;
