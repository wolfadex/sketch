import * as types from 'root/ActionTypes';

export const setShapeType = (newType) => ({
    type: types.SET_SHAPE_TYPE,
    newType,
});

export const startShape = (point) => ({
    type: types.START_SHAPE,
    point,
});

export const startResize = (point) => ({
    type: types.START_RESIZE,
    point,
});

export const startMove = (point) => ({
    type: types.START_MOVE,
    point,
});

export const moveShape = (point) => ({
    type: types.MOVE_SHAPE,
    point,
});

export const resizeShape = (point) => ({
    type: types.RESIZE_SHAPE,
    point,
});

export const endShape = () => ({
    type: types.END_SHAPE,
});

export const endUpdate = () => ({
    type: types.END_UPDATE,
});

export const cancelShape = () => ({
    type: types.CANCEL_SHAPE,
});

export const selectShape = (shapeId, point) => ({
    type: types.SELECT_SHAPE,
    shapeId,
    point,
});

export const deleteShape = () => ({
    type: types.DELETE_SHAPE,
});
