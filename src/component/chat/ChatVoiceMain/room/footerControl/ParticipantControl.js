import Participant from '../icon/Participant';

const ParticipantControl = (props) => {

  const onClickParticipant = () => {
    props.setDisplayBar(props.displayBar === 'participant' ? '' : 'participant');
  }

  return (
    <div className='element-bottom' onClick={onClickParticipant} title='Participant'>
      <Participant />
    </div>
  );
}

export default ParticipantControl;