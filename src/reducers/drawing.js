import * as types from 'root/ActionTypes';
import { guid } from 'root/helpers';


const initialState = {
    initialX: 0,
    initialY: 0,
    mode: null,
    currentShape: null,
    currentType: 'rect',
    shapes: {},
};

const shapePropsFromType = (type, shapeProps = {}) => {
    switch (type) {
        case 'rect':
            const {
                height,
                width,
                x,
                y,
            } = shapeProps;

            return {
                height,
                width,
                x,
                y,
            };
        case 'circle':
            const {
                cx,
                cy,
                r,
            } = shapeProps;

            return {
                cx,
                cy,
                r,
            };
    }
};

export default function contextMenuReducer(
    state = initialState,
    {
        newType,
        shapeId,
        shapeProps,
        type,
        x,
        y,
    },
) {
    switch(type) {
        case types.START_SHAPE:
            let newShape = guid();

            return Object.assign({}, state, {
                initialX: x,
                initialY: y,
                mode: 'create',
                currentShape: newShape,
                shapes: Object.assign({}, state.shapes, {
                    [newShape]: Object.assign(
                        {},
                        shapePropsFromType(state.currentType, shapeProps),
                        {
                            type: state.currentType,
                        },
                    ),
                }),
            });
        case types.UPDATE_SHAPE:
            return Object.assign({}, state, {
                shapes: Object.assign({}, state.shapes, {
                    [state.currentShape]: Object.assign(
                        {},
                        state.shapes[state.currentShape],
                        shapePropsFromType(state.currentType, shapeProps),
                    ),
                }),
            });
        case types.END_SHAPE:
            return Object.assign({}, state, {
                mode: null,
                currentShape: null,
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
                [shapeId]: deletedShape,
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
                initialX: x,
                initialY: y,
                mode: 'update',
                currentShape: shapeId,
            });
        default:
            return state;
    }
};
