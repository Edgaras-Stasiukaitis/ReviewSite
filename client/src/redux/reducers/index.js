import userReducer from "./userReducer";
import categoryReducer from "./categoryReducer";
import { combineReducers } from "redux";

const combinedReducer = combineReducers({
  user: userReducer,
  category: categoryReducer
});

export default combinedReducer;