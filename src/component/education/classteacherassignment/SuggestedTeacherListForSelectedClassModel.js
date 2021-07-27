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
import TertiaryButton from "../../button/TertiaryButton";
import CustomizedDialogs from "../../dialog/CustomizedDialogs";

const useStyles = makeStyles((theme) => ({
  dialogContent: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    paddingTop: theme.spacing(1) * 1.5,
    paddingBottom: theme.spacing(1),
  },
  listItem: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    paddingTop: theme.spacing(1) * 1.5,
    paddingBottom: theme.spacing(1) * 1.5,
  },
}));

function SuggestedTeacherListForSelectedClassModel(props) {
  const classes = useStyles();
  const { classId, suggestionData, open, handleClose } = props;

  const onAssign = (teacherId) => {
    console.log(teacherId);
    handleClose();
  };

  return (
    <CustomizedDialogs
      open={open}
      handleClose={handleClose}
      title={
        suggestionData
          ? `Gợi ý giáo viên cho lớp ${classId} (${suggestionData.length})`
          : `Gợi ý giáo viên cho lớp ${classId}`
      }
      content={
        <>
          <SimpleBar
            style={{
              height: "100%",
              maxHeight: 400,
              width: 440,
              overflowX: "hidden",
              overscrollBehaviorY: "none", // To prevent tag <main> be scrolled when menu's scrollbar reach end
            }}
          >
            <List disablePadding>
              {suggestionData
                ? suggestionData.map((teacher, index) => (
                    <>
                      <ListItem
                        alignItems="flex-start"
                        key={teacher.teacherId}
                        className={classes.listItem}
                      >
                        <ListItemAvatar style={{ minWidth: 52 }}>
                          <Avatar
                            alt="Avatar"
                            style={{ background: grey[200] }}
                          >
                            <FcBusinessman size={24} />
                          </Avatar>
                        </ListItemAvatar>

                        <ListItemText
                          primary={teacher.teacherName}
                          secondary={
                            <>
                              <Typography variant="body2">
                                11345 =&gt; ThuanDP
                              </Typography>
                              <Typography variant="body2">
                                12300 =&gt; HuyQD
                              </Typography>
                            </>
                          }
                        />

                        <TertiaryButton
                          onClick={() => onAssign(teacher.teacherId)}
                        >
                          Áp dụng
                        </TertiaryButton>
                      </ListItem>

                      {index < suggestionData.length - 1 && (
                        <Divider
                          variant="inset"
                          component="li"
                          style={{ marginRight: 8 }}
                        />
                      )}
                    </>
                  ))
                : null}
            </List>
          </SimpleBar>
        </>
      }
      style={{ content: classes.dialogContent }}
    />
  );
}

export default SuggestedTeacherListForSelectedClassModel;
