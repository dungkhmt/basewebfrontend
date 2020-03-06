import React, { useState } from "react";
import { pushSuccessNotification } from "../actions";
import { connect } from "react-redux";

const SecurityGroup = ({ sequence, push }) => {
  const [string, setString] = useState("");
  return (
    <div>
      <input type="text" onChange={e => setString(e.target.value)} />
      <button onClick={() => push(sequence, string)}>PUSH</button>
    </div>
  );
};

const mapState = state => ({
  sequence: state.notifications.sequence
});

const mapDispatch = dispatch => ({
  push: (id, message) => dispatch(pushSuccessNotification(id, message))
});

export default connect(mapState, mapDispatch)(SecurityGroup);
