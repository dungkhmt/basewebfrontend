import React from "react";
import { connect } from "react-redux";

const TungCao = ({counter, input, runApi, onInc, onDec, onInput}) => (
  <div>
    <h2>Cao Thanh Tung</h2>
    <h2>{counter}</h2>
    <button onClick={onInc} type="button" className="btn btn-primary">INC</button>
    <button onClick={onDec} type="button" className="btn btn-secondary">DEC</button>
    <h2>{input}</h2>
    <input onInput={onInput} className="form-control" type="text" />
    <button onClick={runApi} type="button" className="btn btn-secondary">Run API</button>
  </div>
);

const mapStateToProps = (state, props) => ({
  counter: state.counter,
  input: state.input,
});

const mapDispatchToProps = (dispatch, props) => ({
  onInc: () => dispatch({ type: "INC_ASYNC" }),
  onDec: () => dispatch({ type: "DEC" }),
  onInput: e => dispatch({ type: "CHANGED", text: e.target.value }),
  runApi: () => dispatch({ type: "RUN_API" }),
});

export default connect(mapStateToProps, mapDispatchToProps)(TungCao);
