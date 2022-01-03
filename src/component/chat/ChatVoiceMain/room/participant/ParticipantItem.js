const ParticipantItem = (props) => {
  return (
    <div className='participant-item'>
      <div className='avatar' style={{ backgroundColor: `rgb(${150 + Math.floor(Math.random()*100)}, ${150 + Math.floor(Math.random()*100)}, ${150 + Math.floor(Math.random()*100)})`}}>
        {props.data.name[0].toUpperCase()}
      </div>
      <div className='participant-name'>
        {props.data.name}
      </div>
    </div>
  );
}

export default ParticipantItem;