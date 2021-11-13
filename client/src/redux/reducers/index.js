import userReducer from "./userReducer";
import { combineReducers } from "redux";

const combinedReducer = combineReducers({
  user: userReducer,
});

export default combinedReducer;