import { 
  AiOutlineAudio,
  AiOutlineAudioMuted 
} from 'react-icons/ai';

const Micro = (props) => {
  if(props.micro) {
    return (
      <AiOutlineAudio />
    )
  }
  return (
    <AiOutlineAudioMuted />
  );
}

export default Micro;