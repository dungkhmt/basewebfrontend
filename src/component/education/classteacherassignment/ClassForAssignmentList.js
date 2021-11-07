import { Box, IconButton, Typography } from "@material-ui/core/";
import { grey } from "@material-ui/core/colors";
import { makeStyles, MuiThemeProvider } from "@material-ui/core/styles";
import DeleteRoundedIcon from "@material-ui/icons/DeleteRounded";
import EditIcon from "@material-ui/icons/Edit";
import PublishRoundedIcon from "@material-ui/icons/PublishRounded";
import MaterialTable, { MTableToolbar } from "material-table";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { authPostMultiPart, request } from "../../../api";
import {
  components,
  localization,
  theme,
} from "../../../utils/MaterialTableUtils";
import TertiaryButton from "../../button/TertiaryButton";
import UpdateClassForAssignmentModel from "./UpdateClassForAssignmentModel";
import UploadExcelClassForTeacherAssignmentModel from "./UploadExcelClassForTeacherAssignmentModel";

const useStyles = makeStyles((theme) => ({
  commandButton: {
    marginLeft: theme.spacing(2),
    fontWeight: theme.typography.fontWeightRegular,
    "&:hover": {
      color: theme.palette.primary.main,
    },
  },
  tableToolbarHighlight: { backgroundColor: "transparent" },
}));

const headerProperties = {
  headerStyle: {
    fontSize: 16,
    backgroundColor: "rgb(63, 81, 181)",
    color: "white",
  },
};
// const theme = createMuiTheme({
//   palette: {
//     primary: green,
//   },
// });

let count = 0;

