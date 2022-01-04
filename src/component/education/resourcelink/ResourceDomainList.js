import React, { useEffect, useState } from "react";
import { Box, Button, Card, CardContent } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { MuiThemeProvider } from "@material-ui/core/styles";
import MaterialTable, { MTableToolbar } from "material-table";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import { Link, useHistory } from "react-router-dom";
import { axiosGet, axiosPost } from "../../../api";
import { tableIcons } from "../../../utils/iconutil";
import ModalCreate from "./ModalCreate";


function ResourceDomainList(props) {
  const history = useHistory();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const columns = [
    { field: "id", title: "Domain Id" },
    { field: "name", title: "Name"
    },
    { field: "createDateTime", title: "Created Time"},
  ];

  const [domainList, setDomainList] = useState([]);
  const [open,setOpen] = useState(false);
  // Functions
  const getAllDomains = () => {
    axiosGet(token, "/domains")
      .then((res) => {
        console.log("getAllDomains, domains ", res.data);
        setDomainList(res.data.Domains);
      })
      .catch((error) => console.log("getAllDomains, error ", error));
  };

  const handleClose = () => {
    setOpen(false);
  }
  const onClickCreateNewButton = () => {
    // history.push({
    //   pathname: "/edu/domain/create",
    //   state: {},
    // });

      setOpen(true);
  };
  const onClickEditButton = (id) => {
    history.push({
      pathname: `/edu/domains/${id}/edit`,
      state: {},
    });
  };
  const handleRedirectResource = (id) => {
    console.log(id);
    history.push({
      pathname: `/edu/domains/${id}/resources`,
      state: {
        domainId: id,
      },
    });
  }

  useEffect(() => {
    getAllDomains();
  }, []);

  return (
    <MuiThemeProvider>
        <Card>
          <CardContent>
            <MaterialTable
              title="Danh sách nguồn tham khảo"
              columns={columns}
              data= {
                domainList
              }
              onRowClick = {(event,rowData) => {
                console.log(rowData)
                history.push({
                pathname: `/edu/domains/${rowData.id}/resources`,
                state: {
                  domainId: rowData.id,
                },
              });
              }}
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
                   
                      <Box display="flex" justifyContent="flex-end" width="98%">
                       
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={onClickCreateNewButton}
                          startIcon={<AddCircleIcon />}
                          style={{ marginRight: 16 }}
                        >
                          Thêm mới
                        </Button>
                        <ModalCreate open={open} handleClose = {handleClose}/>
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

export default ResourceDomainList;
