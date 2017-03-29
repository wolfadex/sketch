import * as types from 'root/ActionTypes';

export const show = (show) => ({
    type: types.SHOW_CONTEXT_MENU,
    show,
});

export const setPosition = ({
    x,
    y,
}) => ({
    type: types.SET_CONTEXT_MENU_POSITION,
    x,
    y,
});
