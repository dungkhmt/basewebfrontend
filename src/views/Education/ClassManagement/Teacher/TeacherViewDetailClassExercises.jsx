import React, { useState, useEffect } from "react";
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
import { BiDetail } from "react-icons/bi";
import {
  FcApproval,
  FcClock,
  FcConferenceCall,
  FcExpired,
  FcMindMap,
} from "react-icons/fc";
import { makeStyles } from "@material-ui/core/styles";
import { drawerWidth } from "../../../../assets/jss/material-dashboard-react";
import NegativeButton from "../../../../component/education/classmanagement/NegativeButton";
import PositiveButton from "../../../../component/education/classmanagement/PositiveButton";
import { useHistory, useParams } from "react-router";
import { request } from "../../../../api";
import AssignList from "../../../../component/education/classmanagement/AssignList";

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

export default function TeacherViewDetailClassExercises(props) {
  const classes = useStyles();
  //const params = useParams();
  const history = useHistory();
  const classId = props.classId;
  // Assignment.
  const [assignSets, setAssignSets] = useState([
    { title: "Đã giao", data: [] },
    { title: "Chưa giao", data: [] },
    { title: "Đã xoá", data: [] },
  ]);
  // const [deletedAssignId, setDeletedAssignId] = useState();
  // Student Assignment
  const [assignmentList, setAssignmentList] = useState([]);

  const onClickAssign = (id) => {
    history.push(`/edu/teacher/class/${classId}/assignment/${id}`);
  };

  const getAssigns = () => {
    request(
      // token,
      // history,
      "get",
      `/edu/class/${classId}/assignments/teacher`,
      (res) => {
        // changePageSize(res.data.length, assignTableRef);
        let wait4Opening = [];
        let opened = [];
        let deleted = [];
        let current = new Date();

        setAssignmentList(res.data);

        res.data.forEach((assign) => {
          if (assign.deleted) {
            deleted.push(assign);
          } else {
            let open = new Date(assign.openTime);

            if (current.getTime() < open.getTime()) {
              wait4Opening.push(assign);
            } else {
              let close = new Date(assign.closeTime);

              if (close.getTime() < current.getTime()) {
                opened.push({ ...assign, opening: false });
              } else {
                opened.push({ ...assign, opening: true });
              }
            }
          }
        });

        setAssignSets([
          { ...assignSets[0], data: opened },
          { ...assignSets[1], data: wait4Opening },
          { ...assignSets[2], data: deleted },
        ]);
      }
    );
  };

  useEffect(() => {
    //getClassDetail();
    getAssigns();
    //getStudentAssignment();
    //getStudents("register");
    //getStudents();
  }, []);

  return (
    <div>
      <h1>Exercises</h1>
      <Card className={classes.card}>
        <CardHeader
          avatar={
            <Avatar style={{ background: "white" }}>
              <FcMindMap size={40} />
            </Avatar>
          }
          title={<Typography variant="h5">Bài tập</Typography>}
          action={
            <PositiveButton
              label="Tạo mới"
              className={classes.positiveBtn}
              onClick={() => {
                history.push(`/edu/teacher/class/${classId}/assignment/create`);
              }}
            />
          }
        />
        <Grid container md={12} justify="center">
          <Grid item md={10}>
            <CardContent className={classes.assignList}>
              {/* <MaterialTable
            title=""
            columns={assignCols}
            tableRef={assignTableRef}
            localization={localization}
            data={assign}
            components={{
              Container: (props) => <Paper {...props} elevation={0} />,
              Action: (props) => {
                if (props.action.icon === "create") {
                  return (
                    <PositiveButton
                      label="Tạo mới"
                      className={classes.positiveBtn}
                      onClick={(event) =>
                        props.action.onClick(event, props.data)
                      }
                    />
                  );
                }
              },
            }}
            options={{
              search: false,
              pageSize: 10,
              actionsColumnIndex: -1,
              debounceInterval: 500,
              headerStyle: {
                backgroundColor: "#673ab7",
                fontWeight: "bold",
                fontSize: "1rem",
                color: "white",
                paddingLeft: 5,
                paddingRight: 5,
              },
              sorting: false,
              cellStyle: {
                fontSize: "1rem",
                whiteSpace: "normal",
                paddingLeft: 5,
                wordBreak: "break-word",
              },
              toolbarButtonAlignment: "left",
            }}
            actions={[
              {
                icon: "create",
                position: "toolbar",
                onClick: () => {
                  history.push(
                    `/edu/teacher/class/${params.id}/assignment/create`
                  );
                },
              },
            ]}
            onRowClick={(event, rowData) => {
              console.log(rowData);
              history.push(
                `/edu/teacher/class/${params.id}/assignment/${rowData.id}`
              );
            }}
          /> */}
              <List>
                {assignSets.map((assignList) => (
                  <AssignList title={assignList.title}>
                    {assignList.data.map((assign) => (
                      <ListItem
                        button
                        disableRipple
                        className={classes.listItem}
                        onClick={() => onClickAssign(assign.id)}
                      >
                        <ListItemText primary={assign.name} />
                        <ListItemIcon>
                          {assign.opening ? (
                            <FcClock size={24} />
                          ) : assign.opening == false ? (
                            <FcExpired size={24} />
                          ) : null}
                        </ListItemIcon>
                      </ListItem>
                    ))}
                  </AssignList>
                ))}
              </List>
            </CardContent>
          </Grid>
        </Grid>
      </Card>
    </div>
  );
}
