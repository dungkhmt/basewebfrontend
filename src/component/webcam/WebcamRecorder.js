import React from "react";
import Webcam from "react-webcam";
import Button from "@material-ui/core/Button";
import { API_URL } from "../../config/config";
import { useSelector } from "react-redux";

const UPLOAD_URL = `${API_URL}/webcam/upload`;

export function WebcamRecorder() {
  const token = useSelector((state) => state.auth.token);

  const webcamRef = React.useRef(null);
  const mediaRecorderRef = React.useRef(null);
  const [capturing, setCapturing] = React.useState(false);
  const [recordedChunks, setRecordedChunks] = React.useState([]);

  const handleStartCaptureClick = React.useCallback(() => {
    setCapturing(true);
    mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
      mimeType: "video/webm",
    });
    mediaRecorderRef.current.addEventListener(
      "dataavailable",
      handleDataAvailable
    );
    mediaRecorderRef.current.start();
  }, [webcamRef, setCapturing, mediaRecorderRef]);

  const handleDataAvailable = React.useCallback(
    ({ data }) => {
      if (data.size > 0) {
        setRecordedChunks((prev) => prev.concat(data));
      }
    },
    [setRecordedChunks]
  );

  const handleStopCaptureClick = React.useCallback(() => {
    mediaRecorderRef.current.stop();
    setCapturing(false);
  }, [mediaRecorderRef, webcamRef, setCapturing]);

  const handleDownload = React.useCallback(() => {
    if (recordedChunks.length) {
      let file = new File(recordedChunks, new Date().getTime() + ".webm");
      let data = new FormData();
      data.append("file", file);
      fetch(UPLOAD_URL, {
        method: "POST",
        headers: {
          "X-Auth-Token": token,
        },
        body: data,
      })
        .then((r) => r.json())
        .then((r) => {
          if (r && r["objectId"]) {
            alert("Đã upload thành công, mã video: " + r["objectId"]);
            setRecordedChunks([]);
          }
        });
    }
  }, [recordedChunks]);

  return (
    <>
      <Webcam audio={true} ref={webcamRef} />
      <p />
      {capturing ? (
        <Button
          color={"primary"}
          variant={"contained"}
          onClick={handleStopCaptureClick}
        >
          Stop Capture
        </Button>
      ) : (
        <Button
          color={"primary"}
          variant={"contained"}
          onClick={handleStartCaptureClick}
        >
          Start Capture
        </Button>
      )}
      <p />
      {recordedChunks.length > 0 && (
        <Button
          color={"primary"}
          variant={"contained"}
          onClick={handleDownload}
        >
          Save
        </Button>
      )}
    </>
  );
}
