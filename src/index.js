import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import store from "./store";
import { Provider } from "react-redux";
import Favicon from "react-favicon";
import "semantic-ui-css/semantic.min.css";
import "./Styles/style.css";
import reportWebVitals from "./reportWebVitals";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <Favicon url="https://images.g2crowd.com/uploads/product/image/large_detail/large_detail_4357dd9bb894bc70c2220d88f348ac8b/open-bug-bounty.png" />
    <App />
  </Provider>
);

reportWebVitals();
