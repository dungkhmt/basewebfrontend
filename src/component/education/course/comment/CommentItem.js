import { makeStyles } from "@material-ui/core/styles";
import { Avatar, TextField, Button} from '@material-ui/core';
import { useState, useRef } from "react";
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

export default function CommentItem({comment, getMessageFromInput, commentOnCourse}){
  const inputRef = useRef(null)
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [showReplyList, setShowReplyList] = useState(false);
  const [value, setValue] = useState("");
  const {listReplyComments} = comment;
  const classes = useStyles();

  const onChangeValue = (event) => {
    setValue(event.target.value);
    getMessageFromInput(event.target.value, comment.commentId);
  }

  const refToInPutComment = () => {
    setShowReplyInput(!showReplyInput)
    if(showReplyInput){
      inputRef.current.focus();
    }
  }

  const hideOrShowReplyList = () => {
    setShowReplyList(!showReplyList)
  }
  return(
    <div
      className={classes.root}
    >
      <Avatar>
        {comment.fullNameOfCreator.split(' ').pop().charAt(0).toUpperCase()}
      </Avatar>
      <div>
        <b>{comment.fullNameOfCreator}</b>
        <div
          className={classes.growItem}
        >
          {comment.commentMessage}
        </div>
        <div>
          <Button onClick={()=>refToInPutComment()} style={{color: '#bbb', fontSize: '10px'}}>
            Phản hồi
          </Button>

          {listReplyComments.length>0 &&
            <Button onClick={hideOrShowReplyList} style={{color: '#1976d2', fontSize: '10px'}}>
              {showReplyList ? <span>&#x25B2; Ẩn các câu trả lời</span>:<span>&#x25BC; Xem các câu trả lời</span>}
            </Button>
          }
        </div>
        {showReplyList &&
          <div>
            {listReplyComments.length>0 && 
            listReplyComments.map(cmt=>
              <div className={classes.root}>
                <Avatar style={{width: '24px', height: '24px', fontSize: '14px'}}>
                  {/*Get first letter of full name */}
                  {cmt.fullNameOfCreator && cmt.fullNameOfCreator.split(' ').pop().charAt(0).toUpperCase()}
                </Avatar>
                <div>
                  <b>{cmt.fullNameOfCreator}</b>
                  <div
                    className={classes.growItem}
                  >
                    {cmt.commentMessage}
                  </div>
                </div>
              </div>
              )}
          </div>
          }
        {showReplyInput &&
        <div className={classes.inputComment}>
          <TextField
            style={{fontSize: '10px'}}
            className={classes.customTextField}
            placeholder="Phản hồi bình luận"
            value={value}
            onChange={(event)=>onChangeValue(event)}
            inputRef={inputRef}
          />
          <Button
            className={classes.btnComment}
            onClick={()=>{
              commentOnCourse();
              setValue("")
            }}
          >
            Phản hồi
          </Button>
        </div>
        }
      </div>
    </div>
  )
}