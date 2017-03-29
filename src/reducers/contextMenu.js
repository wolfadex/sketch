import * as types from 'root/ActionTypes';

const initialState = {
    show: false,
    position: {
        x: 0,
        y: 0,
    },
};

export default function contextMenuReducer(
    state = initialState,
    {
        show,
        type,
        x,
        y,
    },
) {
    switch(type) {
        case types.SET_CONTEXT_MENU_POSITION:
            return Object.assign({}, state, {
                position: {
                    x,
                    y,
                },
            });
        case types.SHOW_CONTEXT_MENU:
            return Object.assign({}, state, {
                show: !!show,
            });
        default:
            return state;
    }
};
