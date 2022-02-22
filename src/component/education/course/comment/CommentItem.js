import { makeStyles } from "@material-ui/core/styles";
import {
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Menu,
  MenuItem,
  Input,
} from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { useState, useEffect } from "react";
import { authPut, authDelete, authGet, authPost } from '../../../../api';
import { useDispatch, useSelector } from "react-redux";
import ReplyCommentItem from './ReplyCommentItem';
import { toFormattedDateTime } from "../../../../utils/dateutils";
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "row",
    alignItems: 'flex-start',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  inputComment: {
    display: "flex",
    flexDirection: "row",
    alignItems: 'center',
  },
  customTextField: {
    flexGrow: 1,
    "& input::placeholder": {
      fontSize: "12px"
    },
  },
  growItem: {
    flexGrow: 1,
    marginLeft: theme.spacing(1)
  },
  btnComment: {
    fontSize: '12px',
    color: '#1976d2'
  }
}));

export default function CommentItem({
  comment,
  chapterMaterialId,
  deleteComment,
  editComment,
  currentUser
}){
  const dispatch = useDispatch();
	const token = useSelector((state) => state.auth.token);
  const [valueCommentMessage, setValueCommentMessage] = useState(comment.commentMessage)
  const [replyCommentMessage, setReplyCommentMessage] = useState("");
  const [isEdittingComment, setIsEdittingComment] = useState(false)
  const [isShowReplyInput, setIsShowReplyInput] = useState(false);
  const [showReplyList, setShowReplyList] = useState(false);
  const [listReplyComment, setListReplyComment] = useState([]);
  const [flag, setFlag] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const open = Boolean(anchorEl);
  const classes = useStyles();

  useEffect(()=>{
    setValueCommentMessage(comment.commentMessage);
    onGetListReplyComment(comment.commentId);
  }, [comment, flag])
  const handleClickOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    //close menu edit/delete
    setAnchorEl(null);
    setOpenModal(false);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteComment =() => {
    deleteComment(comment.commentId);
    setOpenModal(false);
    setAnchorEl(null); 
  }

  const handleShowInputComment = () => {
    setAnchorEl(null);
    setIsEdittingComment(true)
  }

  const handleSaveEditComment = (cmtContent) => {
    editComment(comment.commentId, cmtContent);
    setIsEdittingComment(false);
  }

  //post reply comment
	const createReplyComment = async () => {
    let body = {
      commentMessage: replyCommentMessage.trim(),
      eduCourseMaterialId: chapterMaterialId,
      replyToCommentId: comment.commentId,
    }

    if(replyCommentMessage.trim().length !== 0){
      let commentPost = await authPost(
        dispatch,
        token,
        "/edu/class/comment",
        body
      );
    }

    // if flag change, rerender listcomment
    setFlag(!flag)
    setReplyCommentMessage("")
  }

  //get list reply of comment
	const onGetListReplyComment = async (commentId) => {
			let res = await authGet(
				dispatch,
				token,
				`/edu/class/reply-comment/${commentId}`
			);
			setListReplyComment(res);
	}

  return(
    <div
      className={classes.root}
    >
      {/**Modal confirm delete comment */}
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="draggable-dialog-title"
      >
        <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
          Xóa bình luận
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Khi bạn xóa bình luận, các bình luận trả lời cũng mất theo.  <br />
            Bạn có chắc muốn xóa?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleCloseModal} color="primary">
            Hủy bỏ
          </Button>
          <Button onClick={()=>handleDeleteComment()} color="secondary">
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
      <Avatar>
        {comment.fullNameOfCreator.split(' ').pop().charAt(0).toUpperCase()}
      </Avatar>
      <div>
        <b>{comment.fullNameOfCreator}</b>
        &nbsp;
        <span>{toFormattedDateTime(comment.createdStamp)}</span>
        <div
          className={classes.growItem}
        >
        {isEdittingComment ? 
          (
            <div>
              <Input
                value={valueCommentMessage}
                onChange={(event)=>setValueCommentMessage(event.target.value)}
                type='text'
                fullWidth={true}
              />
              <Button onClick={()=>setIsEdittingComment(false)}>
                Hủy
              </Button>
              <Button onClick={()=>handleSaveEditComment(valueCommentMessage)}>
                Lưu
              </Button>
            </div>
          ) : 
          <div>
            {comment.commentMessage}
          </div>
        }
        </div>
        <div>
          <Button
            onClick={()=>setIsShowReplyInput(!isShowReplyInput)}
            style={{color: '#bbb', fontSize: '10px'}}
          >
            Phản hồi
          </Button>

          <Button
						onClick={()=>{
              onGetListReplyComment(comment.commentId);
              setShowReplyList(!showReplyList);
            }}
						style={{color: '#bbb', fontSize: '10px'}}
					>
						{showReplyList ? <span>&#x25B2; Ẩn phản hồi</span>:<span>&#x25BC; Xem các phản hổi</span>}
					</Button>

          {currentUser.user===comment.postedByUserLoginId &&
            <Button
              aria-label="more"
              id="long-button"
              aria-controls="long-menu"
              aria-expanded={open ? 'true' : undefined}
              aria-haspopup="true"
              onClick={(event)=>handleClick(event)}
              style={{color: '#bbb', fontSize: '10px'}}
            >
              Khác
            </Button>
          }
        </div>
        <div className={classes.listComment}>
          {showReplyList &&
            <div>
              {listReplyComment.length > 0 && listReplyComment.map(comment => (
                <ReplyCommentItem
                  key={comment.commentId}
                  comment={comment}
                  editComment={editComment} 
                  deleteComment={deleteComment}
                  chapterMaterialId={chapterMaterialId}
                  flag={flag}
                  setFlag={setFlag}
                  currentUser={currentUser}
                />
              ))}
            </div>
          }
          {isShowReplyInput &&
            <div>
            <Input
              value={replyCommentMessage}
              onChange={(event)=>setReplyCommentMessage(event.target.value)}
            />
            <Button
              onClick={createReplyComment}
            >
              Phản hồi
            </Button>
            </div>
        }
        </div>  
      </div>
      <Menu
        id="long-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={()=>handleShowInputComment()}>
            Chỉnh sửa
        </MenuItem>
        <MenuItem onClick={handleClickOpenModal}>
            Xoá
        </MenuItem>
      </Menu>
    </div>
  )
}