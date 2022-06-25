const openSignInReducer = (state = false, action) => {
    switch(action.type) {
        case 'SET_OPEN_SIGN_IN':
            return !state;
        default:
            return state;
    }
};

export default openSignInReducer;