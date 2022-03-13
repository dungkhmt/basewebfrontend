import MicroControl from './MicroControl';
import CameraControl from './CameraControl';
import ChatControl from './ChatControl';
import ShareScreenControl from './ShareScreenControl';
import ParticipantControl from './ParticipantControl';
import EndControl from './EndControl';

const FooterControl = (props) => {

  const stopMedia = (type) => {
    if(props.mediaStream) {
      props.setMediaStream(mediaStream => {
        mediaStream.getTracks().forEach(track => {
          if(track.kind === type) {
            mediaStream.removeTrack(track);
            track.stop();
          }
        });
        return mediaStream; 
      });
    }
  }

  const stopVideo = () => {
    stopMedia('video');
  }

  const stopAudio = () => {
    stopMedia('audio');
  }

  return (
    <div className='footer-control'>
      <MicroControl micro={props.micro} setMicro={props.setMicro} mediaStream={props.mediaStream} setMediaStream={props.setMediaStream} stopAudio={stopAudio} />
      <CameraControl camera={props.camera} setCamera={props.setCamera} mediaStream={props.mediaStream} setMediaStream={props.setMediaStream} stopVideo={stopVideo} />
      <ShareScreenControl micro={props.micro} setCamera={props.setCamera} mediaStream={props.mediaStream} setMediaStream={props.setMediaStream} stopVideo={stopVideo} />
      <ChatControl displayBar={props.displayBar} setDisplayBar={props.setDisplayBar} />
      <ParticipantControl displayBar={props.displayBar} setDisplayBar={props.setDisplayBar} />
      <EndControl stompClient={props.stompClient} sendMessage={props.sendMessage} />
    </div>
  );
}

export default FooterControl;