function ClassForAssignmentList(props) {
  const classes = useStyles();

  // Command delete button
  const [selectedRows, setSelectedRows] = useState([]);

  //
  const planId = props.planId;
  const [classList, setClassList] = useState([]);

  const [selectedClassId, setSelectedClassId] = useState(null);
  const [open, setOpen] = React.useState(false);
  const [openModelExcel, setOpenModelExcel] = React.useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  //const [selectedFile, setSelectedFile] = useState(null);

  // Table
  const cellStyles = { headerStyle: { padding: 8 }, cellStyle: { padding: 8 } };
  const alignRightCellStyles = {
    headerStyle: { padding: 8, textAlign: "right" },
    cellStyle: { padding: 8, textAlign: "right" },
  };
  const columns = [
    { title: "Mã lớp", field: "classId", ...cellStyles },
    { title: "Lớp", field: "className", ...cellStyles },
    { title: "Học phần", field: "courseId", ...cellStyles },
    { title: "Thời khoá biểu", field: "lesson", ...cellStyles },
    { title: "Chương trình", field: "program", ...cellStyles },
    {
      sorting: false,
      title: "Giờ quy đổi",
      field: "hourLoad",
      ...alignRightCellStyles,
    },
    {
      sorting: false,
      title: "Số GV",
      field: "numberPosibleTeachers",
      ...alignRightCellStyles,
    },
    {
      sorting: false,
      title: "Số GV trong KH",
      field: "numberPosibleTeachersInPlan",
      ...alignRightCellStyles,
    },
    {
      title: "",
      render: (rowData) => (
        <IconButton
          color="primary"
          aria-label="edit"
          onClick={() => {
            onUpdateHourLoad(rowData["classId"]);
          }}
        >
          <EditIcon />
        </IconButton>
      ),
      ...cellStyles,
    },
  ];

  function onUpdateHourLoad(classId) {
    //alert("suggest teacher for class " + classId);
    setSelectedClassId(classId);
    handleModalOpen();
  }

  function uploadExcel(selectedFile) {
    setIsProcessing(true);

    if (selectedFile == null) {
      alert("You must select a file");
      return;
    }
    console.log("upload file " + selectedFile.name);
    let body = {
      planId: planId,
    };
    let formData = new FormData();
    formData.append("inputJson", JSON.stringify(body));
    formData.append("file", selectedFile);

    authPostMultiPart(
      dispatch,
      token,
      "/upload-excel-class-4-teacher-assignment",
      formData
    )
      .then((res) => {
        setIsProcessing(false);
        console.log("result submit = ", res);

        //var f = document.getElementById("selected-upload-file");
        //f.value = null;
        //setSelectedFile(null);
      })
      .catch((e) => {
        setIsProcessing(false);
        console.error(e);
      });
  }

  const customUploadHandle = (selectedFile) => {
    //console.log(filename);
    //setSearchString(sString);
    //alert("upload " + filename);
    uploadExcel(selectedFile);
    handleModalCloseModelExcel();
  };

  const customUpdateHandle = (hourLoad) => {
    //alert("update  class " + selectedClassId + " with ourload = " + hourLoad);
    let datasend = {
      classId: selectedClassId,
      hourLoad: hourLoad,
    };
    request(
      // token,
      // history,
      "post",
      "update-class-for-assignment",
      (res) => {
        console.log(res);
        alert("Cập nhật " + "  OK");
      },
      { 401: () => {} },
      datasend
    );

    handleModalClose();
  };

  async function getClassTeacherAssignmentClassInfoList() {
    request(
      // token,
      // history,
      "GET",
      "/get-class-list-for-assignment-2-teacher/" + planId,
      (res) => {
        setClassList(res.data);
      }
    );
  }

  const handleModalOpen = () => {
    setOpen(true);
  };

  const handleModalClose = () => {
    setOpen(false);
  };

  const handleModalOpenModelExcel = () => {
    setOpenModelExcel(true);
  };

  const handleModalCloseModelExcel = () => {
    setOpenModelExcel(false);
  };

  const handleRemoveClassFromAssignmentPlan = () => {
    if (selectedRows.length > 0) {
      let data = selectedRows.map((row) =>
        JSON.stringify({
          classId: row.classId,
        })
      );

      let formData = new FormData();

      formData.append("planId", planId);
      formData.append("classList", data.join(";"));

      request(
        // token,
        // history,
        "POST",
        "/remove-class-from-assign-plan",
        (res) => {
          const toRemoveMap = selectedRows.reduce(
            (memo, clazz) => ({
              ...memo,
              [clazz.classId]: true,
            }),
            {}
          );

          setClassList(
            classList.filter((clazz) => !toRemoveMap[clazz.classId])
          );
        },
        {},
        formData
      );
    }
  };

  useEffect(() => {
    getClassTeacherAssignmentClassInfoList();
  }, []);
  return (
    <>
      <Box
        width="100%"
        height={40}
        display="flex"
        justifyContent="flex-start"
        alignItems="center"
        borderBottom={1}
        mt={-3}
        mb={3}
        style={{ borderColor: "#e8e8e8" }}
      >
        <TertiaryButton
          className={classes.commandButton}
          color="default"
          startIcon={<PublishRoundedIcon />}
          // disableRipple
          onClick={handleModalOpenModelExcel}
        >
          Tải lên Excel
        </TertiaryButton>
        {selectedRows.length > 0 && (
          <>
            <TertiaryButton
              className={classes.commandButton}
              color="default"
              startIcon={<DeleteRoundedIcon />}
              // disableRipple
              onClick={handleRemoveClassFromAssignmentPlan}
            >
              Xoá
            </TertiaryButton>
            <Typography
              component="span"
              style={{ marginLeft: "auto", marginRight: 32 }}
            >{`Đã chọn ${selectedRows.length} mục`}</Typography>
          </>
        )}
      </Box>
      <MuiThemeProvider theme={theme}>
        <MaterialTable
          title={"Danh sách lớp chưa phân công"}
          columns={columns}
          data={classList}
          localization={{
            ...localization,
            toolbar: { ...localization.toolbar, nRowsSelected: "" },
          }}
          options={{
            selection: true,
            pageSize: 20,
            headerStyle: {
              backgroundColor: "transparent",
            },
            rowStyle: (rowData) => ({
              backgroundColor: rowData.tableData.checked
                ? grey[200]
                : "#FFFFFF",
            }),
          }}
          onSelectionChange={(rows) => {
            setSelectedRows(rows);
          }}
          components={{
            ...components,
            Toolbar: (props) => (
              <MTableToolbar
                {...props}
                classes={{
                  highlight: classes.tableToolbarHighlight,
                }}
                searchFieldVariant="outlined"
                searchFieldStyle={{
                  height: 40,
                }}
              />
            ),
          }}
        />
      </MuiThemeProvider>

      <UploadExcelClassForTeacherAssignmentModel
        open={openModelExcel}
        onClose={handleModalCloseModelExcel}
        onUpload={customUploadHandle}
      />

      <UpdateClassForAssignmentModel
        open={open}
        onClose={handleModalClose}
        onUpdateInfo={customUpdateHandle}
        selectedClassId={selectedClassId}
      />
    </>
  );
}

export default ClassForAssignmentList;
