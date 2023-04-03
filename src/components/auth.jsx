import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setLogins, setAdmin } from "../reducers/globalStates";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";

export default function Auth() {
  const dispatcher = useDispatch();
  const navigate = useNavigate();
  const cookie = new Cookies();
  const server = "https://backflipt-accounts.onrender.com";
  // const server = "http://localhost:3050";
  useEffect(() => {
    if (cookie.get("session_id")) {
      axios
        .post("/auth", {
          headers: { "Content-Type": "application/json" },
        })
        .then((res) => {
          if (res.data.sessionExist) {
            dispatcher(
              setLogins([res.data, cookie.get("username")]),
              setAdmin(cookie.get("admin") === "true")
            );
            navigate("/");
          } else {
            cookie.set("session_id", "", { path: "/", expires: new Date() });
            window.location.href =
              server +
              "/?host=" +
              window.location.host +
              "&protocol=" +
              window.location.protocol +
              "&app=bug-hunter";
          }
        });
      return;
    } else {
      let params = new URLSearchParams(window.location.search);
      for (let p of params) {
        if (p[0] === "role") {
          dispatcher(setAdmin(p[1] === "true"));
        }
        cookie.set(p[0], p[1], { path: "/" });
      }
      if (cookie.get("session_id")) {
        dispatcher(setLogins([true, cookie.get("username")]));
        dispatcher(setAdmin(cookie.get("admin") === "true"));
        navigate("/");
      } else {
        dispatcher(setLogins([false, null]));
        window.location.href =
          server +
          "/?host=" +
          window.location.host +
          "&protocol=" +
          window.location.protocol +
          "&app=bug-hunter";
      }
    }
  });
  return <></>;
}
