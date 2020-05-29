import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useForm} from 'react-hook-form'
import {authGet, authPost} from "../../api";
import {Link as RouterLink, useHistory, useParams} from 'react-router-dom'

import MaterialTable, {MTableToolbar} from "material-table";
import {tableIcons} from "../../utils/iconutil";
import {Box, Card, CardContent, Typography} from "@material-ui/core";
import {useSnackbar} from "notistack";
import {IconButton} from "material-ui";
import {MuiThemeProvider} from "material-ui/styles";
import {FcRadarPlot, FcViewDetails} from 'react-icons/fc';
import {RiMenuAddLine} from 'react-icons/ri'
import {IconContext} from "react-icons/lib/cjs";

function PlanPeriod(props) {
  const history = useHistory()
  const {id} = useParams()
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();

  // Modal
  const [creationDialogOpen, setCreationDialogOpen] = useState(false)
  const [fromDate, setFromDate] = useState(new Date())
  const [toDate, setToDate] = useState(new Date())
  const {register, handleSubmit} = useForm()

  // Snackbar
  const {enqueueSnackbar} = useSnackbar()
  const anchorOrigin = {
    vertical: 'bottom',
    horizontal: 'right',
  }

  // table
  const [data, setData] = useState([]);
  const [periodDetail, setPeriodDetail] = useState({})
  const columns = [
    {
      field: "retailOutletCode",
      title: "Mã ĐLBL",
      filtering: false
    },
    {
      field: "retailOutletName",
      title: "Tên ĐLBL",
      filtering: false
    },
    {
      field: "salesmanName",
      title: "NVBH"
    },
    {
      field: "distributorName",
      title: "Tên NPP",
      filtering: false
    },
    {
      field: "visitFrequency",
      title: "Tần suất thăm",
      filtering: false
    },
    {
      field: "visitConfig",
      title: "Cấu hình thăm",
      filtering: false
    },
    {
      field: "repeatWeek",
      title: "Tuần lặp",
      filtering: false
    }
  ]

  const getSalesroutesConfigRetailOutlets = () => {
    authGet(dispatch, token, "/get-sales-route-config-retail-outlets/" + id)
      .then(res => setData(res))
  }

  const getPlanPeriodDetail = () => {
    authGet(dispatch, token, "/get-plan-period-detail/" + id)
      .then(res => {
        let fromdate = new Date(res.fromDate)
        let todate = new Date(res.toDate)
        setPeriodDetail({
          fromDate: fromdate.getDate() + "/" + (fromdate.getMonth() + 1) + "/" + fromdate.getFullYear(),
          toDate: todate.getDate() + "/" + (todate.getMonth() + 1) + "/" + todate.getFullYear()
        })
      })
  }

  const onClickDetailButton = () => {
    history.push("/salesroutes/plan/period/detail/" + id)
  }

  const onCLickGenerateSalesRouteDetailButton = () => {
    authPost(dispatch, token, "/generate-sales-route-detail", {})
    history.push("/salesroutes/plan/period/detail/" + id)
  }

  useEffect(() => {
    getPlanPeriodDetail()
    getSalesroutesConfigRetailOutlets()
  }, [])

  return (
    <div>
      <MuiThemeProvider>
        <Card>
          <CardContent>
            <Typography
              variant='h6'
              style={{marginLeft: 10}}
            >
              Thiết lập cấu hình viếng thăm cho đại lý bán lẻ
            </Typography>
            <Typography
              variant='subtitle1'
              style={{marginLeft: 24}}
            >
              Giai đoạn làm tuyến: SalesRoute {periodDetail.fromDate} - {periodDetail.toDate}
            </Typography>
            <br/>
            <MaterialTable
              title="Danh sách cấu hình viếng thăm"
              columns={columns}
              data={data}
              icons={tableIcons}
              localization={{
                header: {
                  actions: ''
                },
                body: {
                  emptyDataSourceMessage: 'Không có bản ghi nào để hiển thị',
                  filterRow: {
                    filterTooltip: 'Lọc'
                  }
                }
              }}
              actions={[
                rowData => ({
                  icon: 'edit',
                  tooltip: 'Sửa',
                  isFreeAction: true,
                  onClick: rowData => history.push("/salesroutes/plan")
                })
              ]}
              options={{
                search: false,
                filtering: true,
                actionsColumnIndex: -1
              }}
              components={{
                Toolbar: props => (
                  <div>
                    <MTableToolbar {...props} />
                    <Box
                      display='flex'
                      justifyContent='flex-end'
                      width='98%'
                    >
                      <IconButton
                        children={<IconContext.Provider>
                          <FcViewDetails style={{fontSize: 24}}/>
                        </IconContext.Provider>}
                        size='medium'
                        tooltip='Xem chi tiết tuyến'
                        style={{marginLeft: 25}}
                        onClick={onClickDetailButton}
                      />
                      <IconButton
                        children={<IconContext.Provider>
                          <FcRadarPlot style={{fontSize: 24}}/>
                        </IconContext.Provider>}
                        size='medium'
                        tooltip='Sinh chi tiết tuyến'
                        onClick={onCLickGenerateSalesRouteDetailButton}
                      />
                      <IconButton
                        children={<IconContext.Provider>
                          <RiMenuAddLine style={{fontSize: 24}}/>
                        </IconContext.Provider>}
                        component={RouterLink}
                        to="/salesroutes/"
                        size='medium'
                        tooltip='Thêm mới'
                      />
                    </Box>
                  </div>
                )
              }}
            />
          </CardContent>
        </Card>
      </MuiThemeProvider>
    </div>
  );
}

export default PlanPeriod;
