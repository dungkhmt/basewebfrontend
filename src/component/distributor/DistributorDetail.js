import React, { useEffect, useState, Fragment} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { authGet, authPost} from "../../api";
import { Button, TextField, MenuItem} from "@material-ui/core";
import { Link as RouterLink } from 'react-router-dom';
import Toolbar from "@material-ui/core/Toolbar";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";

import MaterialTable, { MTableToolbar } from "material-table";
import {tableIcons} from "../../utils/iconutil";

function DistributorDetail(props){
    
    const token = useSelector((state) => state.auth.token);
    const dispatch = useDispatch();
    const {partyId} = useParams();
    const [distributorDetail, setDistributorDetail] = useState({});
    const [salesmanList, setSalesmanList] = useState([])
    const [retailOutletList, setRetailOutletList] = useState([])
    const [selectedRetailOutlet, setSelectedRetailOutlet] = useState({retailOutletName: ''})
    const [selectedSalesman, setSelectedSalesman] = useState({userLoginId: ''})

    const requestGetOption = {
        method:'GET',
        headers: {'Content-Type': 'application/json', 'X-Auth-Token': token},
    }

    const columns = [
        {
            field:"retailOutletName", 
            title: "Đại lý bán lẻ",
              
            editComponent: () => (  <TextField
                                        id="1"
                                        select
                                        value={selectedRetailOutlet.retailOutletName}
                                        label="Đại lý bán lẻ"                                        
                                        onChange={e => setSelectedRetailOutlet({retailOutletName: e.target.value})}
                                        style={{
                                            minWidth: '12rem'
                                        }}
                                    >
                                        {retailOutletList.map(retailOutlet => (
                                            <MenuItem 
                                                key={retailOutlet.partyId}
                                                value={retailOutlet.retailOutletName}
                                            >
                                                {retailOutlet.retailOutletName}
                                            </MenuItem>
                                        ))}
                                    </TextField>)
        },
        {
            field:"salesmanName", 
            title: "Nhân viên bán hàng",
            editComponent: () => (  <TextField
                                        id="2"
                                        select
                                        value={selectedSalesman.userLoginId}
                                        label="Nhân viên bán hàng"                                        
                                        onChange={e => setSelectedSalesman({userLoginId: e.target.value})}
                                        style={{
                                            minWidth: '12rem'
                                        }}
                                    >
                                        {salesmanList.map(salesman => (
                                            <MenuItem 
                                                key={salesman.partySalesman.partyId}
                                                value={salesman.userLoginId}
                                            >
                                                {salesman.userLoginId}
                                            </MenuItem>
                                        ))}
                                    </TextField>)
        },
    ]

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

    const getSalesmanList = () => {
        authGet(dispatch, token, "/get-all-salesman").then(
            res => {
              setSalesmanList(res);
              console.log("List of salesman",res);    
            },
            error => {
              setSalesmanList({});
            }
          );
    }
    
    const getRetailOutletList = () => {
        authGet(dispatch, token, "/get-all-retail-outlet").then(
            res => {
                setRetailOutletList(res);
                console.log("List of retail outlet",res);    
            },
            error => {
              setRetailOutletList();
            }
          );
    }

    useEffect(() => {
        getDistributorDetail();
        getSalesmanList();
        getRetailOutletList();
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
                        title="Danh sách đại lý bán lẻ"
                        columns={columns}
                        data={distributorDetail.retailOutletSalesmanDistributorModels}
                        icons={tableIcons}
                        options={{
                            //filtering: true,
                            actionsColumnIndex: -1
                        }}
                        // components={{
                        //     Toolbar: props => (
                        //         <div>
                        //             <MTableToolbar {...props} />
                        //             <Button
                        //                 variant='contained'
                        //                 color='primary'
                        //                 style={{
                        //                     marginLeft: '25px'
                        //                 }}
                        //                 size='small'
                        //                 component={RouterLink}
                        //                 to='/distributor/create'
                        //             >
                        //                 THÊM
                        //             </Button>
                        //         </div>
                        //     ),
                        // }}
                        editable={{
                            onRowAdd: (newData) =>
                                new Promise((resolve) => {
                                    const retailOutlet = retailOutletList.find(retailOutlet => retailOutlet.retailOutletName === selectedRetailOutlet.retailOutletName)
                                    const salesman = salesmanList.find(salesman => salesman.userLoginId === selectedSalesman.userLoginId)                       
                                    
                                    const inputModel = {
                                        partyRetailOutletId: retailOutlet.partyId,
                                        partySalesmanId: salesman.partySalesman.partyId,
                                        partyDistributorId: partyId,
                                    }

                                    authPost(dispatch, token, "/add-retail-outlet-distributor-salesman", inputModel)
                                    getDistributorDetail()
                                    getDistributorDetail()
                                    setSelectedRetailOutlet({retailOutletName: ''})
                                    setSelectedSalesman({userLoginId: ''})
                                    
                                    resolve()
                                }),
                                
                            onRowDelete: (oldData) =>
                                new Promise((resolve) => {
                                    fetch("http://localhost:8080/api/delete-retail-outlet-distributor-salesman/" + oldData.retailOutletSalesmanVendorId, requestGetOption)                                                                     
                                    getDistributorDetail()
                                    getDistributorDetail()
                                    
                                    resolve()
                                }),
                        }}
                    />
               </CardContent>
           </Card>

        </div>
    );
}

export default DistributorDetail;