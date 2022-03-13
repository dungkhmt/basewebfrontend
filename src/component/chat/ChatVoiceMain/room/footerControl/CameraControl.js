import getUserMedia from "./getUserMedia";
import Camera from "../icon/Camera";

const CameraControl = (props) => {

  const onClickCamera = async () => {
    try {
      props.setCamera(!props.camera);
      if(!props.camera) {
        const srcCamera = await getUserMedia("camera");
        if(props.mediaStream) {
          props.mediaStream.getTracks().forEach(track => srcCamera.addTrack(track));
        }
        props.stopVideo();
        props.setMediaStream(srcCamera);
      } else {
        props.stopVideo();
      }
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className='element-bottom' onClick={onClickCamera} title='Camera'>
      <Camera camera={props.camera} />
    </div>
  );
}

export default CameraControl;