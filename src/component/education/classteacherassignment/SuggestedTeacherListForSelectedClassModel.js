import {
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@material-ui/core";
import { grey } from "@material-ui/core/colors";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import { FcBusinessman } from "react-icons/fc";
import SimpleBar from "simplebar-react";
import { request } from "../../../api";
import PrimaryButton from "../../button/PrimaryButton";
import TertiaryButton from "../../button/TertiaryButton";
import CustomizedDialogs from "../../dialog/CustomizedDialogs";
const useStyles = makeStyles((theme) => ({
  dialogContent: {
    // paddingTop: theme.spacing(1) / 2,
    minWidth: 480,
  },
  listItem: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    paddingTop: theme.spacing(1) * 1.5,
    paddingBottom: theme.spacing(1) * 1.5,
  },
  btn: { marginRight: theme.spacing(1) },
}));

function SuggestedTeacherListForSelectedClassModel(props) {
  const classes = useStyles();
  const { planId, classId, suggestions, open, handleClose } = props;

  const onAssign = (teacherId) => {
    console.log(teacherId);
    let datasend = {
      classId: classId,
      teacherId: teacherId,
      planId: planId,
    };
    request(
      // token,
      // history,
      "post",
      "manual-reassign-teacher-to-class",
      (res) => {
        console.log(res);
        alert("phân giảng viên " + teacherId + " cho lớp " + classId + "  OK");
      },
      { 401: () => {} },
      datasend
    );

    handleClose();
  };

  return (
    <CustomizedDialogs
      open={open}
      handleClose={handleClose}
      title={
        suggestions
          ? `Gợi ý giảng viên cho lớp ${classId} (${suggestions.length})`
          : `Gợi ý giảng viên cho lớp ${classId}`
      }
      contentTopDivider
      content={
        suggestions &&
        (suggestions.length === 0 ? (
          <Typography color="textSecondary" gutterBottom style={{ padding: 8 }}>
            Không tìm thấy giảng viên nào phù hợp.
          </Typography>
        ) : (
          <SimpleBar
            style={{
              height: "100%",
              minHeight: 220,
              maxHeight: 480,
              width: 480,
              overflowX: "hidden",
              overscrollBehaviorY: "none", // To prevent tag <main> be scrolled when menu's scrollbar reach end
            }}
          >
            <List disablePadding>
              {suggestions.map((teacher, index) => (
                <>
                  <ListItem
                    alignItems="flex-start"
                    key={teacher.teacherId}
                    className={classes.listItem}
                  >
                    <ListItemAvatar style={{ minWidth: 52 }}>
                      <Avatar alt="Avatar" style={{ background: grey[200] }}>
                        <FcBusinessman size={24} />
                      </Avatar>
                    </ListItemAvatar>

                    <ListItemText
                      primary={teacher.teacherName}
                      secondary={
                        <>
                          {teacher.moveClass
                            ? teacher.moveClass.map((c, i) => (
                                <>
                                  <Typography variant="body2">
                                    {c.classCode} =&gt; {c.infoNewTeachers}
                                  </Typography>
                                </>
                              ))
                            : null}
                        </>
                      }
                    />

                    <TertiaryButton onClick={() => onAssign(teacher.teacherId)}>
                      Áp dụng
                    </TertiaryButton>
                  </ListItem>

                  {index < suggestions.length - 1 && (
                    <Divider
                      variant="inset"
                      component="li"
                      style={{ marginRight: 8 }}
                    />
                  )}
                </>
              ))}
            </List>
          </SimpleBar>
        ))
      }
      actions={
        suggestions &&
        suggestions.length === 0 && (
          <PrimaryButton className={classes.btn} onClick={handleClose}>
            Đã hiểu
          </PrimaryButton>
        )
      }
      classNames={{ content: classes.dialogContent }}
    />
  );
}

export default SuggestedTeacherListForSelectedClassModel;
