import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {authPost, authPostMultiPart, authGet, authGetImg} from "../../api";
import TextField from "@material-ui/core/TextField";
import {useParams} from "react-router-dom";
import { Button } from "@material-ui/core";
import { useHistory, Link } from "react-router-dom";



function arrayBufferToBase64(buffer) {
  var binary = "";
  var bytes = [].slice.call(new Uint8Array(buffer));

  bytes.forEach((b) => (binary += String.fromCharCode(b)));

  return window.btoa(binary);
}

function ProductEdit(props){
    const {productId} = useParams();
    const token = useSelector((state) => state.auth.token);
    const dispatch = useDispatch();
    const [data, setData] = useState({});
    const [img, setImg] = useState([]);

    useEffect(() => {
        authGet(dispatch, token, "/get-product-for-edit/" + productId).then(
          (res) => {
            console.log("res", res);
            setData(res);
          },
          (error) => {
            setData([]);
          }
        );

      }, []);



  // useEffect(() => {
  //   let alFetch = [];
  //   if (data.contentUrls !== undefined) {
  //     for (const url of data.contentUrls) {
  //       alFetch.push(
  //         authGetImg(dispatch, token, url).then(
  //           (res) => {
  //             return res.arrayBuffer();
  //           },
  //           (error) => {
  //             // setData([]);
  //           }
  //         ).then((data) => {
  //           let base64Flag = "data:image/jpeg;base64,";
  //           let imageStr = arrayBufferToBase64(data);
  //           return base64Flag + imageStr;
  //         })
  //       );
  //     }
  //   }
  //   Promise.all(alFetch).then((res) => {
  //     setImg(res);
  //   });
  // }, [data]);



    return(
        <div>
          <Link to={"/set-product-primary-img/"+productId}>
            <Button
              variant="contained"
              color="primary"
            >
              Thay đổi ảnh hiển thị
            </Button>
          </Link>


        </div>


    );
}
export default ProductEdit;