import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
  Button,
} from "@material-ui/core";
import { request } from "../../../../api";
import { toFormattedDateTime } from "../../../../utils/dateutils";

export default function CommentsOnQuiz(props) {
  const { questionId, open, setOpen } = props;
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
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
  }, []);
  return (
    <Dialog open={open}>
      <DialogTitle>Bình luận</DialogTitle>
      <DialogContent>
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            minWidth: "500px",
            border: "1px solid black",
          }}
        ></div>
        {comments.map((item, index) => (
          <li>
            {item.fullNameOfCreator}({toFormattedDateTime(item.createdStamp)}
            ):
            {item.commentText}
          </li>
        ))}
        <div
          style={{
            paddingTop: "30px",
            display: "flex",
            justifyContent: "space-around",
          }}
        >
          <TextField onChange={handleChangeComment}></TextField>
          <Button
            variant="contained"
            color="secondary"
            onClick={handlePostComment}
          >
            POST
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={(e) => setOpen(false)}
          >
            Đóng
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
