import React, { useState } from "react";
import { authPostMultiPart, authGet, request } from "../../api";
import { useDispatch, useSelector } from "react-redux";

export default function ChatMain() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const id = "myfile";
  const [fileId, setFileId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  function handleChangeFile(e) {
    setSelectedFile(e.target.files[0]);
  }
  function handleUpload() {
    let body = {
      id: id,
    };
    let formData = new FormData();
    formData.append("inputJson", JSON.stringify(body));
    formData.append("file", selectedFile);

    authPostMultiPart(dispatch, token, "/content/create", formData)
      .then((res) => {
        console.log("result upload = ", res);

        setFileId(res.id);
      })
      .catch((e) => {
        console.error("EXCEPTION ", e);
      });
  }

  function downloadFile() {
    authGet(dispatch, token, "/content/get/" + fileId)
      .then((res) => {
        console.log("result download = ", res);
      })
      .catch((e) => {
        console.error(e);
      });
  }

  return (
    <div>
      <h1>This is a chat messenger</h1>
      <input type="file" onChange={handleChangeFile}></input>
      <button onClick={handleUpload}>Upload</button>
      <input
        type="text"
        value={fileId}
        onChange={(e) => setFileId(e.target.value)}
      ></input>
      <button onClick={downloadFile}>Download</button>
    </div>
  );
}
