import { Card, CardContent } from "@material-ui/core/";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { Link, useHistory } from "react-router-dom";
import { authGet, authPost } from "../../../api";
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
  }
}));

function StudentCourseChapterMaterialDetail() {
  const [comment, setComment] = useState("");
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
    console.log(cmtOnVideo);
  }
  const commentOnCourse = async () => {
    let body = {
      commentMessage: comment.commentMessage,
      eduCourseMaterialId: chapterMaterialId,
      replyToCommentId: comment.replyToCommentId,
    }

    if(comment.commentMessage!==""){
      let commentPost = await authPost(
        dispatch,
        token,
        "/edu/class/comment",
        body
      );
    }

    // if flag change, rerender listcomment
    setFlag(!flag)
    //   console.log(commentPost);
    //   if(commentPost.commentId){
    //     if(!commentPost.replyToCommentId){
    //       setListComment([
    //         ...listComment,
    //         commentPost
    //       ])
    //     } else {
    //       let newArr = listComment;

    //       newArr.map(cmt => {
    //         if(cmt.commentId === commentPost.replyToCommentId){
    //           cmt.listReplyComments.push(commentPost);
    //         }
    //       })

    //       setListComment(newArr);
    //     }
    //   }
    //   console.log(listComment)
    // }
  }

  const getMessageFromInput = (message, replyToCommentId) => {
    setComment({
      ...comment,
      commentMessage: message,
      replyToCommentId
    })
  }

  useEffect(() => {
    getCourseChapterMaterialDetail();
    //setSourceId(chapterMaterial.sourceId);
    getListCommentsEduCourseMaterial();
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
      <InputComment
        getMessageFromInput={getMessageFromInput}
        commentOnCourse={commentOnCourse}
      />
      {listComment.length=== 0 &&<div className={classes.noComment}>Video này chưa có bình luận nào</div>}
      {listComment.length >= 0 &&
        listComment.map(cmt => 
        <CommentItem
          comment={cmt}
          getMessageFromInput={getMessageFromInput}
          commentOnCourse={commentOnCourse}
        />)
      }
    </Card>
    </>
  );
}

export default StudentCourseChapterMaterialDetail;
