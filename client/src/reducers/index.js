import { combineReducers } from "redux";
import authReducers from "./authReducers";
import stockReducers from "./stockReducers";
import errorReducers from "./errorReducers";

export default combineReducers({
  auth: authReducers,
  stock: stockReducers,
  errors: errorReducers
});

