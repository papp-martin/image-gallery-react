const openSignUpReducer = (state = false, action) => {
    switch(action.type) {
        case 'SET_OPEN_SIGN_UP':
            return !state;
        default:
            return state;
    }
};

export default openSignUpReducer;