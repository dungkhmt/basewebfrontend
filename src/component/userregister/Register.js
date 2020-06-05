import React, {useState} from "react";
import {textField} from "../../utils/FormUtils";
import Button from "@material-ui/core/Button";
import {useDispatch, useSelector} from "react-redux";
import {useHistory} from "react-router-dom";
import {authPost} from "../../api";

export default function Register() {
  const dispatch = useDispatch();
  const token = useSelector(state => state.auth.token);
  const history = useHistory();

  const [userLoginId, setUserLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');

  function verify(field, conditional, errorMessage) {
    if (!conditional(field)) {
      alert(errorMessage);
      return false;
    }
    return true;
  }

  function isValidEmail(email) {
    const re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    return re.test(String(email).toLowerCase());
  }

  function verifyEmail() {
    return verify(email, isValidEmail, 'Hãy nhập một email hợp lệ!');
  }

  async function handleSubmit() {
    let notEmptyCheck = e => e !== '';
    let errorMessage = 'Vui lòng nhập đầy đủ các trường trước khi đăng ký';
    if (
      verify(userLoginId, notEmptyCheck, errorMessage) &&
      verify(password, notEmptyCheck, errorMessage) &&
      verifyEmail() &&
      verify(fullName, notEmptyCheck, errorMessage)) {

      let userRegister = await authPost(dispatch, token, '/user/register/', {
        userLoginId,
        password,
        email,
        fullName
      }).then(r => r.json());

      if (userRegister && userRegister['userLoginId']) {
        alert('Đăng ký thành công người dùng ' + userLoginId + ', người dùng đang chờ được phê duyệt.');
        window.location.reload();
      } else {
        alert('Đăng ký thất bại, tên người dùng ' + userLoginId + ' có thể đã được sử dụng!');
      }
    }
  }

  return (<div>
    <h2>Đăng ký</h2>

    {textField('userLoginId', 'Tên đăng nhập', 'search', userLoginId, setUserLoginId)}
    {textField('password', 'Mật khẩu', 'password', password, setPassword)}
    {textField('email', 'Địa chỉ email', 'search', email, setEmail)}
    {textField('fullName', 'Tên đầy đủ', 'search', fullName, setFullName)}

    <Button variant="contained" color="primary" onClick={handleSubmit}>
      Đăng ký
    </Button>
  </div>);
}
