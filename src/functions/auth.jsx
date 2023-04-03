import Cookies from "universal-cookie";

import axios from "axios";
let cookie = new Cookies();
export const checkAuth = async () => {
  if (cookie.get("session_id")) {
    let res = await axios.post(
      "/auth",
      { session_id: cookie.get("session_id") },
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return res.data.sessionExist;
  } else {
    return false;
  }
};

export const clearCookie = () => {
  Object.keys(cookie.getAll()).map((ele) => {
    cookie.set(ele, "", { path: "/", expires: new Date() });
    return true;
  });
};

export const logout = async () => {
  let flag = false;
  if (!cookie.get("session_id")) {
    return true;
  }
  await axios
    .post(
      "/logout",
      { session_id: cookie.get("session_id") },
      {
        headers: { "Content-Type": "application/json" },
      }
    )
    .then((response) => response.data)
    .then((data) => {
      clearCookie();
      flag = data;
    });
  return flag;
};
