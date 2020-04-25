import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { authGet, authGetImg } from "../../api";
import Toolbar from "@material-ui/core/Toolbar";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import MaterialTable from "material-table";

function DistributorDetail(props){
    const {partyId} = useParams();
    const token = useSelector((state) => state.auth.token);
    const dispatch = useDispatch();
    const [distributorDetail, setDistributorDetail] = useState({});

    const columns = [
        {field:"retailOutletName", title: "ten dai li ban le"},
        {field:"salesmanName", title: "ten nhan vien ban hang"},
    ];

    function getDistributorDetail(){
        //let distributorDetail = authGet(dispatch, token, "/distributor/" + partyId);
        authGet(dispatch, token, "/distributor/" + partyId).then(
            res => {
              setDistributorDetail(res);
              console.log("detail",res);    
            },
            error => {
              setDistributorDetail({});
            }
          );
    }
    useEffect(() => {
        getDistributorDetail();
    }, []);

    return(
        <div>
           <Card>
               <CardContent>
                   <Toolbar>
                    <div style={{padding: '0px 30px'}}>
                        <b>partyId: </b> {partyId} <p/>
                        <b>Tên NPP: </b> {distributorDetail === null ? '' : distributorDetail.distributorName} <p/>
                        <b>Mã NPP: </b> {distributorDetail === null ? '' : distributorDetail.distributorCode} <p/>
                    </div>
                   </Toolbar>
                   <MaterialTable
                   title="Danh sach dai li ban le"
                   columns={columns}
                   options={{
                     filtering: true,
                     search: false
                   }}
                   data={distributorDetail.retailOutletSalesmanDistributorModels}
                   >

                   </MaterialTable>
               </CardContent>
           </Card>

        </div>
    );
}

export default DistributorDetail;