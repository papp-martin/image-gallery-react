import openSignUpReducer from "./openSignUp";
import { combineReducers } from "redux";
import openSignInReducer from "./OpenSignIn";
import userReducer from "./user";
import imagesReducer from "./images";

const rootReducer = combineReducers({
    openSignUp: openSignUpReducer,
    openSignIn: openSignInReducer,
    user: userReducer,
    images: imagesReducer
});

export default rootReducer;
