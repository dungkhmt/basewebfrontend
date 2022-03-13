import Micro from "../icon/Micro";
import getUserMedia from "./getUserMedia";

const MicroControl = (props) => {

  const onClickMicro = async () => {
    try {
      props.setMicro(!props.micro);
      if(!props.micro) {
        const srcMicro = await getUserMedia('micro');
        if(props.mediaStream) {
          props.mediaStream.getTracks().forEach(track => srcMicro.addTrack(track));
        }
        props.setMediaStream(srcMicro);
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