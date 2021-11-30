import React, { useEffect, useState } from "react";
import { Box, Button, Card, CardContent } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { MuiThemeProvider } from "@material-ui/core/styles";
import MaterialTable, { MTableToolbar } from "material-table";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { Link, useHistory } from "react-router-dom";
import { axiosGet, axiosPost } from "../../../api";
import { tableIcons } from "../../../utils/iconutil";
import {useLocation} from "react-router-dom";
import { useParams } from "react-router-dom";
import ModalCreateResource from "./ModalCreateResource"
function ResourceList(props) {
  const history = useHistory();
  const location = useLocation();
  const params = useParams();
  const dispatch = useDispatch();
  const [open,setOpen] = useState(false);
  const token = useSelector((state) => state.auth.token);
  const columns = [
    { field: "link", title: "Link" ,
    render: rowData => <a href={rowData.link} target="_blank">{rowData.link}</a>
    },
    { field: "description", title: "Description"},
    { field: "statusId", title: "Status" },
  ];

  const [resourceList, setResourceList] = useState([]);
  // Functions.
  const getAllResources = () => {
      console.log(location);
    axiosGet(token, `/domains/${params.id}/resources`)
      .then((res) => {
        console.log("getAllResources, resources ", res.data);
        setResourceList(res.data.content);
      })
      .catch((error) => console.log("getAllResources, error ", error));
  };
  const handleClose = () => {
    setOpen(false);
  }

  const onClickCreateNewButton = () => {
    // history.push({
    //   pathname: `/edu/domains/${params.id}/resource`,
    //   state: {},
    // });
    setOpen(true);
  };

  const onClickBackButton = () => {
    history.push({
      pathname: "/edu/teach/resource-links/list",
      state: {},
    });
  };
  

  useEffect(() => {
    getAllResources();
  }, []);

  return (
    <MuiThemeProvider>
        <Card>
          <CardContent>
            <MaterialTable
              title="Danh sách link tham khao"
              columns={columns}
              data={resourceList}
              icons={tableIcons}
              localization={{
                header: {
                  actions: "",
                },
                body: {
                  emptyDataSourceMessage: "Không có bản ghi nào để hiển thị",
                  filterRow: {
                    filterTooltip: "Lọc",
                  },
                },
              }}
              options={{
                search: true,
                actionsColumnIndex: -1,
              }}
              components={{
                Toolbar: (props) => (
                  <div>
                    <MTableToolbar {...props} />
                    <MuiThemeProvider>
                      <Box display="flex" justifyContent="space-between" width="98%">
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={onClickBackButton}
                            startIcon={<ArrowBackIosIcon />}
                            style={{ marginRight: 16, marginLeft:26 }}
                          >
                            Quay lai
                          </Button>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={onClickCreateNewButton}
                          startIcon={<AddCircleIcon />}
                          style={{ marginRight: 16 }}
                        >
                          Thêm mới
                        </Button>
                        <ModalCreateResource open={open} handleClose = {handleClose} domainId = {params.id}/>
                      </Box>
                      
                    </MuiThemeProvider>
                  </div>
                ),
              }}
            />
          </CardContent>
        </Card>
      </MuiThemeProvider>
  );
}

export default ResourceList;
