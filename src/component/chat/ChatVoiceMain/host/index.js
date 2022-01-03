import { useHistory } from 'react-router';
import { request } from "../../../../api";
import PrimaryButton from "../../../button/PrimaryButton";

const Host = () => {

  const history = useHistory();

  const meetNow = async() => {
    request('post', '/room/create', (res) => {
      history.push({
        pathname: `main/${res.data.roomId}`
      });
    }, {
      onError: (e) => {
        console.log('co loi')
      }
    }, {
      roomName: 'hoang123123',
    });
  }

  return (
    <div>
      <div className='list-room'></div>
      <PrimaryButton onClick={meetNow} id='button-meet-now'>
        Meet Now
      </PrimaryButton>
    </div>
  );
}

export default Host;