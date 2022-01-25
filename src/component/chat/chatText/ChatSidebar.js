import { Box, Button, Checkbox, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Fade, FormControl, Grow, IconButton, InputLabel, makeStyles, MenuItem, Modal, OutlinedInput, Paper, Select, TextField } from "@material-ui/core";
import AddIcon from '@material-ui/icons/Add';
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import randomColor from "randomcolor";

import { request } from "../../../api";
import UserItem from "../../backlog/components/UserItem";
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';

const useStyles = makeStyles(() => ({
    selectInput: {
        select: {
            width: "300px"
        }
    },

    groupListHeader: {
        display: 'flex',
        justifyContent: "space-between",
        alignItems: "center",
        height: "64px",
        padding: "8px 16px",
        borderBottom: "1px solid rgba(0, 0, 0, 0.05)"
    },

    groupListHeaderTitle: {
        fontWeight: "700",
        fontSize: "16px",
    },

    groupListBody: {
        padding: "8px 16px",
        overflowY: "scroll",
        height: "calc(100% - 64px)",
        /* width */
        "&::-webkit-scrollbar": {
            width: "10px",
            borderRadius: "4px"
        },

        /* Track */
        "&::-webkit-scrollbar-track": {
            background: "#f1f1f1",
            borderRadius: "4px",
            marginTop: "4px",
            marginBottom: "4px"
        },

        /* Handle */
        "&::-webkit-scrollbar-thumb": {
            background: "#ddd",
            borderRadius: "4px"
        },

        /* Handle on hover */
        "&::-webkit-scrollbar-thumb:hover": {
            background: "#888"
        }
    },

    groupCard: {
        height: "64px",
        padding: "8px 16px",
        border: "1px solid rgba(0, 0, 0, 0.05)",
        borderRadius: 4,
        marginBottom: 16,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        cursor: "pointer",

        "&>div:nth-child(1)": {
            "&>span": {
                fontWeight: 400,
            },

            "&>div": {
                fontWeight: 300,
                fontSize: 14,
            }
        },
        "&>div:nth-child(2)": {
            color: "orange",
            fontSize: "12px"
        },

        "&:hover": {
            boxShadow: "0 2px 4px 0 rgba(0, 0, 0, 0.1), 0 3px 8px 0 rgba(0, 0, 0, 0.05)",
        }
    },

    groupCardSelected: {
        // background: "#aaa",
        // color: "#eee",
        boxShadow: "0 2px 4px 0 rgba(0, 0, 0, 0.1), 0 3px 8px 0 rgba(0, 0, 0, 0.05)",
        "&>div:nth-child(1)": {
            "&>span": {
                fontWeight: 600,
            },
        },
    },

    addDialogHeader: {
        fontWeight: "700",
        fontSize: "20px",
    },

    addDialogBody: {
        fontWeight: "700",
        fontSize: "20px",
        width: "500px"
    }

}))

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const avtColor = [...Array(20)].map((value, index) =>
    randomColor({ luminosity: "light", hue: "random" })
);

