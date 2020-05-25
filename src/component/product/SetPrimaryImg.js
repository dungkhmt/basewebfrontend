import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Link, useParams} from "react-router-dom";
import {authGet, authPost} from "../../api";
import {Button, Grid} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import ImageItem from "./ImageItem";
import {failed} from "../../action";


function SetPrimaryImg(props) {
  const {productId} = useParams();
  const [primaryImgId, setPrimaryImgId] = useState();
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  const [data, setData] = useState([]);


  const handleSubmit = event => {
    const d = {
      primaryImgId: primaryImgId,
    }
    authPost(dispatch, token, "/set-product-primary-img/" + productId, d).then(
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
    )
  }


  useEffect(() => {
    authGet(dispatch, token, "/get-list-product-img/" + productId)
      .then(
        (res) => {
          console.log("res", res);
          setData(res.productImageInfoModels);
          setPrimaryImgId(res.primaryImgId);

        }
      )
  }, []);


  return (


    <div>
      <Typography variant="h5" component="h2">
        Lựa chọn ảnh hiển thị cho sản phẩm
      </Typography>

      <div
        style={{
          display: "flex",
          marginTop: "200px",
          justifyContent: "center",
        }}
      >
        <Grid container spacing={12}>
          {data.map((item) => (
            <Grid item xs={3}>
              <ImageItem
                item={item}
                key={item.id}
                setSelectedImage={setPrimaryImgId}
                selectedImage={primaryImgId}
              />
            </Grid>
          ))}
        </Grid>


      </div>
      <br/><br/><br/><br/><br/>

      <Grid container spacing={12}>
        <Grid item xs={6}>

        </Grid>
        <Grid item xs={6}>
          <Link to={"/product-edit/" + productId}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}

            >
              Lưu
            </Button>
          </Link>
        </Grid>
      </Grid>


    </div>


  );
}

export default SetPrimaryImg;
