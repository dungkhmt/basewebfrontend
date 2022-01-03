import Micro from "../icon/Micro";
import getUserMedia from "./getUserMedia";

const MicroControl = (props) => {

  const onClickMicro = async () => {
    try {
      props.setMicro(!props.micro);
      if(!props.micro) {
        const srcMicro = await getUserMedia('micro');
        console.log(props.mediaStream)
        props.setMediaStream(mediaStream => mediaStream ? srcMicro.getTracks().forEach(track => mediaStream.addTrack(track)) : srcMicro);
      } else {
        props.stopAudio();
      }
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className='element-bottom' onClick={onClickMicro} title='Micro'>
      <Micro micro={props.micro} />
    </div>
  );
}

export default MicroControl;