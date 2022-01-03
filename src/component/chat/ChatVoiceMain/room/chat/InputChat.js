import { useState } from "react";
import { IoSend } from 'react-icons/io5';

const InputMess = (props) => {
  const [content, setContent] = useState('');

  const submitOnEnter = (e) => {
    if(e.keyCode === 13 && e.shiftKey === false) {
      submit();
      e.preventDefault();
    }
  }
  
  const submit = () => {
    if(content.trim() !== '') {
      props.sendMessage('chat', content.trim());
      setContent('');
    }
  }

  return (
    <div>
      <textarea 
        className='textarea-chat' 
        rows='1' 
        value={content} 
        onChange={e => setContent(e.target.value)}
        onKeyDown={submitOnEnter}
      />
      <IoSend style={{ color: '#2063ff', fontSize: '20px', margin: '7px 0 0 15px', position: 'absolute', cursor: 'pointer' }} onClick={submit} />
    </div>
  );
}

export default InputMess;