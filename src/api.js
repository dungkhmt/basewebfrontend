import { failed } from "./action/Auth";
import { API_URL } from "./config/config";
import axios from "axios";
import { errorNoti, infoNoti } from "./utils/Notification";

export const authPost = (dispatch, token, url, body) => {
  return fetch(API_URL + url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "X-Auth-Token": token,
    },
    body: JSON.stringify(body),
  });
};
export const authPostMultiPart = (dispatch, token, url, body) => {
  return fetch(API_URL + url, {
    method: "POST",
    headers: {
      "X-Auth-Token": token,
    },
    body: body,
  });
};
export const authPut = (dispatch, token, url, body) => {
  return fetch(API_URL + url, {
    method: "PUT",
    headers: {
      "content-type": "application/json",
      "X-Auth-Token": token,
    },
    body: JSON.stringify(body),
  });
};
export const authGetImg = (dispatch, token, url) => {
  return fetch(API_URL + url, {
    method: "GET",
    headers: {
      "X-Auth-Token": token,
    },
  });
};
export const authGet = (dispatch, token, url) => {
  return fetch(API_URL + url, {
    method: "GET",
    headers: {
      "content-type": "application/json",
      "X-Auth-Token": token,
    },
  }).then(
    (res) => {
      if (!res.ok) {
        if (res.status === 401) {
          dispatch(failed());
          throw Error();
        } else {
          // dispatch(error(res.status));
          throw Error();
        }
        return null;
      }
      return res.json();
    },
    (error) => {
      console.log(error);
    }
  );
};
export const authDelete = (dispatch, token, url) => {
  return fetch(API_URL + url, {
    method: "DELETE",
    headers: {
      "content-type": "application/json",
      "X-Auth-Token": token,
    },
  }).then(
    (res) => {
      if (!res.ok) {
        dispatch(failed());
        throw Error("Unauthorized");
      }
      return true;
    },
    (error) => {
      console.log(error);
    }
  );
};
export default {
  getMenu: (dispatch, token) => {
    return authGet(dispatch, token, "/menu");
  },
};

export const axiosPost = (token, url, data, dispatch) => {
  return axios.post(API_URL + url, data, {
    headers: {
      "content-type": "application/json",
      "X-Auth-Token": token,
    },
  });
};

export const axiosGet = (token, url, dispatch) => {
  return axios.get(API_URL + url, {
    headers: {
      "content-type": "application/json",
      "X-Auth-Token": token,
    },
  });
};

export const axiosPut = (token, url, data, dispatch) => {
  return axios.put(API_URL + url, data, {
    headers: {
      "content-type": "application/json",
      "X-Auth-Token": token,
    },
  });
};

const isFunction = (func) =>
  func &&
  (Object.prototype.toString.call(func) === "[object Function]" ||
    "function" === typeof func ||
    func instanceof Function);

export const request = async (
  token,
  history,
  method,
  url,
  successHandler,
  errorHandlers,
  data
) => {
  try {
    const reqMethod = method.toUpperCase();
    let res;

    switch (reqMethod) {
      case "GET":
        res = await axios.get(API_URL + url, {
          headers: {
            "content-type": "application/json",
            "X-Auth-Token": token,
          },
        });
        break;
      case "POST":
        res = await axios.post(API_URL + url, data, {
          headers: {
            "content-type": "application/json",
            "X-Auth-Token": token,
          },
        });
        break;
      case "PUT":
        res = axios.put(API_URL + url, data, {
          headers: {
            "content-type": "application/json",
            "X-Auth-Token": token,
          },
        });
        break;
    }

    if (isFunction(successHandler)) {
      successHandler(res);
    }
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code that falls out of the range of 2xx.
      switch (error.response.status) {
        case 401:
          history.push({ pathname: "/login" });
          break;
        case 403:
          infoNoti("Bạn cần được cấp quyền để thực hiện hành động này.");
          break;
        default:
          if (isFunction(errorHandlers[error.response.status])) {
            errorHandlers[error.response.status](error);
          } else if (isFunction(errorHandlers["rest"])) {
            errorHandlers["rest"](error);
          } else {
            errorNoti("Rất tiếc! Đã có lỗi xảy ra.");
          }
      }
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      console.log(
        "The request was made but no response was received",
        error.request
      );
    } else {
      // Something happened in setting up the request that triggered an Error.
      console.log(
        "Something happened in setting up the request that triggered an Error",
        error.message
      );
    }
    console.log(error.config);
  }
};
