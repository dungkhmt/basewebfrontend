import { connect } from "react-redux";
import { login } from "../action";
import SignIn from "../component/SignIn";

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  isRequesting: state.auth.isRequesting
});

const mapDispatchToProps = dispatch => ({
  login: (username, password) => dispatch(login(username, password))
});

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);
