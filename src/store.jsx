import { configureStore } from "@reduxjs/toolkit";
import globalSetter from "./reducers/globalStates";

export default configureStore({
  reducer: { globalStates: globalSetter },
});
