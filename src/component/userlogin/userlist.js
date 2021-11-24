import Button from "@material-ui/core/Button";
import MaterialTable, { MTableToolbar } from "material-table";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { authGet } from "../../api";
import { tableIcons } from "../../utils/iconutil";
import withScreenSecurity from "../withScreenSecurity";
import SearchUserLoginModal from "./searchUserLoginModal";

function UserList() {
  const tableRef = React.createRef();

  const [open, setOpen] = React.useState(false);

  const [searchString, setSearchString] = React.useState("");

  useEffect(() => {
    refreshTable();
  }, [searchString]);

  const handleModalOpen = () => {
    setOpen(true);
  };

  const handleModalClose = () => {
    setOpen(false);
  };

  const customSearchHandle = (sString) => {
    console.log(sString);
    setSearchString(sString);
    handleModalClose();
  };

  const fetchDefault = (query) => {
    return new Promise((resolve, reject) => {
      console.log(query);
      let sortParam = "";
      if (query.orderBy !== undefined) {
        sortParam = "&sort=" + query.orderBy.field + "," + query.orderDirection;
      }
      let filterParam = "";
      //if(query.filters.length>0){
      //    let filter=query.filters;
      //    filter.forEach(v=>{
      //      filterParam=v.column.field+":"+v.value+","
      //    })
      //    filterParam="&filtering="+filterParam.substring(0,filterParam.length-1);
      //}
      filterParam = "&search=" + query.search;
      authGet(
        dispatch,
        token,
        "/users" +
          "?size=" +
          query.pageSize +
          "&page=" +
          query.page +
          sortParam +
          filterParam
      ).then(
        (res) => {
          console.log(res);
          if (res !== undefined && res !== null)
            resolve({
              data: res.content,
              page: res.number,
              totalCount: res.totalElements,
            });
          else reject();
        },
        (error) => {
          console.log("error");

          reject();
        }
      );
    });
  };

  const fetchCustomSearch = (query, customSearchString) => {
    return new Promise((resolve, reject) => {
      console.log(query);

      let searchParam = "&userLoginId=" + customSearchString;

      authGet(
        dispatch,
        token,
        "/users/search" +
          "?size=" +
          query.pageSize +
          "&page=" +
          query.page +
          searchParam
      ).then(
        (res) => {
          console.log(res);
          if (res !== undefined && res !== null)
            resolve({
              data: res.content,
              page: res.number,
              totalCount: res.totalElements,
            });
          else reject();
        },
        (error) => {
          console.log(error);
          reject();
        }
      );
    });
  };

  const fetchRouter = (query) => {
    if (searchString === "") {
      return fetchDefault(query);
    } else {
      return fetchCustomSearch(query, searchString);
    }
  };

  const refreshTable = () => {
    console.log(tableRef);
    tableRef.current.setState(
      {
        ...tableRef.current.state,
        query: {
          ...tableRef.current.state.query,
          page: 0,
        },
      },
      tableRef.current.onChangePage()
    );
  };

  const dispatch = useDispatch();
  const history = useHistory();

  const token = useSelector((state) => state.auth.token);
  const columns = [
    { title: "Full Name", field: "fullName" },
    {
      title: "Status",
      field: "status",
      lookup: {
        PARTY_ENABLED: "PARTY_ENABLED",
        PARTY_DISABLED: "PARTY_DISABLED",
      },
    },
    { title: "Type", field: "partyType" },
    { title: "Created Date", field: "createdDate", type: "date" },
    {
      title: "User Name",
      field: "userLoginId",
      render: (rowData) => (
        <Link to={"/userlogin/" + rowData.partyId}>{rowData.userLoginId}</Link>
      ),
    },
    { title: "Party Code", field: "partyCode" },
    { title: "Enabled", field: "enabled" },
  ];

  return (
    <div>
      <MaterialTable
        title="List Users"
        columns={columns}
        tableRef={tableRef}
        options={{
          //filtering: true,
          search: true,
        }}
        components={{
          Toolbar: (props) => (
            <div style={{ position: "relative" }}>
              <MTableToolbar {...props} />
              <div
                style={{ position: "absolute", top: "16px", right: "350px" }}
              >
                <Button onClick={handleModalOpen} color="primary">
                  ID Search
                </Button>
              </div>
            </div>
          ),
        }}
        data={fetchRouter}
        icons={tableIcons}
        actions={[
          {
            icon: "refresh",
            tooltip: "Refresh Data",
            isFreeAction: true,
            onClick: () =>
              setSearchString("") && tableRef.current.onQueryChange(),
          },
        ]}
      />
      <SearchUserLoginModal
        open={open}
        onClose={handleModalClose}
        onSearch={customSearchHandle}
      />
    </div>
  );
}
const screenName = "SCREEN_USER_LIST";
export default withScreenSecurity(UserList, screenName, true);
