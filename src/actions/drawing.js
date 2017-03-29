import * as types from 'root/ActionTypes';

export const setShapeType = (newType) => ({
    type: types.SET_SHAPE_TYPE,
    newType,
});

export const startShape = (x, y) => ({
    type: types.START_SHAPE,
    x,
    y,
});

export const updateShape = (shapeProps) => ({
    type: types.UPDATE_SHAPE,
    shapeProps,
});

export const endShape = () => ({
    type: types.END_SHAPE,
});

export const cancelShape = () => ({
    type: types.CANCEL_SHAPE,
});

export const selectShape = (shapeId, x, y) => ({
    type: types.SELECT_SHAPE,
    shapeId,
    x,
    y,
});

export const deleteShape = () => ({
    type: types.DELETE_SHAPE,
});
