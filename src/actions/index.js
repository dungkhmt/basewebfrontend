export const LOGIN = "LOGIN";

export const loginAction = (username, password) => ({
  type: LOGIN,
  username,
  password
});
