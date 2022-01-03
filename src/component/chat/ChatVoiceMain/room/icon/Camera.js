import { 
  BsFillCameraVideoOffFill,
  BsFillCameraVideoFill 
} from 'react-icons/bs';

const Camera = (props) => {
  if(props.camera) {
    return (
      <BsFillCameraVideoFill />
    )
  }
  return (
    <BsFillCameraVideoOffFill />
  );
}

export default Camera;