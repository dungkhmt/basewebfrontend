import React, { useEffect, useState } from 'react';
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch, useSelector } from "react-redux";
import { authPost, authGet } from "../../../api";
import AlertDialog from '../AlertDialog';
import {
  Dialog, DialogTitle, DialogContent, List, ListItem, ListItemAvatar, Avatar, ListItemText,
  Checkbox, DialogActions, Button, ListItemSecondaryAction
} from "@material-ui/core";
import randomColor from "randomcolor";

const avtColor = [...Array(20)].map((value, index) => randomColor({luminosity: "light",hue: "random",}));

const useStyles = makeStyles((theme) => ({
  dialogPaper: {
    minHeight: '50vh',
    maxHeight: '70vh',
    minWidth: '20vw',
  },
  avatar: {
    width: 36,
    height: 36,
  },
}));

const getFullName = (user) => {
  return user.person ? user.person.firstName + " " + user.person.middleName + " " + user.person.lastName : ""
}

export function MemberList(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const token = useSelector(state => state.auth.token);
  const [projectMember, setProjectMember] = useState([]);

  const { open, onClose, projectId, reloadData } = props;

  function getUser() {
    authGet(dispatch, token, "/backlog/get-members-of-project/" + projectId).then(res => {
      res.sort(((a, b) => { return (a.userLoginId > b.userLoginId) - (a.userLoginId < b.userLoginId) }));
      setProjectMember(res);
    });
  }

  useEffect(() => {
    getUser();
  }, [reloadData]);

  return (
    <Dialog
      open={open ? open : false}
      onClose={onClose}
      scroll={'paper'}
      aria-labelledby="list-scroll-dialog-title"
      classes={{ paper: classes.dialogPaper }}
    >
      <DialogTitle id="list-scroll-dialog-title">
        Danh sách thành viên
      </DialogTitle>
      <DialogContent dividers={true}>
        <List>
          {projectMember.map((member, index) => (
            <ListItem>
              <ListItemAvatar>
                <Avatar className={classes.avatar} style={{background: avtColor[index % avtColor.length]}}>
                  {(member.person && member.person.lastName !== "") ? member.person.lastName.substring(0, 1) : ""}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={getFullName(member)}
                secondary={member.userLoginId}
              />
            </ListItem>
          ))}
        </List>
      </DialogContent>
    </Dialog>
  )
};

export function AddMember(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const token = useSelector(state => state.auth.token);
  const [isMember, setIsMember] = useState({});
  const [inviteResultAlert, setInviteResultAlert] = useState(false);
  const [inviteAlertProperties, setInviteAlertProperties] = useState({});

  const { open, onClose, projectId, successCallback } = props;

  async function getUser() {
    let users = await authGet(dispatch, token, "/backlog/get-all-user");
    let members = await authGet(dispatch, token, "/backlog/get-members-of-project/" + projectId);

    let check = {};
    if (users != null) {
      users.sort(((a, b) => { return (a.userLoginId > b.userLoginId) - (a.userLoginId < b.userLoginId) }));
      users.forEach(user => {
        if (members.find(member => member.userLoginId === user.userLoginId) == null)
          check[user.userLoginId] = {
            checked: false,
            user: user
          };
      })
    }
    setIsMember(check);
  }

  const onInviteMember = () => {
    onClose();

    let newMember = [];
    for (let key in isMember) {
      if (isMember[key].checked) newMember.push(key);
    }

    let input = {
      backlogProjectId: projectId,
      usersLoginId: newMember
    };
    authPost(dispatch, token, "/backlog/add-member", input)
      .then((res) => res.json())
      .then((res) => {
        if (res == null || res.backlogProjectId == null) {
          setInviteAlertProperties({
            severity: 'error',
            title: 'Mời thành viên thất bại',
            content: 'Mời thất bại. Vui lòng thử lại.'
          })
          setInviteResultAlert(true);
          return;
        } else {
          setInviteAlertProperties({
            severity: 'success',
            title: 'Mời thành viên thành công',
            content: 'Mời thành công.'
          })
          setInviteResultAlert(true);
          getUser();
          successCallback();
          return;
        }
      })
  }
  const handleChangeAddMember = (event) => {
    const tmp = isMember[event.target.name];
    setIsMember(
      { ...isMember, 
        [event.target.name]: {...tmp, checked: event.target.checked }}
    )
  }

  useEffect(() => {
    getUser();
  }, []);

  return (
    <div>
      <Dialog
        open={open}
        onClose={onClose}
        aria-labelledby="form-dialog-title"
        scroll={'paper'}
        classes={{ paper: classes.dialogPaper }}
      >
        <DialogTitle id="form-dialog-title">
          Thêm thành viên
        </DialogTitle>
        <DialogContent dividers={true}>
          <List>
            {Object.keys(isMember).map((key, index) => (
              <ListItem>
                <ListItemAvatar>
                  <Avatar className={classes.avatar} style={{background: avtColor[index % avtColor.length]}}>
                    {(isMember[key].person && isMember[key].person.lastName !== "") ? isMember[key].person.lastName.substring(0, 1) : ""}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText id={key} primary={key} secondary={getFullName(isMember[key].user)}/>
                <ListItemSecondaryAction>
                  <Checkbox
                    name={key}
                    edge="end"
                    onChange={handleChangeAddMember}
                    checked={isMember[key].checked}
                  />
                </ListItemSecondaryAction>
              </ListItem >
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={onInviteMember} color="primary">
            Lưu
          </Button>
          <Button onClick={onClose} color="primary">
            Hủy
          </Button>
        </DialogActions>
      </Dialog>

      <AlertDialog
        open={inviteResultAlert}
        onClose={() => setInviteResultAlert(false)}
        {...inviteAlertProperties}
        buttons={[
          {
            onClick: () => setInviteResultAlert(false),
            color: "primary",
            autoFocus: true,
            text: "OK"
          }
        ]}
      />
    </div>
  )
}