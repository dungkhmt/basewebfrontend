import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
  Button,
  Table,
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
    <>
      <div>
        <Table>
          {comments.map((item, index) => (
            <tr>
              <td>
                {item.fullNameOfCreator}&nbsp;(
                {toFormattedDateTime(item.createdStamp)}
                ): &nbsp;&nbsp; {item.commentText}
              </td>
            </tr>
          ))}
        </Table>
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
        </div>
      </div>
    </>
  );
}
