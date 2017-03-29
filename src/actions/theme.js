import * as types from 'root/ActionTypes';

export const toggleColor = () => ({
    type: types.TOGGLE_THEME,
});

export const changeGridSpacing = (gridSpacingDiff) => ({
    type: types.CHANGE_GRID_SPACING,
    gridSpacingDiff,
});
