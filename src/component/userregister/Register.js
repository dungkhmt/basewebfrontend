import React, {useState} from "react";
import {textField} from "../../utils/FormUtils";
import Button from "@material-ui/core/Button";
import {API_URL} from "../../config/config";
import {useHistory} from "react-router-dom";

export default function Register() {
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

  async function handleSubmit() {
    let notEmptyCheck = e => e !== '';
    let errorMessage = 'Vui lòng nhập đầy đủ các trường trước khi đăng ký';
    if (
      verify(userLoginId, notEmptyCheck, errorMessage) &&
      verify(password, notEmptyCheck, errorMessage) &&
      verify(email, isValidEmail, 'Hãy nhập một email hợp lệ!') &&
      verify(fullName, notEmptyCheck, errorMessage)) {

      let body = {
        userLoginId,
        password,
        email,
        fullName
      };
      let userRegister = await fetch(API_URL + '/user/register/', {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(body),
      }).then(r => r.json());

      if (userRegister && userRegister['userLoginId']) {
        alert('Đăng ký thành công người dùng ' + userLoginId + ', người dùng đang chờ được phê duyệt.');
        history.push('/login')
      } else {
        alert('Đăng ký thất bại, tên người dùng ' + userLoginId + ' có thể đã được sử dụng!');
      }
    }
  }

  return (<div style={{marginLeft: '20px'}}>
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
