import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch, useSelector } from "react-redux";
import { authPost, authGet } from "../../../api";
import AlertDialog from "../AlertDialog";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  InputAdornment,
  Checkbox,
  DialogActions,
  Button,
  TextField,
  Typography,
  IconButton,
  Box,
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import ClearIcon from "@material-ui/icons/Clear";
import randomColor from "randomcolor";
import InfiniteScroll from "react-infinite-scroll-component";
import UseDebounce from "../components/UseDebounce";
import UserItem from "../components/UserItem";
import { errorNoti } from "../../../utils/Notification";

const avtColor = [...Array(20)].map((value, index) =>
  randomColor({ luminosity: "light", hue: "random" })
);

const useStyles = makeStyles((theme) => ({
  dialogPaper: {
    minHeight: "60vh",
    maxHeight: "60vh",
    minWidth: "25vw",
  },
  avatar: {
    width: 36,
    height: 36,
  },
}));

export function MemberList(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const [projectMember, setProjectMember] = useState([]);

  const { open, onClose, projectId, reloadData } = props;

  function getUser() {
    authGet(
      dispatch,
      token,
      "/backlog/get-members-of-project/" + projectId
    ).then((res) => {
      res.sort((a, b) => {
        return (
          (a.userLoginId > b.userLoginId) - (a.userLoginId < b.userLoginId)
        );
      });
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
      scroll={"paper"}
      aria-labelledby="list-scroll-dialog-title"
      classes={{ paper: classes.dialogPaper }}
    >
      <DialogTitle id="list-scroll-dialog-title">
        Danh sách thành viên
      </DialogTitle>
      <DialogContent dividers={true}>
        <List>
          {projectMember.map((member, index) => (
            <UserItem
              key={member.userLoginId}
              user={member}
              avatarColor={avtColor[index % avtColor.length]}
              avatarClass={classes.avatar}
            />
          ))}
        </List>
      </DialogContent>
    </Dialog>
  );
}

export function AddMember(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const [inviteResultAlert, setInviteResultAlert] = useState(false);
  const [inviteAlertProperties, setInviteAlertProperties] = useState({});
  const [users, setUsers] = useState([]);
  const [isChecked, setIsChecked] = useState({});
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const debouncedSearchTerm = UseDebounce(query, 200);

  const { open, onClose, projectId, successCallback } = props;

  function errHandling(err) {
    if (err.message == "Unauthorized")
      errorNoti("Phiên làm việc đã kết thúc, vui lòng đăng nhập lại !", true);
    else {
      setInviteAlertProperties({
        severity: "error",
        title: "Mời thành viên thất bại",
        content: "Mời thất bại. Vui lòng thử lại.",
      });
      setInviteResultAlert(true);
    }
    console.trace(err);
  }

  async function getUser() {
    authGet(
      dispatch,
      token,
      "/backlog/get-users-not-member/" + projectId + "?size=10&page=0"
    ).then((res) => setUsers(res));
  }

  const getNotMembers = (pageNumber) => {
    let param =
      "?size=10&page=" +
      pageNumber +
      (query.length > 0 ? "&search=" + query : "");
    authGet(
      dispatch,
      token,
      "/backlog/get-users-not-member/" + projectId + param
    ).then((res) => {
      if (pageNumber !== 0) setUsers(users.concat(res));
      else setUsers(res);
      if (res.length === 0) setHasMore(false);
      setPage(pageNumber);
      setIsSearching(false);
    });
  };

  const onInviteMember = () => {
    onClose();

    let newMember = [];
    for (let key in isChecked) {
      if (isChecked[key] === true) newMember.push(key);
    }

    let input = {
      backlogProjectId: projectId,
      usersLoginId: newMember,
    };

    authPost(dispatch, token, "/backlog/add-member", input)
      .then((res) => {
        setInviteAlertProperties({
          severity: "success",
          title: "Mời thành viên thành công",
          content: "Mời thành công.",
        });
        setInviteResultAlert(true);
        getUser();
        successCallback();
      })
      .catch((err) => errHandling(err));

    clearState();
  };
  const handleChangeAddMember = (event) => {
    setIsChecked({ ...isChecked, [event.target.name]: event.target.checked });
  };

  const clearState = () => {
    setQuery("");
    setIsChecked({});
    setPage(0);
    setHasMore(true);
  };

  useEffect(() => {
    if (debouncedSearchTerm) {
      setIsSearching(true);
      getNotMembers(0);
      setHasMore(true);
    } else {
      getNotMembers(0);
      setHasMore(true);
    }
  }, [debouncedSearchTerm]);

  useEffect(() => {
    getUser();
  }, []);

  return (
    <div>
      <Dialog
        open={open}
        onClose={onClose}
        aria-labelledby="form-dialog-title"
        scroll={"paper"}
        classes={{ paper: classes.dialogPaper }}
      >
        <DialogTitle id="form-dialog-title">
          <Box>
            <Typography variant="h5">Thêm thành viên</Typography>
            <TextField
              id="search-bar"
              variant="outlined"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              type="text"
              placeholder="Tìm kiếm"
              fullWidth
              style={{ marginTop: "20px" }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: query && (
                  <IconButton
                    aria-label="clear-search-text"
                    onClick={() => setQuery("")}
                  >
                    <ClearIcon />
                  </IconButton>
                ),
              }}
            />
          </Box>
        </DialogTitle>
        <DialogContent dividers={true} id="scrollableDiv">
          <InfiniteScroll
            dataLength={users.length}
            next={() => getNotMembers(page + 1)}
            hasMore={hasMore}
            scrollableTarget="scrollableDiv"
            scrollThreshold={0.8}
          >
            {users.map((user, index) => (
              <UserItem
                key={user.userLoginId}
                user={user}
                avatarColor={avtColor[index % avtColor.length]}
                avatarClass={classes.avatar}
                secondaryAction={
                  <Checkbox
                    name={user.userLoginId}
                    edge="end"
                    onChange={handleChangeAddMember}
                    checked={
                      isChecked[user.userLoginId]
                        ? isChecked[user.userLoginId]
                        : false
                    }
                  />
                }
              />
            ))}
          </InfiniteScroll>
        </DialogContent>
        <DialogActions>
          <Button onClick={onInviteMember} color="primary">
            Lưu
          </Button>
          <Button
            onClick={() => {
              onClose();
              clearState();
            }}
            color="primary"
          >
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
            text: "OK",
          },
        ]}
      />
    </div>
  );
}
