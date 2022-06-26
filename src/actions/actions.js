export const setOpenSignUp = () => {
    return {
        type: 'SET_OPEN_SIGN_UP'
    };
};

export const setOpenSignIn = () => {
    return {
        type: 'SET_OPEN_SIGN_IN'
    };
};

export const setCurrentUser = user => {
    return {
        type: 'SET_CURRENT_USER',
        payload: user
    };
};

export const updateImages = images => {
    return {
        type: 'UPDATE_IMAGES',
        payload: images
    };
};