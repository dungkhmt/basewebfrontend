import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Table,
  Avatar
} from "@material-ui/core";
import PersonIcon from '@material-ui/icons/Person';
import CommentItem from './comment/CommentItem.jsx';
import { request, authPost } from "../../../../api";
import { useDispatch, useSelector } from "react-redux";

export default function CommentsOnQuiz(props) {
  const { questionId, open, setOpen } = props;
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [commentFlag, setCommentFlag] = useState(false)
  const [currentUser, setCurrentUser] = useState({});
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  function handleChangeComment(e) {
    setComment(e.target.value);
  }
  function getCommentList() {
    request("get", "/get-list-comments-on-quiz/" + questionId, (res) => {
      console.log("getCommentList, res = ", res);
      setComments(res.data);
    });
  }
  async function handlePostComment() {
    let body = {
      questionId,
      comment: comment.trim()
    }

    if(comment.trim().length!== 0){
      let commentPost = await authPost(
        dispatch,
        token,
        "/post-comment-on-quiz",
        body
      );
      setComment("");
      setCommentFlag(!commentFlag);
    }
  }

  // get data of current user login
  const getCurrentUser = async () => {
    request(
      "get",
      "/my-account/",
      (res) => {
        let data = res.data;
        setCurrentUser({
          ...data
        });
      },
      { 401: () => {} }
    );
  }

  useEffect(() => {
    getCommentList();
    getCurrentUser();
  }, [commentFlag]);
  return (
    <>
      <div>
        <div
          style={{
            padding: "30px 0px 30px 0px",
            display: "flex",
          }}
        >
          <Avatar style={{height: '40px', width: '40px', marginRight: '20px'}}>
            <PersonIcon />
          </Avatar>
          <TextField
            value={comment}
            onChange={handleChangeComment}
            style={{flexGrow: 1, marginRight: '20px'}}
            placeholder="Bình luận về quiz này"
          />
          <Button
            variant="contained"
            color="secondary"
            onClick={handlePostComment}
          >
            Bình luận
          </Button>
        </div>
        <div>
          {comments.map((item, index) => (
            <CommentItem 
              comment={item}
              setCommentFlag={setCommentFlag}
              commentFlag={commentFlag}
              currentUser={currentUser}
            />
          ))}
        </div>
      </div>
    </>
  );
}
