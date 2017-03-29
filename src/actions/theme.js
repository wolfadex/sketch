import * as types from 'root/ActionTypes';

export const toggleColor = () => ({
    type: types.TOGGLE_THEME,
});

export const changeGridSpacing = (gridSpacing) => ({
    type: types.CHANGE_GRID_SPACING,
    gridSpacing,
});
