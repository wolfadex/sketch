import * as types from 'root/ActionTypes';
import { guid } from 'root/helpers';
import { Vector2, add, subtract } from 'root/vector2';

const initialState = {
    currentShape: null,
    currentType: 'rect',
    initialPoint: Vector2(),
    mode: null,
    shapes: {},
};

export default function contextMenuReducer(
    state = initialState,
    {
        content,
        newType,
        point,
        shapeId,
        shapeProps,
        shapes,
        type,
    },
) {
    switch(type) {
        case types.START_SHAPE:
            let newShape = guid();

            return Object.assign({}, state, {
                initialPoint: point,
                mode: 'create',
                currentShape: newShape,
                shapes: Object.assign({}, state.shapes, {
                    [newShape]: Object.assign({}, {
                        p1: point,
                        p2: add(point, Vector2(20, 20)),
                        type: state.currentType,
                    }),
                }),
            });
        case types.IMPORT:
            return Object.assign({}, state, {
                shapes,
            });
        case types.START_RESIZE:
            return Object.assign({}, state, {
                initialPoint: point,
                mode: 'resize',
            });
        case types.START_MOVE:
            return Object.assign({}, state, {
                initialPoint: point,
                mode: 'move',
            });
        case types.MOVE_SHAPE:
            return Object.assign({}, state, {
                shapes: Object.assign({}, state.shapes, {
                    [state.currentShape]: Object.assign({}, state.shapes[state.currentShape], {
                        p1: point,
                        p2: subtract(state.shapes[state.currentShape].p2, subtract(state.shapes[state.currentShape].p1, point)),
                    }),
                }),
            });
        case types.RESIZE_SHAPE:
            return Object.assign({}, state, {
                shapes: Object.assign({}, state.shapes, {
                    [state.currentShape]: Object.assign({}, state.shapes[state.currentShape], {
                        p2: point,
                    }),
                }),
            });
        case types.SET_TEXT:
            return Object.assign({}, state, {
                shapes: Object.assign({}, state.shapes, {
                    [state.currentShape]: Object.assign({}, state.shapes[state.currentShape], {
                        content,
                    }),
                }),
            });
        case types.END_SHAPE:
            return Object.assign({}, state, {
                mode: null,
                currentShape: null,
            });
        case types.END_UPDATE:
            return Object.assign({}, state, {
                mode: null,
            });
        case types.CANCEL_SHAPE:
            const {
                [state.currentShape]: canceledShape,
                ...nonCanceledShapes
            } = state.shapes;
            return Object.assign({}, state, {
                mode: null,
                currentShape: null,
                shapes: nonCanceledShapes,
            });
        case types.DELETE_SHAPE:
            const {
                [state.currentShape]: deletedShape,
                ...notDeletedShapes
            } = state.shapes;
            return Object.assign({}, state, {
                mode: null,
                currentShape: null,
                shapes: notDeletedShapes,
            });
        case types.SET_SHAPE_TYPE:
            return Object.assign({}, state, {
                currentType: newType,
            });
        case types.SELECT_SHAPE:
            return Object.assign({}, state, {
                currentShape: shapeId,
            });
        case types.CLEAR_ALL_SHAPES:
            return Object.assign({}, state, {
                currentShape: null,
                mode: null,
                shapes: {},
            });
        default:
            return state;
    }
};
