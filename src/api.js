import { API_URL } from "./config/config";
import { failed } from "./action/Auth";
export const authPost = (dispatch, token, url, body) => {
  return fetch(API_URL + url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "X-Auth-Token": token
    },
    body: JSON.stringify(body)
  });
};
export const authPut = (dispatch, token, url, body) => {
  return fetch(API_URL + url, {
    method: "PUT",
    headers: {
      "content-type": "application/json",
      "X-Auth-Token": token
    },
    body: JSON.stringify(body)
  });
};
export const authGet = (dispatch, token, url) => {
  return fetch(API_URL + url, {
    method: "GET",
    headers: {
      "content-type": "application/json",
      "X-Auth-Token": token
    }
  }).then(
    res => {
      if (!res.ok) {
        dispatch(failed());
        throw Error("Unauthorized");
      }
      return res.json();
    },
    error => {
      console.log(error);
    }
  );
};
export const authDelete = (dispatch, token, url) => {
  return fetch(API_URL + url, {
    method: "DELETE",
    headers: {
      "content-type": "application/json",
      "X-Auth-Token": token
    }
  }).then(
    res => {
      if (!res.ok) {
        dispatch(failed());
        throw Error("Unauthorized");
      }
      return true; 
    },
    error => {
      console.log(error);
    }
  );
};
export default {
  getMenu: (dispatch, token) => {
    return authGet(dispatch, token, "/menu");
  }
};
