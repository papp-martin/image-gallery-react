const INITIAL_STATE = {
    images: []
};

const imagesReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'UPDATE_IMAGES':
            return {
                ...state,
                images: action.payload
            };
        default:
            return state;
    }
};

export default imagesReducer;