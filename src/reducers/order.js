import { SET_ORDER, UPDATE_STATUS } from "../action/order";

const initState = [];

// action: {
// type: string,
// payload: {
//   productId: number,
//   quantity: number,
// }
// }

const order = (state = initState, action) => {
  switch (action.type) {
    case UPDATE_STATUS: {
      const index = state.findIndex(
        (item) => item.orderId === action.payload.orderId
      );
      return [
        ...state.slice(0, index),
        { ...state[index], statusId: action.payload.statusId },
        ...state.slice(index + 1),
      ];
    }

    case SET_ORDER: {
      return [...action.payload];
    }

    default:
      return state;
  }
};

export default order;
