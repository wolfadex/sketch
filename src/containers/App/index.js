import './index.less';
import React, { Component, createElement } from 'react';
import { styles } from 'root/theme';
import { connect } from 'react-redux';
import * as contextMenuActions from 'actions/contextMenu';
import * as drawingActions from 'actions/drawing';
import * as themeActions from 'actions/theme';
import ContextMenu from 'components/ContextMenu';
import Background from 'containers/Background';
import EditPoints from 'components/EditPoints';
import { drawShape, getShapeMove, getShapeResize } from 'root/shapes';
import { Vector2 } from 'root/vector2';

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
        window.addEventListener('mousedown', this.handleMouseDown.bind(this));
        window.addEventListener('mousemove', this.handleMouseMove.bind(this));
        window.addEventListener('mouseup', this.handleMouseUp.bind(this));
        window.addEventListener('keydown', this.handleKeyDown.bind(this));
        window.addEventListener('dblclick', this.handleDoubleClick.bind(this));
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleWindowResize);
        window.removeEventListener('contextmenu', this.showContextMenu);
        window.removeEventListener('mousedown', this.handleMouseDown);
        window.removeEventListener('mousemove', this.handleMouseMove);
        window.removeEventListener('mouseup', this.handleMouseUp);
        window.removeEventListener('keydown', this.handleKeyDown);
        window.removeEventListener('dblclick', this.handleDoubleClick);
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
                    {Object.keys(shapes).map((key) =>
                        drawShape(Object.assign({}, shapes[key], {
                            className: `shape ${key === currentShape ? 'shape--active' : ''}`,
                            fill: 'none',
                            id: key,
                            key,
                            stroke: styles[colors].stroke,
                            strokeWidth: '3px',
                        }))
                    )}
                    {
                        currentShape &&
                        <EditPoints
                            movePoint={getShapeMove(shapes[currentShape])}
                            resizePoint={getShapeResize(shapes[currentShape])}
                        />
                    }
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

    handleMouseDown({
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
            shapes,
            showContextMenu,
        } = this.props;

        if (button === 0) {
            if (!showContextMenu) {
                if (parentElement.id === 'background') {
                    if (currentShape) {
                        dispatch(drawingActions.selectShape());
                    }
                    else {
                        dispatch(drawingActions.startShape(Vector2(x, y)));
                    }
                }
                else if (classList.value.indexOf('shape') > -1) {
                    dispatch(drawingActions.selectShape(id));
                }
                else if (classList.value.indexOf('edit-point') > -1) {
                    if (classList.value.indexOf('edit-point__move') > -1) {
                        dispatch(drawingActions.startMove(Vector2(x, y)));
                    }
                    else if (classList.value.indexOf('edit-point__resize') > -1) {
                        dispatch(drawingActions.startResize(Vector2(x, y)));
                    }
                }
            }
        }
    }

    handleDoubleClick({
        button,
    }) {
        const {
            currentShape,
            dispatch,
            shapes: {
                [currentShape]: {
                    type,
                    content,
                } = {},
            } = {},
        } = this.props;

        if (button === 0) {
            if (type === 'text') {
                dispatch(drawingActions.setText(window.prompt('Text content', content)));
            }
        }
    }

    handleMouseUp({
        button,
    }) {
        const {
            currentShape,
            dispatch,
            drawingMode,
            shapes,
        } = this.props;

        if (button === 0 && currentShape) {
            switch (drawingMode) {
                case 'create':
                    if (shapes[currentShape].type === 'text') {
                        dispatch(drawingActions.setText(window.prompt('Text content', 'Text')));
                    }

                    dispatch(drawingActions.endShape());

                    break;
                case 'move':
                case 'resize':
                    dispatch(drawingActions.endUpdate());
                    break;
            }
        }
    }

    handleMouseMove({
        x,
        y,
    }) {
        const {
            currentShape,
            dispatch,
            drawingMode,
        } = this.props;

        if (currentShape && drawingMode) {
            switch (drawingMode) {
                case 'move':
                    dispatch(drawingActions.moveShape(Vector2(x, y)));
                    break;
                case 'create':
                case 'resize':
                    dispatch(drawingActions.resizeShape(Vector2(x, y)));
                    break;
            }
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
