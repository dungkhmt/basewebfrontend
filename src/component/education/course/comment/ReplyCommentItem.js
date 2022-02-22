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
import { useState, useEffect } from "react";
import { toFormattedDateTime } from "../../../../utils/dateutils";
import { useDispatch, useSelector } from "react-redux";
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

export default function ReplyCommentItem({
  comment,
  deleteComment,
  editComment,
  currentUser
}){
  const [valueCommentMessage, setValueCommentMessage] = useState(comment.commentMessage)
  const [isEdittingComment, setIsEdittingComment] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const open = Boolean(anchorEl);
  const classes = useStyles();

  useEffect(()=>{
    setValueCommentMessage(comment.commentMessage)
  }, [comment])
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
          {
            currentUser.user===comment.postedByUserLoginId &&
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