import { BUY, REMOVE_PRODUCT, UPDATE_PRODUCT } from "../action/cart";

const initState = [];

// action: {
// type: string,
// payload: {
//   productId: number,
//   quantity: number,
// }
// }

const cart = (state = initState, action) => {
  switch (action.type) {
    case UPDATE_PRODUCT: {
      const index = state.findIndex(
        (item) => item.productId === action.payload.productId
      );
      if (index === -1) {
        return [...state, action.payload];
      }
      return [
        ...state.slice(0, index),
        { ...state[index], quantity: action.payload.quantity },
        ...state.slice(index + 1),
      ];
    }

    case REMOVE_PRODUCT: {
      const index = state.findIndex(
        (item) => item.productId === action.payload.productId
      );
      return [...state.slice(0, index), ...state.slice(index + 1)];
    }

    case BUY:
      return [];

    default:
      return state;
  }
};

export default cart;
