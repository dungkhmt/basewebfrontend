import { connect } from "react-redux";
import { login } from "../action";
import SignIn from "../component/SignIn";

const mapStateToProps = state => ({ // query de lay ra
  isAuthenticated: state.auth.isAuthenticated,
  isRequesting: state.auth.isRequesting
});

const mapDispatchToProps = dispatch => ({
  login: (username, password) => dispatch(login(username, password))  // truyen action login thanh props login, create action
});

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);
