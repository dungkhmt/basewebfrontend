import React, { useEffect, useRef, useState } from "react";
import { authPostMultiPart, authGet, request } from "../../../api";
import { useDispatch, useSelector } from "react-redux";
import SockJsClient from 'react-stomp';
import { Avatar, Button, IconButton, makeStyles, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Slide } from "@material-ui/core";
import ChatSidebar from "./ChatSidebar";
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import ReplyIcon from '@material-ui/icons/Reply';
import CloseIcon from '@material-ui/icons/Close';
import randomColor from "randomcolor";
import { warningNoti } from "../../../utils/notification";
import { MESSAGE_TYPE } from "./const";
import ChatGroupMemberList from "./popup/ChatGroupMemberList";

const SOCKET_URL = 'http://localhost:8080/api/chatSocketHandler';

const useStyles = makeStyles(() => ({
    chatContainer: {
        display: "flex",
        height: "calc(100vh - 64px)",
        width: "calc(100% + 48px)",
        padding: "0 0 8px 8px",
        margin: "-24px",
        backgroundColor: "white",
        overflow: 'hidden'
    },

    chatBox: {
        flexBasis: "calc(100% - 301px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },

    chatSidebar: {
        flexBasis: "30%",
    },

    chatBoxHeader: {
        height: "64px",
        background: "white",
        width: "100%",
        borderBottom: "1px solid rgba(0, 0, 0, 0.05)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 8px 0 16px",

        "& div:nth-child(1)": {
            fontWeight: "700",
            lineHeight: "64px",

        },

        "& div:nth-child(2)>span": {
            color: "grey",
            fontWeight: "300",
            lineHeight: "64px"
        }
    },

    chatArea: {
        // height: "calc(100% - 120px)",
        flex: 1,
        overflowY: 'scroll',
        background: 'white',
        width: "100%",

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

    avatarBox: {
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        margin: "32px 8px 0 16px",
        gap: "8px",

        '& span': {
            fontWeight: 700
        },
    },

    myAvatarBox: {
        justifyContent: "flex-end"
    },

    messageContainer: {
        display: 'flex',
        alignItems: "center"
    },

    message: {
        borderRadius: 32,
        padding: 8,
        margin: '10px',
        width: "fit-content",
        maxWidth: "300px",
        backgroundColor: "white",
        boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.1), 0 2px 4px 0 rgba(0, 0, 0, 0.09)",
        '& p': {
            margin: 8,
            wordWrap: "break-word"
        }
    },

    myMessage: {
        margin: '10px auto',
        marginRight: '10px',
        marginLeft: 'auto !important',
        backgroundColor: '#3874ec',
        color: "white"
    },

    inputGroup: {
        display: 'flex',
        gap: '10px',
        background: 'white',
        width: "100%",
    },

    msgInput: {
        flex: 1
    },

    replyToContainer: {
        width: "100%",
        padding: "16px",
        borderRadius: "4px 4px 0 0",
        border: "1px solid #BBBBBB",
        borderBottom: "none",
        marginBottom: "-2px",
        position: "relative"
    },

    replyToHeader: {
        color: "#BBBBBB"
    },

    replyToContent: {
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        marginTop: "8px",
        width: "90%"
    },

    replyToMessage: {
        width: 'fit-content',
        marginBottom: -38,
        marginLeft: 10,
        background: '#f8f8f8',
        padding: '16px 16px 32px 16px',
        borderRadius: 16,
        color: '#888',
        marginTop: 8,
        textOverflow: "ellipsis",
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        maxWidth: 300
    }
}))


export default function ChatMain() {
    const dispatch = useDispatch();
    const token = useSelector((state) => state.auth.token);

    const [listMsg, setListMsg] = useState([]);
    const [inpValue, setInpValue] = useState("");
    const [user, setUser] = useState({});

    const [currentGroup, setCurrentGroup] = useState({ groupName: "" });
    const [unreadGroup, setUnreadGroup] = useState([]);
    const [currentGroupMembers, setCurrentGroupMembers] = useState([]);
    const [memberUserLoginIdFullNameMapping, setMemberUserLoginIdFullNameMapping] = useState({});
    const [scrolledBottom, setScrolledBottom] = useState(true);
    const [userListPopupOpen, setUserListPopupOpen] = useState(false);
    const [hoverButtonPosition, setHoverButtonPosition] = useState(-1);
    const [replyToMessage, setReplyToMessage] = useState(null);

    const [paging, setPaging] = useState({
        "totalElements": 0,
        "totalPages": 0,
        "last": true,
        "first": false,
        "empty": true,
        "numberOfElements": 0,
        "limit": 20,
        "page": 0
    });


    let userReady = useState(false);

    let clientRef = null;

    let messagesEndRef = useRef();

    let topMessageRef = useRef();

    let messageContainerRef = useRef();

    const classes = useStyles();

    let firstTimeLoad = useRef(false);

    let isLoadMore = useRef(false);

    let oldMessageContainerHeight = useRef(0);

    let connectHeader = {
        "X-Auth-Token": token,
        username: user.userName
    }

    useEffect(() => {
        request(
            "get",
            "/my-account/",
            (res) => {
                let data = res.data;

                setUser({
                    name: data.name,
                    userName: data.user,
                    partyId: data.partyId,
                });

                console.log(res.data.name)

                connectHeader.username = data.user;

                userReady.set(true);
            },
            { 401: () => { } }
        );
    }, []);

    useEffect(() => {
        if (isLoadMore.current) {
            let heightDiff = messageContainerRef.current.scrollHeight - oldMessageContainerHeight.current;
            messageContainerRef.current.scrollTo({
                top: heightDiff, behavior: 'instant'
            });
            isLoadMore.current = false;
        } else {
            if (!firstTimeLoad.current) {
                if (messagesEndRef.current.getBoundingClientRect().top - 200 < (window.innerHeight)) {
                    scrollToBottom({ behavior: "smooth" });
                }
            } else {
                scrollToBottom({ behavior: "instant" });
                firstTimeLoad.current = false;
            }
        }

        oldMessageContainerHeight.current = messageContainerRef.current.scrollHeight

    }, [listMsg]);

    function stringAvatar(name, color) {
        return {
            style: {
                backgroundColor: color,
            },
            children: `${name?.toString()[0] ?? "?"}`
        };
    }

    // function sendMessageToUser(msg) {
    //     clientRef.sendMessage('/app/chat/text/sendMessageToUser', JSON.stringify({ destination: "admin", content: msg, type: 'CHAT' }));
    // }

    function sendMessageToGroup(msg) {
        clientRef.sendMessage('/app/chat/text/sendMessageToGroup', JSON.stringify({ destination: currentGroup.groupId, content: msg, replyTo: replyToMessage }));
    }

    function handleSubmit(event) {
        // sendMessage(inpValue);
        sendMessageToGroup(inpValue);
        setInpValue("");
        scrollToBottom({ behavior: "instant" });
        setReplyToMessage(null);
        event.preventDefault();
    }

    function handleChange(event) {
        setInpValue(event.target.value);
    }

    function onGroupSelect(group) {
        console.log(group);
        firstTimeLoad.current = true;
        if (group.groupId != currentGroup.groupId) {
            setCurrentGroup(group);
            fetchMessages(group, 0, paging.limit, true);
            fetchGroupMembers(group);
            setReplyToMessage(null)
        }
        setUnreadGroup(unreadGroup.filter(value => {
            return value !== group.groupId
        }))
    }

    function onGroupChatMessageArrived(msg) {
        if (msg.destination == currentGroup.groupId) {
            setListMsg([...listMsg, msg]);
        }
        else {
            setUnreadGroup([msg.destination, ...unreadGroup])
        }
    }

    function onMessageArrived(msg) {
        switch (msg.type) {
            case MESSAGE_TYPE.GROUP_CHAT:
                onGroupChatMessageArrived(msg);
                break;

            case MESSAGE_TYPE.ERROR:
                console.log(msg);
                warningNoti("Có lỗi xảy ra", true)
                break;

            default:
                console.log(msg);
                break;
        }
    }

    function loadMoreMessages() {
        fetchMessages(currentGroup, paging.page, paging.limit, false);
    }

    function convertDBMessageToChatMessage(message) {
        if (!message) return null;
        return {
            id: message.msgId,
            content: message.message,
            sender: message.fromUserLoginId,
            replyTo: convertDBMessageToChatMessage(message.replyTo)
        }
    }

    function fetchMessages(group, page, limit, reset) {
        request(
            "get",
            `/chat-group/messages?groupId=${group.groupId}&page=${page}&limit=${limit}`,
            (res) => {
                let data = res.data;

                let msgs = data.content.map((msg) => {
                    return convertDBMessageToChatMessage(msg)
                }).reverse();

                if (!reset) {
                    msgs = [...msgs, ...listMsg];
                    firstTimeLoad.current = false;
                    isLoadMore.current = true;
                }

                setListMsg(msgs);

                setPaging({
                    "totalElements": data.totalElements,
                    "totalPages": data.totalPages,
                    "last": data.last,
                    "first": data.first,
                    "empty": data.empty,
                    "numberOfElements": data.numberOfElements,
                    "limit": limit,
                    "page": page + 1
                });
            },
            { 401: () => { } }
        );
    }

    function fetchGroupMembers(group) {
        request(
            "get",
            `/chat-group/members?groupId=${group.groupId}`,
            (res) => {
                if (res.data?.content) {
                    setCurrentGroupMembers(res.data.content);

                    let mapping = {};

                    res.data.content.forEach(element => {
                        mapping[element.userLoginId] = {
                            fullName: element.fullName,
                            avaColor: randomColor({ luminosity: "light", hue: "random" })
                        }
                    });

                    setMemberUserLoginIdFullNameMapping(mapping);
                }
            },
            { 401: () => { } }
        );
    }

    function scrollToBottom(options) {
        messagesEndRef.current?.scrollIntoView(options)
    }

    function handleUserListPopupOpen() {
        setUserListPopupOpen(true);
    }

    function handleUserListPopupClose() {
        setUserListPopupOpen(false);
    }

    function onGroupMembersUpdateFinished() {
        fetchGroupMembers(currentGroup);
    }

    return (
        <div className={classes.chatContainer}>
            {
                userReady
                    ? <SockJsClient url={SOCKET_URL} topics={['/user/queue/messages']}
                        onMessage={onMessageArrived}
                        onConnect={() => { console.log("connected") }}
                        headers={connectHeader} connectHeader={connectHeader}
                        ref={(el) => { clientRef = el }}>
                    </SockJsClient>
                    : null
            }

            <div className={classes.chatBox}>
                <div className={classes.chatBoxHeader}>
                    <div>{currentGroup?.groupName ?? ""}</div>
                    <div>
                        <span>{currentGroupMembers?.length ?? 0} thành viên</span>
                        <IconButton color="primary" aria-label="Thành viên nhóm" component="span" onClick={handleUserListPopupOpen}>
                            <SupervisorAccountIcon />
                        </IconButton>
                    </div>
                </div>

                <div id="messageArea" className={classes.chatArea} ref={messageContainerRef}>
                    {
                        !paging.last
                            ? <div style={{ textAlign: "center", cursor: "pointer", padding: "8px", borderBottom: "1px solid rgba(0, 0, 0, 0.05)" }}><ArrowDropUpIcon onClick={loadMoreMessages}/></div>
                            : null
                    }
                    {listMsg.map((value, index) => {
                        let senderFullName = memberUserLoginIdFullNameMapping[value.sender]?.fullName ?? value.sender;
                        let avaColor = memberUserLoginIdFullNameMapping[value.sender]?.avaColor;

                        return (
                            <div key={value.id}>
                                {
                                    value.sender != listMsg[index - 1]?.sender
                                        ? value.sender != user.userName
                                            ? <div className={`${classes.avatarBox}`}>
                                                <Avatar {...stringAvatar(senderFullName, avaColor)} />
                                                <span>{senderFullName}</span>
                                            </div>
                                            : <div className={`${classes.avatarBox} ${classes.myAvatarBox}`}>
                                                <span>{senderFullName}</span>
                                                <Avatar {...stringAvatar(senderFullName, avaColor)} />
                                            </div>
                                        : null
                                }

                                {
                                    value.replyTo != null
                                        ? <div className={`${classes.replyToMessage}  ${value.sender == user.userName && classes.myMessage}`} >
                                            <span>{value.replyTo.content}</span>
                                        </div>
                                        : null
                                }

                                <div className={`${classes.messageContainer}`} onMouseEnter={(e) => { e.stopPropagation(); setHoverButtonPosition(index) }} onMouseLeave={(e) => { e.stopPropagation(); setHoverButtonPosition(-1) }}>
                                    <div className={`${classes.message} ${value.sender == user.userName && classes.myMessage}`} ref={index == 0 ? topMessageRef : null} >
                                        <p>{value.content}</p>
                                    </div>
                                    {
                                        index == hoverButtonPosition && value.sender != user.userName
                                            ? <IconButton aria-label="reply" onClick={() => { setReplyToMessage(value) }}>
                                                <ReplyIcon />
                                            </IconButton>
                                            : null
                                    }
                                </div>
                            </div>
                        )
                    })}
                    <div style={{ float: "left", clear: "both" }}
                        ref={messagesEndRef}>
                    </div>
                </div>
                {
                    // replyToMessage?.id ?
                    <Slide direction="up" in={replyToMessage?.id} mountOnEnter unmountOnExit>
                        <div className={classes.replyToContainer}>
                            <div className={classes.replyToHeader}>
                                <span>trả lời <b>{memberUserLoginIdFullNameMapping[replyToMessage?.sender]?.fullName ?? replyToMessage?.sender}</b></span>
                            </div>
                            <div className={classes.replyToContent}>
                                <span>{replyToMessage?.content}</span>
                            </div>
                            <IconButton size="small" style={{ position: "absolute", top: "8px", right: "8px" }} onClick={() => { setReplyToMessage(null) }}><CloseIcon style={{ fontSize: "12px" }} /></IconButton>
                        </div>
                    </Slide>
                    // : null
                }
                <form onSubmit={handleSubmit} className={classes.inputGroup}>

                    <TextField
                        className={classes.msgInput}
                        type="text"
                        id="message"
                        variant="outlined"
                        placeholder="Type a message..."
                        autoComplete="off"
                        value={inpValue}
                        size="small"
                        onChange={handleChange}
                    />
                    <Button variant="contained" type="submit" disabled={!inpValue} color="primary">Send</Button>
                </form>

                <ChatGroupMemberList open={userListPopupOpen} onClose={handleUserListPopupClose} currentUser={user} currentGroup={currentGroup} memberList={currentGroupMembers} memberMappingList={memberUserLoginIdFullNameMapping} onUpdateFininsed={onGroupMembersUpdateFinished}></ChatGroupMemberList>
            </div>
            <ChatSidebar className={classes.chatSidebar} onGroupClick={onGroupSelect} currentUser={user} unreadGroup={unreadGroup} currentGroup={currentGroup}></ChatSidebar>
        </div >
    );
}
