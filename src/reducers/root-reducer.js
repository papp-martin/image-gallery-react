import openSignUpReducer from "./openSignUp";
import { combineReducers } from "redux";
import openSignInReducer from "./OpenSignIn";
import userReducer from "./user";

const rootReducer = combineReducers({
    openSignUp: openSignUpReducer,
    openSignIn: openSignInReducer,
    user: userReducer
});

export default rootReducer;
