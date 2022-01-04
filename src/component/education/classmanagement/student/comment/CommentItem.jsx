import { makeStyles } from "@material-ui/core/styles";
import { authPut, authDelete, authGet, authPost } from '../../../../../api';
import {
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Input,
} from '@material-ui/core';
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import ReplyCommentItem from "./ReplyCommentItem";

const useStyles = makeStyles((theme) => ({
	commentItem: {
		display: "flex",
		flexDirection: "row",
		alignItems: 'flex-start',
		marginTop: theme.spacing(1),
		marginBottom: theme.spacing(1),
	},
	commentContent: {
		marginLeft: theme.spacing(1),
	},
	commentActionBtn: {
		color: '#bbb',
		fontSize: '10px',
	},
	listComment: {
		marginLeft: theme.spacing(6),
	}
}));

export default function CommentItem({comment, commentFlag, setCommentFlag}){
	const dispatch = useDispatch();
	const token = useSelector((state) => state.auth.token);
	const [isEditting, setIsEditting] = useState(false)
	const [commentTextEdit, setCommentTextEdit] = useState(comment.commentText)
	const [openModal, setOpenModal] = useState(false);
	const [anchorEl, setAnchorEl] = useState(null);
	const [isShowReplyComment, setIsShowReplyComment] = useState(false)
	const [listReplyComment, setListReplyComment] = useState([]);
	const [isShowInputReply, setIsShowInputReply] = useState(false);
	const [replyCommentText, setReplyCommentText] = useState("");
	const [flag, setFlag] = useState(false)
	const classes = useStyles();

	useEffect(()=>{
		
		let getListReply = async () =>{
			let res = await authGet(
				dispatch,
				token,
				`/get-list-reply-comments-on-quiz/${comment.commentId}`
			);
			setListReplyComment(res);
		}

		getListReply();
	}, [flag])

	const onHandleUpdateComment = () => {
		editComment();
		setIsEditting(false)
	}

	const handleClickOpenModal = () => {
		setOpenModal(true);
	  };
	
	const handleCloseModal = () => {
		//close menu edit/delete
		setAnchorEl(null);
		setOpenModal(false);
	};

	const onConfirmDeleteComment = () => {
		deleteComment();
		setAnchorEl(null);
		setOpenModal(false);
	} 

	//function with call api
	//get list reply of comment
	const onGetListReplyComment = async (commentId) => {
		if(isShowReplyComment===false){
			let res = await authGet(
				dispatch,
				token,
				`/get-list-reply-comments-on-quiz/${commentId}`
			);
			setListReplyComment(res);
			console.log(listReplyComment)
		}
		setIsShowReplyComment(!isShowReplyComment)
	}

	//edit comment
	const editComment = async () => {
		let body = {
			commentText: commentTextEdit
		}
	
		let edittedComment = await authPut(
		  dispatch,
		  token,
		  `/edit-comment-on-quiz/${comment.commentId}`,
		  body
		)

		setCommentFlag(!commentFlag);
	}

	//delete comment
	const deleteComment = async () => {
		let edittedComment = await authDelete(
		  dispatch,
		  token,
		  `/delete-comment-on-quiz/${comment.commentId}`,
		  {}
		)

		setCommentFlag(!commentFlag);

	}

	//post reply comment
	const createComment = async () => {
		let body = {
			comment: replyCommentText,
			questionId: comment.questionId,
			replyToCommentId: comment.commentId,
		}
	  
		if(comment.commentMessage!==""){
			let commentPost = await authPost(
			  dispatch,
			  token,
			  "/post-comment-on-quiz",
			  body
			);
		}
		setReplyCommentText("")
		setFlag(!flag)
	}

  return (
	<div>
		<div className={classes.commentItem}>
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
				<Button onClick={handleCloseModal} color="primary">
					Hủy bỏ
				</Button>
				<Button onClick={()=>onConfirmDeleteComment()} color="secondary">
					Xóa
				</Button>
				</DialogActions>
			</Dialog>
			<Avatar>{comment.fullNameOfCreator.split(' ').pop().charAt(0).toUpperCase()}</Avatar>
			<div className={classes.commentContent}>
				<div>
					<b>{comment.fullNameOfCreator}</b>&nbsp;
					<span style={{marginLeft: '5px'}}>2021/12/22 22:05</span>
				</div>
				<div>
					{
						!isEditting? comment.commentText : (
							<div>
							<Input
								value={commentTextEdit}
								onChange={(event)=>setCommentTextEdit(event.target.value)}
								type='text'
							/>
							<Button
								className={classes.commentActionBtn}
								onClick={()=>setIsEditting(false)}
							>Hủy</Button>
							<Button onClick={()=>onHandleUpdateComment()}>Cập nhật</Button>
							</div>
						)
					}
				</div>
				<div>
					<Button
						onClick={()=>setIsShowInputReply(!isShowInputReply)}
						className={classes.commentActionBtn}
					>
						Phản hồi
					</Button>
					<Button
						onClick={()=>onGetListReplyComment(comment.commentId)}
						className={classes.commentActionBtn}
					>
						{isShowReplyComment ? <span>&#x25B2; Ẩn phản hồi</span>:<span>&#x25BC; Xem các phản hổi</span>}
					</Button>
					<Button
						className={classes.commentActionBtn}
						onClick={()=>setIsEditting(!isEditting)}
					>
						Chỉnh sửa
					</Button>
					<Button
						className={classes.commentActionBtn}
						onClick={handleClickOpenModal}
					>
						Xóa
					</Button>
				</div>
			</div>
    	</div>
		<div className={classes.listComment}>
			{isShowReplyComment &&
				<div>
					{listReplyComment.length > 0 && listReplyComment.map(comment => (
						<ReplyCommentItem comment={comment} flag={flag} setFlag={setFlag}/>
					))}
				</div>
			}
			{isShowInputReply &&
				<div>
				<Input
					value={replyCommentText}
					onChange={(event)=>setReplyCommentText(event.target.value)}
				/>
				<Button
					onClick={createComment}
				>
					Phản hồi
				</Button>
				</div>
			}
		</div>
    </div>
  )
}