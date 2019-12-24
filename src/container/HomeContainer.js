import { connect } from "react-redux";
import { getMenu } from "../action";
import Home from "../component/Home";

const mapStateToProps = state => ({
  menu: state.menu.menu
});

const mapDispatchToProps = dispatch => ({
  getMenu: () => dispatch(getMenu())
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
