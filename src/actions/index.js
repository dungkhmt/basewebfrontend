export const ADD_ITEM = "ADD_ITEM";
export const REMOVE_ITEM = "REMOVE_ITEM";
export const EDIT_TEST_STRING = "EDIT_TEST_STRING";
export const INC_ASYNC = "INC_ASYNC";
export const INCREMENT = "INCREMENT";
export const API_REQUEST = "API_REQUEST";
export const API_RESPONSE = "API_RESPONSE";

export const addItem = (id, content) => ({
  type: ADD_ITEM,
  item: { id, content }
});

export const removeItem = id => ({
  type: REMOVE_ITEM,
  id: id
});

export const editTestString = value => ({
  type: EDIT_TEST_STRING,
  value: value
});

export const increaseAsync = () => ({
  type: INC_ASYNC
});

export const increment = () => ({
  type: INCREMENT
});

export const apiRequest = id => ({
  type: API_REQUEST,
  id
});

export const apiResponse = item => ({
  type: API_RESPONSE,
  item
});
