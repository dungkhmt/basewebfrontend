const Main = (props) => {

  return (
    <div className={`main-room transition${props.display !== '' ? ' mini-main' : ' full-main'}`}>
      <video className='main-video' id='host' ref={props.hostVideoRef} autoPlay muted></video>
      <video className='main-video' id='guest' ref={props.guestVideoRef} autoPlay></video>
    </div>
  );
}

export default Main;