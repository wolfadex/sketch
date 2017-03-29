import * as types from 'root/ActionTypes';

const maxGridSpacing = 100;
const minGridSpacing = 10;
const initialState = {
    gridSpacing: 20,
    colors: 'dark',
};

export default function colorsReducer(
    state = initialState,
    {
        gridSpacing,
        type,
    },
) {
    switch(type) {
        case types.TOGGLE_THEME:
            return Object.assign({}, state, {
                colors: state.colors === 'dark' ? 'light': 'dark',
            });
        case types.CHANGE_GRID_SPACING:
            return Object.assign({}, state, {
                gridSpacing: Math.max(Math.min(gridSpacing, maxGridSpacing), minGridSpacing),
            });
        default:
            return state;
    }
};
