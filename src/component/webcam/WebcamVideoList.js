import React, { useEffect, useState } from "react";
import { toFormattedDateTime } from "../../utils/dateutils";
import Button from "@material-ui/core/Button";
import { useDispatch, useSelector } from "react-redux";
import { authGet } from "../../api";
import MaterialTable from "material-table";
import { Dialog } from "@material-ui/core";
import DialogContent from "@material-ui/core/DialogContent";
import { API_URL } from "../../config/config";

const COLUMN_DISPLAY = [
  "userLoginId",
  "createdDate",
  "contentId",
  "popupVideo",
];
const COLUMN_RENAME = {
  userLoginId: "Người dùng đăng nhập",
  createdDate: "Ngày tạo",
  contentId: "Mã content",
  popupVideo: " ",
};
const GET_VIDEO_URL = "/webcam/get";

export function WebcamVideoList() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  const [webcamVideos, setWebcamVideos] = useState([]);

  const [columns, setColumns] = useState([]);

  const [columnRender] = useState({
    createdDate: (rowData) => toFormattedDateTime(rowData["createdDate"]),
    popupVideo: (rowData) => (
      <Button
        color={"primary"}
        variant={"contained"}
        onClick={(e) => openPopupVideo(rowData["objectId"])}
      >
        Play
      </Button>
    ),
  });

  const [videoUrl, setVideoUrl] = useState("");

  const [videoPopupOpen, setVideoPopupOpen] = useState(false);

  async function getWebcamVideos() {
    let webcamVideos = await authGet(dispatch, token, `/webcam/all`);
    let webcamVideoKeys = Object.keys(webcamVideos);
    if (webcamVideoKeys.length > 0) {
      setWebcamVideos(webcamVideos);
      setColumns(
        COLUMN_DISPLAY.map((key) => ({
          field: key,
          title: COLUMN_RENAME[key] || key,
          render: columnRender[key] || null,
        }))
      );
    }
  }

  useEffect(() => {
    getWebcamVideos().then((r) => r);
  }, []);

  async function openPopupVideo(objectId) {
    fetch(API_URL + GET_VIDEO_URL + "?objectId=" + objectId, {
      method: "GET",
      headers: {
        "content-type": "application/json",
        "X-Auth-Token": token,
      },
    })
      .then((r) => r.blob())
      .then((blob) => {
        setVideoUrl(window.URL.createObjectURL(blob));
        setVideoPopupOpen(true);
      });
  }

  return (
    <div>
      <MaterialTable
        columns={columns}
        data={webcamVideos}
        title={"Danh sách webcam video đã ghi"}
        options={{ search: false }}
      />
      <Dialog
        open={videoPopupOpen}
        onClose={() => setVideoPopupOpen(false)}
        maxWidth={"xl"}
      >
        <DialogContent>
          <video controls src={videoUrl} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
