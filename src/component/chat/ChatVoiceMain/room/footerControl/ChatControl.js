import Chat from "../icon/Chat";

const ChatControl = (props) => {

  const onClickChat = () => {
    props.setDisplayBar(props.displayBar === 'chat' ? '' : 'chat');
  }

  return (
    <div className='element-bottom' onClick={onClickChat} title='Chat'>
      <Chat />
    </div>
  );
}

export default ChatControl;