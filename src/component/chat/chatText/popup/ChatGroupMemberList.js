import { Avatar, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, makeStyles, MenuItem } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';
import { useEffect, useState } from "react";
import EditIcon from '@material-ui/icons/Edit';
import { request } from "../../../../api";
import { successNoti } from "../../../../utils/notification";

const useStyles = makeStyles(() => ({
    userListPopupHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
    },

    userListCard: {
        display: "flex",
        padding: "16px 40px 16px 16px",
        border: "1px solid rgba(0, 0, 0, 0.05)",
        borderRadius: 4,
        marginBottom: 16,
        width: "300px",
        position: "relative"
    },

    userListCardDetails: {
        marginLeft: 16,


        "& div:nth-child(1)": {
            fontWeight: "400",
            fontSize: "16px",
            width: 180,
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            overflow: "hidden"
        },

        "& div:nth-child(2)": {
            fontWeight: "300",
            fontSize: "12px",
            width: 150,
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            overflow: "hidden"
        },
    },

    creatorAnnotation: {
        position: "absolute",
        right: 16,
        top: "50%",
        transform: "translateY(-50%)",
        color: "#e9d360",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end"
    },
}))

export default function ChatGroupMemberList(props) {
    const dispatch = useDispatch();
    const token = useSelector((state) => state.auth.token);
    const classes = useStyles();
    const [propsState, setPropsState] = useState(props);
    const [currentMemberIds, setCurrentMemberIds] = useState([]);
    const [editFormOpen, setEditFormOpen] = useState(false);
    const [userSelectList, setUserSelectList] = useState([]);

    function stringAvatar(name, color) {
        return {
            style: {
                backgroundColor: color,
            },
            children: `${name?.toString()[0] ?? "?"}`
        };
    }

    useEffect(() => {
        setPropsState(props);
        setCurrentMemberIds((props.memberList ?? []).map(el => el.userLoginId));
    }, [props]);


    function getUsers() {
        request(
            "get",
            "/users?size=10000&page=0&search=",
            (res) => {
                if (res != null) {
                    let userList = res.data.content ?? [];
                    userList?.forEach((el) => {
                        if (currentMemberIds.includes(el.userLoginId)) {
                            el.selected = true;
                        } else {
                            el.selected = false
                        }
                    })
                    setUserSelectList(userList);
                }
            },
            { 401: () => { } }
        );
    }

    function updateMembers() {
        let newMemberList = userSelectList.filter(el => el.selected == true).map(el => el.userLoginId)

        request(
            "put",
            `/chat-group/members/${propsState.currentGroup?.groupId}`,
            (res) => {
                if (res != null) {
                    setEditFormOpen(false);
                    props.onUpdateFininsed();
                    successNoti("Cập nhật thành công", true);
                }
            },
            { 401: () => { } },
            newMemberList
        );
    }

    function handleEditFormOpen(event) {
        getUsers();
        setEditFormOpen(true);
    }

    function handleEditFormEditClose(event) {
        setEditFormOpen(false);
        setUserSelectList([]);
    }

    function handleEditFormEditSave(event) {
        updateMembers()
    }

    function onUserChecked(event, user, index) {
        userSelectList[index].selected = event.target.checked;
        setUserSelectList([...userSelectList])
    }

    return (
        <Dialog disableEscapeKeyDown open={propsState.open} onClose={propsState.onClose}>
            <DialogTitle id="alert-dialog-title">
                <div className={classes.userListPopupHeader}>
                    <div>Danh sách thành viên</div>
                    <div hidden={propsState.currentGroup.createdById != propsState.currentUser.userName}>
                        <IconButton color="primary" component="span" onClick={handleEditFormOpen}>
                            <EditIcon />
                        </IconButton>
                    </div>
                </div>
            </DialogTitle>
            <DialogContent>
                <div className={classes.userListPopupBody}>
                    {propsState.memberList.map((el, index) => {
                        let fullName = propsState.memberMappingList[el.userLoginId]?.fullName;
                        let avaColor = propsState.memberMappingList[el.userLoginId]?.avaColor;
                        return <div key={el.userLoginId + index} className={classes.userListCard}>
                            <Avatar {...stringAvatar(fullName, avaColor)} />
                            <div className={classes.userListCardDetails}>
                                <div title={fullName}>
                                    <span>{fullName}</span>
                                </div>
                                <div title={el.userLoginId}>
                                    <span>{el.userLoginId}</span>
                                </div>
                            </div>
                            {
                                propsState.currentGroup.createdById == el.userLoginId
                                && <div className={classes.creatorAnnotation}>
                                    <AssignmentIndIcon />
                                    <span style={{ fontSize: 14, fontWeight: 300 }}>người tạo</span>
                                </div>
                            }

                        </div>
                    })}
                </div>
                <Dialog disableEscapeKeyDown open={editFormOpen} onClose={handleEditFormEditClose}>
                    <DialogTitle>
                        <div>
                            Thay đổi thành viên
                        </div>
                    </DialogTitle>
                    <DialogContent>
                        <div>
                            {
                                propsState.currentUser?.userName
                                    ? userSelectList.map((item, index) => {
                                        return (
                                            <MenuItem key={item.userLoginId} value={item.userLoginId}>
                                                <Checkbox checked={item.selected} disabled={propsState.currentUser.userName == item.userLoginId} onChange={(event) => { onUserChecked(event, item, index) }} />
                                                <div>{item.userLoginId}</div>
                                                {/* <ListItemText primary={item.userLoginId} /> */}
                                            </MenuItem>
                                        )
                                    })
                                    : null
                            }
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleEditFormEditClose} color="primary">
                            HỦY
                        </Button>
                        <Button onClick={handleEditFormEditSave} color="primary" autoFocus>
                            LƯU THAY ĐỔI
                        </Button>
                    </DialogActions>
                </Dialog>
            </DialogContent>
        </Dialog>
    );
}