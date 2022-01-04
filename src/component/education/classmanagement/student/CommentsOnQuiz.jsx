import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
  Button,
  Table,
  Avatar
} from "@material-ui/core";
import PersonIcon from '@material-ui/icons/Person';
import CommentItem from './comment/CommentItem.jsx';
import { request } from "../../../../api";
import { toFormattedDateTime } from "../../../../utils/dateutils";

export default function CommentsOnQuiz(props) {
  const { questionId, open, setOpen } = props;
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [commentFlag, setCommentFlag] = useState(false)
  function handleChangeComment(e) {
    setComment(e.target.value);
  }
  function getCommentList() {
    request("get", "/get-list-comments-on-quiz/" + questionId, (res) => {
      console.log("getCommentList, res = ", res);
      setComments(res.data);
    });
  }
  function handlePostComment() {
    request(
      "post",
      "/post-comment-on-quiz",
      (res) => {
        getCommentList();
      },
      {},
      {
        questionId: questionId,
        comment: comment,
      }
    );
  }
  useEffect(() => {
    getCommentList();
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
        <Table>
          {comments.map((item, index) => (
            // <tr>
            //   <td>
            //     {item.fullNameOfCreator}&nbsp;(
            //     {toFormattedDateTime(item.createdStamp)}
            //     ): &nbsp;&nbsp; {item.commentText}
            //   </td>
            // </tr>
            <CommentItem 
              comment={item}
              setCommentFlag={setCommentFlag}
              commentFlag={commentFlag} 
            />
          ))}
        </Table>
      </div>
    </>
  );
}
