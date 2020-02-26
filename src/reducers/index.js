import {
  ADD_ITEM,
  REMOVE_ITEM,
  EDIT_TEST_STRING,
  INCREMENT,
  API_RESPONSE
} from "../actions";
import { combineReducers } from "redux";

const initialState = {
  1: {
    id: 1,
    content: "content1"
  },
  2: {
    id: 2,
    content: "content2"
  }
};

const items = (state = initialState, action) => {
  switch (action.type) {
    case ADD_ITEM:
      return { ...state, [action.item.id]: action.item };
    case REMOVE_ITEM:
      return _.omit(state, action.id);
    default:
      return state;
  }
};

const testString = (state = "", action) => {
  switch (action.type) {
    case EDIT_TEST_STRING:
      return action.value;
    default:
      return state;
  }
};

const counter = (state = 0, action) => {
  switch (action.type) {
    case INCREMENT:
      return state + 1;
    default:
      return state;
  }
};

const remoteItem = (state = null, action) => {
  switch (action.type) {
    case API_RESPONSE:
      return action.item;
    default:
      return state;
  }
};

export default combineReducers({
  items,
  testString,
  counter,
  remoteItem
});
