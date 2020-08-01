import {Paper} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Link, useParams} from "react-router-dom";
import {authPost, authPostMultiPart} from "../../api";
import Button from "@material-ui/core/Button";
import StyledDropzone from "../common/StyleDropDzone";
import {failed} from "../../action";


const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(4),
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: 200,
    },
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    maxWidth: 300,
  },
  paper: {
    padding: theme.spacing(2),
  },
}));

function AddProductImg(props) {
  const {productId} = useParams();
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  const [contentIds, setContentIds] = useState([]);
  const classes = useStyles();


  const handleSubmit = (event) => {
    const data = {
      content: contentIds,
    }

    authPost(dispatch, token, "/add-new-image/" + productId, data).then(
      (res) => {
        console.log(res);

        if (res.status === 401) {
          dispatch(failed());
          throw Error("Unauthorized");
        } else if (res.status === 409) {
          alert("Id exits!!");
        } else if (res.status === 201) {
          return res.text();
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }


  const uploadFile = async (files) => {
    let contentIds = [];
    for (const file of files) {
      const data = new FormData();
      data.append("file", file);
      await authPostMultiPart(dispatch, token, "/content/", data).then(
        (res) => {
          console.log(res);
          //setIsRequesting(false);
          if (res.status === 401) {
            dispatch(failed());
            throw Error("Unauthorized");
          } else if (res.status === 201) {
            return res.text();
          }
        },
        (error) => {
          console.log(error);
        }
      ).then((res) => {
        contentIds.push(res);
      });
    }
    setContentIds(contentIds);
  };


  return (
    <div>

      <Typography variant="h5" component="h2">
        Thêm ảnh cho sản phẩm {productId}
      </Typography>
      <Paper className={classes.paper}>
        <Typography variant="h6" component="h2">
          Upload Image
        </Typography>

        <StyledDropzone uploadFile={uploadFile}/>
      </Paper>

      <Link to={"/products/" + productId}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}

        >
          Lưu
        </Button>
      </Link>


    </div>
  );
}

export default AddProductImg;
