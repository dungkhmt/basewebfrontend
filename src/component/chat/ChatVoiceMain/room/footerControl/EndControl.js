import { useHistory } from 'react-router';
import End from '../icon/End';

const EndControl = (props) => {

  const history = useHistory();

  const onClickEnd = () => {
    props.sendMessage('leave');
    props.stompClient.disconnect();
    history.push('/chat/voice/main');
  }

  return (
    <div id='end-room' onClick={onClickEnd}>
      <End />
    </div>
  );
}

export default EndControl;