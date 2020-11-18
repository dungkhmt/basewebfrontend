import React, { useRef, useEffect, useState, Fragment } from "react";
import {
  Card,
  CardContent,
  Typography,
  CardHeader,
  Paper,
  Collapse,
  CardActionArea,
  Grid,
  Link,
  Avatar,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@material-ui/core";
import MaterialTable from "material-table";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import { request } from "../../../../api";
import { useParams } from "react-router";
import { makeStyles } from "@material-ui/core/styles";
import {
  FcApproval,
  FcMindMap,
  FcExpand,
  FcConferenceCall,
  FcExpired,
  FcClock,
} from "react-icons/fc";
import { BiDetail } from "react-icons/bi";
import changePageSize, {
  localization,
  tableIcons,
} from "../../../../utils/MaterialTableUtils";
import { errorNoti } from "../../../../utils/Notification";
import CustomizedDialogs from "../../../../utils/CustomizedDialogs";
import PositiveButton from "../../../../component/education/classmanagement/PositiveButton";

import NegativeButton from "../../../../component/education/classmanagement/NegativeButton";
import displayTime from "../../../../utils/DateTimeUtils";
import { StyledBadge } from "../../../../component/education/classmanagement/StyledBadge";
import AssignList from "../../../../component/education/classmanagement/AssignList";
// import withAsynchScreenSecurity from "../../../../component/education/classmanagement/withAsynchScreenSecurity";

import clsx from "clsx";

const useStyles = makeStyles((theme) => ({
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
    heigth: 48,
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
}));

function TClassDetail() {
  const classes = useStyles();
  const params = useParams();
  const history = useHistory();
  const token = useSelector((state) => state.auth.token);

  // Class.
  const [classDetail, setClassDetail] = useState({});

  // Student.
  const [students, setStudents] = useState([]);
  const [stuWillBeDeleted, setStuWillBeDeleted] = useState();
  const [fetchedStudents, setFetchedStudents] = useState(false);

  // Regist.
  const [registStudents, setRegistStudents] = useState([]);
  const [selectedRegists, setSelectedRegists] = useState([]);

  // Assignment.
  const [assignSets, setAssignSets] = useState([
    { title: "Đã giao", data: [] },
    { title: "Chưa giao", data: [] },
    { title: "Đã xoá", data: [] },
  ]);
  // const [deletedAssignId, setDeletedAssignId] = useState();

  // Dialog.
  const [openDelStuDialog, setOpenDelStuDialog] = useState(false);

  // Tables.
  const [openClassStuCard, setOpenClassStuCard] = useState(false);
  const [openRegistCard, setOpenRegistCard] = useState(false);

  // Tables's ref.
  const studentTableRef = useRef(null);
  const registTableRef = useRef(null);
  const assignTableRef = useRef(null);

  const headerProperties = {
    headerStyle: {
      textAlign: "center",
    },
    cellStyle: {
      textAlign: "center",
      fontSize: "1rem",
    },
  };

  // Column.
  const assignCols = [
    {
      field: "name",
      title: "Tên bài tập",
      ...headerProperties,
    },
    {
      field: "closeTime",
      title: "Hạn nộp",
      ...headerProperties,
      render: (rowData) => {
        return displayTime(new Date(rowData.closeTime));
      },
    },
  ];

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

  // Functions.
  const getClassDetail = () => {
    request(token, history, "get", `/edu/class/${params.id}`, (res) => {
      setClassDetail(res.data);
    });
  };

  const getStudents = (type) => {
    if (type === "register") {
      request(
        token,
        history,
        "get",
        `/edu/class/${params.id}/registered-students`,
        (res) => {
          changePageSize(res.data.length, registTableRef);
          setRegistStudents(res.data);
        }
      );
    } else {
      request(
        token,
        history,
        "get",
        `/edu/class/${params.id}/students`,
        (res) => {
          changePageSize(res.data.length, studentTableRef);
          setStudents(res.data);
          setFetchedStudents(true);
        }
      );
    }
  };

  const getAssigns = () => {
    request(
      token,
      history,
      "get",
      `/edu/class/${params.id}/assignments/teacher`,
      (res) => {
        // changePageSize(res.data.length, assignTableRef);
        let wait4Opening = [];
        let opened = [];
        let deleted = [];
        let current = new Date();

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

  const onClickStuCard = () => {
    setOpenClassStuCard(!openClassStuCard);

    if (fetchedStudents == false) {
      getStudents("class");
    }
  };

  // Delete student.
  const onClickRemoveBtn = (rowData) => {
    setOpenDelStuDialog(true);
    setStuWillBeDeleted({ id: rowData.id, name: rowData.name });
  };

  const onDeleteStudent = () => {
    setOpenDelStuDialog(false);
    let id = stuWillBeDeleted.id;

    request(
      token,
      history,
      "put",
      "/edu/class/registration-status",
      (res) => {
        if (res.data[id].status == 200) {
          // Remove student in student list.
          setStudents(students.filter((student) => student.id != id));
        } else {
          // The student may have been removed previously.
          errorNoti("Rất tiếc! Đã có lỗi xảy ra. Vui lòng thử lại.");
        }
      },
      {},
      {
        classId: params.id,
        studentIds: [id],
        status: "REMOVED",
      }
    );
  };

  // Aprrove or deny registrations.
  const onSelectionChange = (rows) => {
    setSelectedRegists(rows.map((row) => row.id));
  };

  const onUpdateStatus = (type) => {
    request(
      token,
      history,
      "put",
      "/edu/class/registration-status",
      (res) => {
        let data = res.data;
        let tmp = [];
        let result;

        // In case it is necessary to update the student list.
        if (type == "APPROVED" && fetchedStudents) {
          let newStudents = [];

          for (let i = 0; i < registStudents.length; i++) {
            result = data[registStudents[i].id];

            if (result == undefined || result.status != 200) {
              // Not selected or status update failed.
              tmp.push(registStudents[i]);
            } else {
              // Successfully update.
              newStudents.push({
                name: registStudents[i].name,
                id: registStudents[i].id,
                email: registStudents[i].email,
              });
            }
          }

          setStudents([...students, ...newStudents]);
        } else {
          for (let i = 0; i < registStudents.length; i++) {
            result = data[registStudents[i].id];

            if (result == undefined || result.status != 200) {
              // Not selected or status update failed.
              tmp.push(registStudents[i]);
            }
          }
        }

        setRegistStudents(tmp);
      },
      {},
      {
        classId: params.id,
        studentIds: selectedRegists,
        status: type,
      }
    );
  };

  // Assignments.
  const onClickAssign = (id) => {
    history.push(`/edu/teacher/class/${params.id}/assignment/${id}`);
  };

  const handleClose = () => {
    setOpenDelStuDialog(false);
  };

  useEffect(() => {
    getClassDetail();
    getAssigns();
    getStudents("register");
  }, []);

  return (
    <Fragment>
      <Card className={classes.card}>
        <CardHeader
          avatar={
            <Avatar style={{ background: "#ff7043" }}>
              <BiDetail size={32} />
            </Avatar>
          }
          title={<Typography variant="h5">Thông tin lớp</Typography>}
        />
        <CardContent>
          <Grid container className={classes.grid}>
            <Grid item md={3} sm={3} xs={3} container direction="column">
              <Typography>Mã lớp</Typography>
              <Typography>Mã học phần</Typography>
              <Typography>Tên học phần</Typography>
              <Typography>Loại lớp</Typography>
            </Grid>
            <Grid item md={8} sm={8} xs={8} container direction="column">
              <Typography>
                <b>:</b> {classDetail.code}
              </Typography>
              <Typography>
                <b>:</b> {classDetail.courseId}
              </Typography>
              <Typography>
                <b>:</b> {classDetail.name}
              </Typography>
              <Typography>
                <b>:</b> {classDetail.classType}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card className={classes.card}>
        <CardActionArea disableRipple onClick={onClickStuCard}>
          <CardHeader
            avatar={
              <Avatar style={{ background: "white" }}>
                {/*#ffeb3b <PeopleAltRoundedIcon /> */}
                <FcConferenceCall size={40} />
              </Avatar>
            }
            title={<Typography variant="h5">Danh sách sinh viên</Typography>}
            action={
              <div>
                <IconButton aria-label="show more">
                  <FcExpand
                    size={24}
                    className={clsx(
                      !openClassStuCard && classes.close,
                      openClassStuCard && classes.open
                    )}
                  />
                </IconButton>
              </div>
            }
          />
        </CardActionArea>
        <Collapse in={openClassStuCard} timeout="auto">
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
        </Collapse>
      </Card>

      <Card className={classes.card}>
        <CardActionArea
          disableRipple
          onClick={() => setOpenRegistCard(!openRegistCard)}
        >
          <CardHeader
            avatar={
              <Avatar style={{ background: "white" }}>
                <FcApproval size={40} />
              </Avatar>
            }
            title={
              <StyledBadge badgeContent={registStudents.length} color="error">
                Phê duyệt sinh viên đăng ký
              </StyledBadge>
            }
            titleTypographyProps={{
              variant: "h5",
            }}
            action={
              <div>
                <IconButton aria-label="show more">
                  <FcExpand
                    size={24}
                    className={clsx(
                      !openRegistCard && classes.close,
                      openRegistCard && classes.open
                    )}
                  />
                </IconButton>
              </div>
            }
          />
        </CardActionArea>
        <Collapse in={openRegistCard} timeout="auto">
          <CardContent>
            <MaterialTable
              title=""
              columns={registCols}
              tableRef={registTableRef}
              data={registStudents}
              localization={localization}
              components={{
                Container: (props) => <Paper {...props} elevation={0} />,
                Action: (props) => {
                  if (props.action.icon === "refuse") {
                    return (
                      <NegativeButton
                        label="Từ chối"
                        className={classes.negativeBtn}
                        onClick={(event) =>
                          props.action.onClick(event, props.data)
                        }
                      />
                    );
                  }
                  if (props.action.icon === "approve") {
                    return (
                      <PositiveButton
                        label="Phê duyệt"
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
                selection: true,
                debounceInterval: 500,
                headerStyle: {
                  backgroundColor: "#673ab7",
                  fontWeight: "bold",
                  fontSize: "1rem",
                  color: "white",
                },
                sorting: false,
                cellStyle: { fontSize: "1rem" },
                toolbarButtonAlignment: "left",
                showTextRowsSelected: false,
              }}
              actions={[
                {
                  icon: "approve",
                  position: "toolbarOnSelect",
                  onClick: () => onUpdateStatus("APPROVED"),
                },
                {
                  icon: "refuse",
                  position: "toolbarOnSelect",
                  onClick: () => onUpdateStatus("REFUSED"),
                },
              ]}
              onSelectionChange={(rows) => onSelectionChange(rows)}
            />
          </CardContent>
        </Collapse>
      </Card>

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
                history.push(
                  `/edu/teacher/class/${params.id}/assignment/create`
                );
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

      {/* Dialogs */}
      <CustomizedDialogs
        open={openDelStuDialog}
        handleClose={handleClose}
        title="Loại sinh viên?"
        content={
          <Typography gutterBottom>
            Loại sinh viên <b>{stuWillBeDeleted?.name}</b> khỏi lớp.
            <br />
            <b>
              Cảnh báo: Bạn không thể hủy hành động này sau khi đã thực hiện.
            </b>
          </Typography>
        }
        actions={
          <PositiveButton
            label="Loại khỏi lớp"
            className={classes.dialogRemoveBtn}
            onClick={onDeleteStudent}
          />
        }
      />
    </Fragment>
  );
}

export default TClassDetail;
// export default withAsynchScreenSecurity(TClassDetail, "SCR_TCLASSDETAIL");
