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
        gridSpacingDiff,
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
                gridSpacing: Math.max(Math.min(state.gridSpacing + gridSpacingDiff, maxGridSpacing), minGridSpacing),
            });
        default:
            return state;
    }
};
