import React, { useState, useRef, useEffect } from "react";
import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";

import MaterialTable from "material-table";
import { request } from "../../../../api";
import {
  FcApproval,
  FcClock,
  FcConferenceCall,
  FcExpired,
  FcMindMap,
} from "react-icons/fc";
import { useHistory, useParams } from "react-router";
import { drawerWidth } from "../../../../assets/jss/material-dashboard-react";
import changePageSize, {
  localization,
  tableIcons,
} from "../../../../utils/MaterialTableUtils";
import NegativeButton from "../../../../component/education/classmanagement/NegativeButton";
import PositiveButton from "../../../../component/education/classmanagement/PositiveButton";

const useStyles = makeStyles((theme) => ({
  root: {
    // flexGrow: 1,
    margin: "auto",
    width: `calc(100vw - ${drawerWidth + theme.spacing(4) * 2 + 1}px)`,
    backgroundColor: theme.palette.background.paper,
  },
  card: {
    marginTop: theme.spacing(2),
  },
  grid: {
    paddingLeft: 56,
  },
  negativeBtn: {
    minWidth: 112,
    marginLeft: 10,
    marginRight: 10,
  },
  positiveBtn: {
    minWidth: 112,
  },
  dialogRemoveBtn: {
    fontWeight: "normal",
  },
  listItem: {
    height: 48,
    borderRadius: 6,
    marginBottom: 6,
    backgroundColor: "#f5f5f5",
    "&:hover": {
      backgroundColor: "#e0e0e0",
    },
  },
  open: { transform: "rotate(-180deg)", transition: "0.3s" },
  close: { transition: "0.3s" },
  item: {
    paddingLeft: 32,
  },
  tabs: { padding: theme.spacing(2) },
  tabSelected: {
    background: "rgba(254,243,199,1)",
    color: "rgba(180,83,9,1) !important",
  },
  tabRoot: {
    margin: "0px 0.5rem",
    borderRadius: "0.375rem",
    textTransform: "none",
  },
}));

export default function TeacherViewDetailClassStudentList(props) {
  const classes = useStyles();
  const params = useParams();
  const classId = props.classId;
  const history = useHistory();
  const [students, setStudents] = useState([]);
  const [stuWillBeDeleted, setStuWillBeDeleted] = useState();
  const [fetchedStudents, setFetchedStudents] = useState(false);
  const studentTableRef = useRef(null);
  const [openDelStuDialog, setOpenDelStuDialog] = useState(false);

  console.log("classId = ", classId);
  const headerProperties = {
    headerStyle: {
      textAlign: "center",
    },
    cellStyle: {
      textAlign: "center",
      fontSize: "1rem",
    },
  };

  const registCols = [
    {
      field: "name",
      title: "Họ và tên",
      ...headerProperties,
    },
    {
      field: "email",
      title: "Email",
      ...headerProperties,
      render: (rowData) => (
        <Link href={`mailto:${rowData.email}`}>{rowData.email}</Link>
      ),
    },
  ];

  const stuCols = [
    ...registCols,
    {
      field: "",
      title: "",
      ...headerProperties,
      render: (rowData) => (
        <NegativeButton
          label="Loại khỏi lớp"
          className={classes.negativeBtn}
          onClick={() => onClickRemoveBtn(rowData)}
        />
      ),
    },
  ];

  const onClickRemoveBtn = (rowData) => {
    setOpenDelStuDialog(true);
    setStuWillBeDeleted({ id: rowData.id, name: rowData.name });
  };

  const getStudents = (type) => {
    request(
      // token,
      // history,
      "get",
      `/edu/class/${classId}/students`,
      (res) => {
        setStudents(res.data);
        setFetchedStudents(true);
        changePageSize(res.data.length, studentTableRef);
      }
    );
  };

  useEffect(() => {
    //getClassDetail();
    //getAssigns();
    //getStudentAssignment();
    //getStudents("register");
    getStudents();
  }, []);

  return (
    <div>
      <h1>Students</h1>
      <Card className={classes.card} elevation={0}>
        {/* <CardActionArea disableRipple onClick={onClickStuCard}> */}
        <CardHeader
          avatar={
            <Avatar style={{ background: "white" }}>
              {/*#ffeb3b <PeopleAltRoundedIcon /> */}
              <FcConferenceCall size={40} />
            </Avatar>
          }
          title={<Typography variant="h5">Danh sách sinh viên</Typography>}
          // action={
          //   <div>
          //     <IconButton aria-label="show more">
          //       <FcExpand
          //         size={24}
          //         className={clsx(
          //           !openClassStuCard && classes.close,
          //           openClassStuCard && classes.open
          //         )}
          //       />
          //     </IconButton>
          //   </div>
          // }
        />
        {/* </CardActionArea>
            <Collapse in={openClassStuCard} timeout="auto"> */}
        <CardContent>
          <MaterialTable
            title=""
            columns={stuCols}
            icons={tableIcons}
            tableRef={studentTableRef}
            localization={localization}
            data={students}
            components={{
              Container: (props) => <Paper {...props} elevation={0} />,
            }}
            options={{
              filtering: true,
              sorting: false,
              search: false,
              pageSize: 10,
              debounceInterval: 500,
              headerStyle: {
                backgroundColor: "#673ab7",
                fontWeight: "bold",
                fontSize: "1rem",
                color: "white",
              },
              filterCellStyle: { textAlign: "center" },
              cellStyle: { fontSize: "1rem", textAlign: "center" },
              toolbarButtonAlignment: "left",
            }}
          />
        </CardContent>
        {/* </Collapse> */}
      </Card>
    </div>
  );
}
