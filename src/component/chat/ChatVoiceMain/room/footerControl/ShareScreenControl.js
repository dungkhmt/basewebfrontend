import ShareScreen from "../icon/ShareScreen";
import getDisplayMedia from "./getDisplayMedia";

const ShareScreenControl = (props) => {

  const onClickShareScreen = async () => {
    try {
      props.setCamera(false);
      const srcScreen = await getDisplayMedia();
      props.stopVideo();
      props.setMediaStream(mediaStream => mediaStream ?
        srcScreen.getTracks().forEach(track => mediaStream.addTrack(track)) : srcScreen);
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className='element-bottom' style={{ marginLeft: '29%' }} onClick={onClickShareScreen} title='Share Screen'>
      <ShareScreen />
    </div>
  );
}

export default ShareScreenControl;