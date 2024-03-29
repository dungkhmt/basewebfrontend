import { Card, CardContent, Avatar, TextField, Button } from "@material-ui/core/";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { Link, useHistory } from "react-router-dom";
import { authGet, authPost, authDelete, authPut } from "../../../api";
import Player from "../../../utils/Player";
import InputComment from "./comment/InputComment";
import CommentItem from "./comment/CommentItem";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(4),
    marginTop: theme.spacing(4)
  },

  noComment: {
    margin: '10px auto',
    textAlign: 'center',
    fontSize: '16px',
    fontWeight: 'bold'
  },

  inputComment: {
    display: "flex",
    flexDirection: "row",
    alignItems: 'center',
  },
  growItem: {
    flexGrow: 1,
    marginLeft: theme.spacing(1)
  },
  btnComment: {
    background: '#1976d2',
    color: 'white',
    marginLeft: theme.spacing(1),
    '&:hover': {
      backgroundColor: '#ccc',
      color: '#1976d2',
  }
  },
}));

function StudentCourseChapterMaterialDetail() {
  const [comment, setComment] = useState({
    commentMessage: "",
  });
  const [flag, setFlag] = useState(false);
  const [listComment, setListComment] = useState([]);
  const params = useParams();
  const chapterMaterialId = params.chapterMaterialId;
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const classId = useSelector((state) => state.class.classId);
  const history = useHistory();
  const [chapterMaterial, setChapterMaterial] = useState(null);
  const [sourceId, setSourceId] = useState(null);
  const [chapterId, setChapterId] = useState(null);
  const [chapterName, setChapterName] = useState(null);
  const [currentUser, setCurrentUser] = useState({});
  const classes = useStyles();

  async function getCourseChapterMaterialDetail() {
    // let res = await authGet(
    //   dispatch,
    //   token,
    //   "/edu/class/get-course-chapter-material-detail/" + chapterMaterialId
    // );
    let res = await authGet(
      dispatch,
      token,
      `/edu/class/get-course-chapter-material-detail/${chapterMaterialId}/${classId}`
    );
    setChapterMaterial(res);
    console.log("getCourseChapterMaterialDetail ", res);
    setSourceId(res.sourceId);
    setChapterId(res.eduCourseChapter.chapterId);
    setChapterName(res.eduCourseChapter.chapterName);
  }

  async function getListCommentsEduCourseMaterial(){
    let res = await authGet(
      dispatch,
      token,
      `/edu/class/comment/${chapterMaterialId}`
    );
    
    let cmtOnVideo = res.filter(cmt => {return cmt.replyToCommentId===null});
    let cmtReplyCmt = res.filter(cmt => {return cmt.replyToCommentId!==null});

    cmtOnVideo.map(cmtOnVid=>{
      cmtOnVid.listReplyComments = [];
      return cmtOnVid;
    })
    cmtReplyCmt.forEach(cmt => {
      cmtOnVideo.map(cmtOnVid=>{
        if(cmtOnVid.commentId === cmt.replyToCommentId){
          cmtOnVid.listReplyComments.push(cmt);
        }

        return cmtOnVid;
      })
    })
    setListComment(cmtOnVideo);
  }

  async function getListMainCommentOnCourse(){
    let res = await authGet(
      dispatch,
      token,
      `/edu/class/main-comment/${chapterMaterialId}`
    )

    console.log(res);
    setListComment(res);
  }

  const commentOnCourse = async () => {
    let body = {
      commentMessage: comment.commentMessage.trim(),
      eduCourseMaterialId: chapterMaterialId,
      replyToCommentId: comment.replyToCommentId,
    }

    if(comment.commentMessage.trim().length!== 0){
      let commentPost = await authPost(
        dispatch,
        token,
        "/edu/class/comment",
        body
      );
      setComment({
        ...comment,
        commentMessage: ""
      })
  
      // if flag change, rerender listcomment
      setFlag(!flag)
    }
  }

  const deleteComment = async (cmtId) => {
    let deletedCmt = await authDelete(
      dispatch,
      token,
      `/edu/class/comment/${cmtId}`,
      {}
    );

    setFlag(!flag)
  }

  const editComment = async (cmtId, commentMessage) => {
    let body = {
      commentMessage: commentMessage.trim(),
    }

    if(commentMessage.trim().length !== 0){
      let edittedComment = await authPut(
        dispatch,
        token,
        `/edu/class/comment/${cmtId}`,
        body
      )
  
      setFlag(!flag)
    }
  }

  const getMessageFromInput = (message, replyToCommentId) => {
    setComment({
      ...comment,
      commentMessage: message,
      replyToCommentId
    })
  }

  // get data of current user login
  const getCurrentUser = async () => {
    let user = await authGet(
      dispatch,
      token,
      `/my-account`
    );

    setCurrentUser({
      ...user
    })
  }

  useEffect(() => {
    getCourseChapterMaterialDetail();
    //setSourceId(chapterMaterial.sourceId);
    //getListCommentsEduCourseMaterial();
    getListMainCommentOnCourse();
    getCurrentUser();
  }, [flag]);

  return (
    <>
    <Card>
      <CardContent>
        Quay về chương:{" "}
        <Link to={"/edu/student/course/chapter/detail/" + chapterId}>
          {chapterName}
        </Link>
        <Player id={sourceId} />
      </CardContent>
    </Card>
    <Card className={classes.root}>
      <div className={classes.inputComment}>
        <Avatar>
          U
        </Avatar>
        <TextField
          className={classes.growItem}
          placeholder="Viết gì đó về video này"
          value={comment.commentMessage}
          onChange={(event)=>{setComment({
            ...comment,
            commentMessage: event.target.value
          })}}
        />
        <Button
          className={classes.btnComment}
          onClick={commentOnCourse}
        >
          Bình luận
        </Button>
      </div>
      {listComment.length=== 0 &&<div className={classes.noComment}>Video này chưa có bình luận nào</div>}
      {listComment.length >= 0 &&
        listComment.map(cmt => 
        <CommentItem
          comment={cmt}
          chapterMaterialId={chapterMaterialId}
          getMessageFromInput={getMessageFromInput}
          commentOnCourse={commentOnCourse}
          deleteComment={deleteComment}
          editComment={editComment}
          currentUser={currentUser}
        />)
      }
    </Card>
    </>
  );
}

export default StudentCourseChapterMaterialDetail;
