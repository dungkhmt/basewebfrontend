import { makeStyles } from "@material-ui/core/styles";
import { DropzoneArea, DropzoneDialog } from "material-ui-dropzone";
import React from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { API_URL } from "../../config/config";

const useStyle = makeStyles((theme) => ({
  formControl: {
    marginTop: 100,
  },
}));

function Upload(props) {
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  const classes = useStyle();
  const history = useHistory();

  const fileField = document.querySelector('input[type="file"]');

  const [isRequesting, setIsRequesting] = useState(true);

  const handlesubmit = (file) => {
    console.log(file);
    setIsRequesting(true);
    let formData = new FormData();
    formData.append("file", file[0]);

    let requestOption = {
      method: "POST",
      headers: { "X-Auth-Token": token },
      body: formData,
    };

    fetch(API_URL + "/upload", requestOption)
      .then((response) => response.json())
      .then((result) => {
        console.log("Success", result);
      })
      .catch((error) => {
        console.log("Error", error);
      });
    window.location.reload();
  };
  return (
    <div>
      <DropzoneDialog
        acceptedFiles={[
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        ]}
        useChipsForPreview={true}
        showPreviews={true}
        showPreviewsInDropzone={false}
        showFileNamesInPreview={true}
        cancelButtonText={"HUỶ"}
        submitButtonText={"LƯU"}
        filesLimit={1}
        maxFileSize={5000000}
        open={isRequesting}
        onChange={(file) => {
          console.log("onChange", file);
        }}
        onClose={() => {
          history.replace("/schedule/view");
        }}
        onSave={(file) => {
          handlesubmit(file);
        }}
      />
    </div>
  );
}
export default Upload;
