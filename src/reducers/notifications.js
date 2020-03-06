import { PUSH_NOTIFICATION, REMOVE_NOTIFICATION } from "../actions";
import { omit } from "../util";

export const initialState = {
  messages: {},
  sequence: 1
};

const messageFromAction = action => ({
  id: action.id,
  content: action.message,
  severity: action.severity
});

const notifications = (state = initialState, action) => {
  switch (action.type) {
    case PUSH_NOTIFICATION:
      return {
        ...state,
        messages: {
          ...state.messages,
          [action.id]: messageFromAction(action)
        },
        sequence: state.sequence + 1
      };

    case REMOVE_NOTIFICATION:
      return {
        ...state,
        messages: omit(state.messages, action.id)
      };

    default:
      return state;
  }
};

export default notifications;
