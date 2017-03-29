import './index.less';
import React, { Component, createElement } from 'react';
import { styles } from 'root/theme';
import { connect } from 'react-redux';
import * as contextMenuActions from 'actions/contextMenu';
import * as drawingActions from 'actions/drawing';
import * as themeActions from 'actions/theme';
import ContextMenu from 'components/ContextMenu';
import Background from 'containers/Background';

@connect(({
    contextMenu: {
        show: showContextMenu,
    } = {},
    drawing: {
        currentShape,
        initialX,
        initialY,
        mode: drawingMode,
        shapes = {},
    } = {},
    theme: {
        colors,
    } = {},
}) => ({
    colors,
    currentShape,
    drawingMode,
    initialX,
    initialY,
    shapes,
    showContextMenu,
}))
class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            width: 0,
            height: 0,
        };
    }

    componentWillMount() {
        this.setState({
            width: window.innerWidth,
            height: window.innerHeight,
        });

        window.addEventListener('resize', this.handleWindowResize.bind(this));
        window.addEventListener('contextmenu', this.showContextMenu.bind(this));
        window.addEventListener('mousedown', this.startShape.bind(this));
        window.addEventListener('mousemove', this.updateShape.bind(this));
        window.addEventListener('mouseup', this.endShape.bind(this));
        window.addEventListener('keydown', this.handleKeyDown.bind(this));
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleWindowResize);
        window.removeEventListener('contextmenu', this.showContextMenu);
        window.removeEventListener('mousedown', this.startShape);
        window.removeEventListener('mousemove', this.updateShape);
        window.removeEventListener('mouseup', this.endShape);
        window.removeEventListener('keydown', this.handleKeyDown);
    }

    render() {
        const {
            colors,
            currentShape,
            dispatch,
            shapes,
            showContextMenu,
        } = this.props;
        const {
            width,
            height,
        } = this.state;

        return (
            <svg
                className='app'
                width={width}
                height={height}
                viewBox={`0 0 ${width} ${height}`}
            >
                <defs>
                    <filter
                        id='dropShadow'
                        x='0'
                        y='0'
                        width='200%'
                        height='200%'
                    >
                        <feOffset result='offOut' in='SourceGraphic' dx='10' dy='15' />
                        <feColorMatrix result='matrixOut' in='offOut' type='matrix'
                        values='0.2 0 0 0 0 0 0.2 0 0 0 0 0 0.2 0 0 0 0 0 1 0' />
                        <feGaussianBlur result='blurOut' in='matrixOut' stdDeviation='10' />
                        <feBlend in='SourceGraphic' in2='blurOut' mode='normal' />
                    </filter>
                </defs>
                <Background
                    width={width}
                    height={height}
                />
                {/* Shapes */}
                <g>
                    {Object.keys(shapes).map((key) => {
                        const {
                            type,
                            ...shapeProps
                        } = shapes[key];

                        return type == null ? null : createElement(type, Object.assign({}, shapeProps, {
                            className: `shape ${key === currentShape ? 'shape--active' : ''}`,
                            fill: 'none',
                            id: key,
                            key,
                            stroke: styles[colors].stroke,
                            strokeWidth: '3px',
                        }));
                    })}
                </g>
                {
                    showContextMenu &&
                    <ContextMenu

                    />
                }
            </svg>
        );
    }

    handleWindowResize() {
        this.setState({
            width: window.innerWidth,
            height: window.innerHeight,
        });
    }

    showContextMenu(e) {
        const {
            dispatch,
        } = this.props;

        e.preventDefault();
        dispatch(contextMenuActions.setPosition({
            x: e.x,
            y: e.y,
        }));
        dispatch(contextMenuActions.show(true));
    }

    startShape({
        button,
        target: {
            classList,
            id,
            parentElement,
        } = {},
        x,
        y,
    }) {
        const {
            currentShape,
            dispatch,
            showContextMenu,
        } = this.props;

        if (button === 0 && !showContextMenu) {
            if (parentElement.id === 'background') {
                dispatch(drawingActions.startShape(x, y));
            }
            else if (classList.value.indexOf('shape') > -1) {
                dispatch(drawingActions.selectShape(id));
            }
        }
    }

    endShape({
        button,
    }) {
        const {
            currentShape,
            dispatch,
            drawingMode,
        } = this.props;

        if (button === 0 && drawingMode === 'create' && currentShape) {
            dispatch(drawingActions.endShape());
        }
    }

    updateShape({
        x,
        y,
    }) {
        const {
            initialX,
            initialY,
            currentShape,
            dispatch,
            drawingMode,
            shapes: {
                [currentShape]: shapeProps,
            } = {},
        } = this.props;

        if (currentShape && drawingMode) {
            switch (drawingMode) {
                case 'create':
                    dispatch(drawingActions.updateShape(this.getShapeUpdateValues(shapeProps, x, y, initialX, initialY)));
                    break;
                case 'update':
                    break;
            }
        }
    }

    getShapeUpdateValues(
        {
            type,
            ...shapeProps
        },
        x,
        y,
        initialX,
        initialY,
    ) {
        const diffX = x - initialX;
        const diffY = y - initialY;

        switch (type) {
            case 'rect':
                return Object.assign(
                    {},
                    shapeProps,
                    {
                        width: Math.abs(diffX),
                        height: Math.abs(diffY),
                    },
                    (diffX < 0 && {
                        x: initialX + diffX,
                    }),
                    (diffY < 0 && {
                        y: initialY + diffY,
                    }),
                );
            case 'circle':
                return Object.assign(
                    {},
                    shapeProps,
                    {
                        r: Math.sqrt(Math.abs(diffX) ** 2 + Math.abs(diffY) ** 2),
                    },
                );
            case 'line':
                return Object.assign(
                    {},
                    shapeProps,
                    {
                        x2: x,
                        y2: y,
                    },
                );
        }
    }

    handleKeyDown({
        keyCode,
    }) {
        const {
            dispatch,
        } = this.props;

        switch (keyCode) {
            case 219: // [
                dispatch(themeActions.changeGridSpacing(-5));
                break;
            case 221: // ]
                dispatch(themeActions.changeGridSpacing(5));
                break;
            case 46: // DELETE
            case 88: // x
                dispatch(drawingActions.deleteShape());
                break;
            default:
                console.log(keyCode);
                break;
        }
    }
}

export default App;