export default function ChatSidebar(props) {
    const dispatch = useDispatch();
    const token = useSelector((state) => state.auth.token);

    const classes = useStyles();

    const [groupList, setGroupList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [propsState, setPropsState] = useState(props);
    const [formOpen, setFormOpen] = useState(false);
    const [users, setUsers] = useState([]);
    const [members, setMembers] = useState([]);
    const [groupName, setGroupName] = useState("");

    const isFirstLoad = useRef(true);

    useEffect(() => {
        setLoading(true);
        getUsers();
        loadData();
    }, []);

    useEffect(() => {
        setPropsState(props);
    }, [props]);

    const handleFormOpen = () => setFormOpen(true);

    const handleFormClose = () => {
        setFormOpen(false);
        setMembers([]);
        setGroupName("");
    };

    const onGroupClick = (element) => {
        //highlight group
        propsState.onGroupClick(element)
    }

    const [personName, setPersonName] = useState([]);
    const handleChange = (event) => {
        const {
            target: { value },
        } = event;
        setPersonName(
            // On autofill we get a the stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );

        console.log(personName);
    };

    const loadData = () => {
        request(
            "get",
            "/chat-group/me",
            (res) => {
                let data = res.data;

                if (data) {
                    setGroupList(data);
                    if (isFirstLoad.current) {
                        propsState.onGroupClick(data[0]);
                    }
                }

                isFirstLoad.current = false;
            },
            { 401: () => { } }
        )
            .finally(() => {
                setLoading(false);
            });
    }

    const getUsers = () => {
        request(
            "get",
            "/users?size=10000&page=0&search=",
            (res) => {
                if (res != null) {
                    setUsers(res.data.content);
                    console.log(res.data.content);
                }
            },
            { 401: () => { } }
        );
    }


    const handleTaskAssignableChange = (event) => {
        setMembers(event.target.value);
    };

    const handleFormCancel = () => {
        handleFormClose();
    };

    const handleFormSubmit = () => {
        let tmpMembers = [...members, propsState.currentUser.userName];

        request(
            "post",
            "/chat-group/",
            (res) => {
                if (res != null) {
                    console.log(res);
                    loadData();
                }
            },
            { 401: () => { } },
            {
                name: groupName,
                memberIds: tmpMembers
            },
        );
        handleFormClose();
    };

    return (
        <div style={{ width: "300px", borderLeft: "1px solid rgba(0, 0, 0, 0.05)" }}>
            <div className={classes.groupListHeader}>
                <div className={classes.groupListHeaderTitle}>DANH SÁCH NHÓM CHAT</div>
                <IconButton color="primary" aria-label="Thêm nhóm chat mới" component="span" onClick={handleFormOpen}>
                    <AddIcon />
                </IconButton>
            </div>
            <div className={classes.groupListBody}>
                {groupList
                    .sort((firstEl, secondEl) => {
                        if (firstEl.groupId == propsState.currentGroup?.groupId && secondEl.groupId != propsState.currentGroup?.groupId) {
                            return -1;
                        }

                        if (firstEl.groupId != propsState.currentGroup?.groupId && secondEl.groupId == propsState.currentGroup?.groupId) {
                            return 1;
                        }

                        if (propsState.unreadGroup.includes(firstEl.groupId) && !propsState.unreadGroup.includes(secondEl.groupId)) {
                            return -1;
                        }

                        if (!propsState.unreadGroup.includes(firstEl.groupId) && propsState.unreadGroup.includes(secondEl.groupId)) {
                            return 1;
                        }

                        return 0;
                    })
                    .map(element =>
                        <Grow in timeout={1500}>
                            <div onClick={() => onGroupClick(element)} key={element.groupId} className={`${classes.groupCard} ${(propsState.currentGroup?.groupId == element.groupId) ? classes.groupCardSelected : null}`}>
                                <div>
                                    <span>{element.groupName}</span>
                                    <div>Người tạo: {element.createdById}</div>
                                </div>
                                {propsState.unreadGroup.includes(element.groupId)
                                    && <div>
                                        <FiberManualRecordIcon />
                                    </div>
                                }
                            </div>
                        </Grow>
                    )}
            </div>
            <Dialog disableEscapeKeyDown open={formOpen} onClose={handleFormClose}>
                <DialogTitle id="alert-dialog-title">
                    <div className={classes.addDialogHeader}>Thêm nhóm chat mới</div>
                </DialogTitle>
                <DialogContent>
                    <div className={classes.addDialogBody}>
                        <form style={{ width: "100%" }} autoComplete="off">
                            <TextField
                                autoFocus
                                required
                                id="groupChatName"
                                label="Tên"
                                placeholder="Nhập tên"
                                value={groupName}
                                fullWidth
                                onChange={(event) => {
                                    setGroupName(event.target.value);
                                }}
                                helperText="Nhập tên nhóm của bạn"
                                variant="outlined"
                                style={{ marginBottom: "24px" }}
                            />
                            <TextField
                                id="members"
                                required
                                select={true}
                                variant="outlined"
                                helperText="Chọn thành viên nhóm"
                                SelectProps={{
                                    multiple: true,
                                    value: members,
                                    onChange: handleTaskAssignableChange,
                                    renderValue:
                                        users.length <= 0
                                            ? () => { }
                                            : (members) => {
                                                let memberStr = members
                                                    .map(
                                                        (x) =>
                                                            users.find(
                                                                (member) => member.userLoginId === x
                                                            ).userLoginId
                                                    )
                                                    .join(", ");

                                                if (memberStr.length > 50) {
                                                    memberStr = memberStr.substring(0, 50) + "...";
                                                }

                                                return memberStr;
                                            }
                                }}
                                fullWidth
                                label="Thành viên nhóm"
                            >
                                {
                                    propsState.currentUser?.userName
                                        ? users.map((item, index) => {
                                            return propsState.currentUser.userName !== item.userLoginId
                                                ?
                                                <MenuItem key={item.userLoginId} value={item.userLoginId}>
                                                    <Checkbox checked={members.includes(item.userLoginId)} />
                                                    <UserItem
                                                        user={item}
                                                        avatarColor={avtColor[index % avtColor.length]}
                                                    />
                                                    {/* <ListItemText primary={item.userLoginId} /> */}
                                                </MenuItem>
                                                : null
                                        })
                                        : null
                                }
                            </TextField>
                        </form>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleFormCancel}>Hủy</Button>
                    <Button onClick={handleFormSubmit} disabled={!groupName || members.length <= 0} autoFocus>
                        Tạo
                    </Button>
                </DialogActions>
            </Dialog>
        </div>

    );
}