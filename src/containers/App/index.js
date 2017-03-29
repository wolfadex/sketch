import './index.less';
import React, { Component, createElement } from 'react';
import { styles } from 'root/theme';
import { connect } from 'react-redux';
import * as contextMenuActions from 'actions/contextMenu';
import * as drawingActions from 'actions/drawing';
import * as themeActions from 'actions/theme';
import ContextMenu from 'components/ContextMenu';

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
        gridSpacing,
    } = {},
}) => ({
    colors,
    currentShape,
    drawingMode,
    gridSpacing,
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
            gridSpacing,
            shapes,
            showContextMenu,
        } = this.props;
        const {
            width,
            height,
        } = this.state;
        let gridVertical = [];
        let gridHorizontal = [];

        for (let i = 1; i * gridSpacing < width; i++) {
            gridVertical.push(
                <line
                    key={`grid-line__vertial__${i}`}
                    x1={`${i * gridSpacing}px`}
                    y1='0px'
                    x2={`${i * gridSpacing}px`}
                    y2={`${height}px`}
                    stroke={styles[colors].grid}
                />
            );
        }
        for (let i = 1; i * gridSpacing < height; i++) {
            gridHorizontal.push(
                <line
                    key={`grid-line__horizontal__${i}`}
                    x1='0px'
                    y1={`${i * gridSpacing}px`}
                    x2={`${width}px`}
                    y2={`${i * gridSpacing}px`}
                    stroke={styles[colors].grid}
                />
            );
        }

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
                <g
                    id='background'
                >
                    {/* Background */}
                    <rect
                        x='0'
                        y='0'
                        width={width}
                        height={height}
                        fill={styles[colors].background}
                    />
                    {/* Grid */}
                    {gridVertical}
                    {gridHorizontal}
                </g>
                {/* Shapes */}
                <g>
                    {Object.keys(shapes).map((key) => {
                        const {
                            type,
                            ...shapeProps
                        } = shapes[key];

                        return type == null ? null : createElement(type, Object.assign({}, shapeProps, {
                            className: 'shape',
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
            dispatch,
            showContextMenu,
        } = this.props;

        if (button === 0 && !showContextMenu) {
            if (parentElement.id === 'background') {
                dispatch(drawingActions.startShape({x, y, width: 20, height: 20}, x, y));
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
        }
    }

    handleKeyDown({
        keyCode,
    }) {
        const {
            dispatch,
            gridSpacing,
        } = this.props;

        switch (keyCode) {
            case 219:
                dispatch(themeActions.changeGridSpacing(gridSpacing - 5));
                break;
            case 221:
                dispatch(themeActions.changeGridSpacing(gridSpacing + 5));
                break;
            default:
                console.log(keyCode);
                break;
        }
    }
}

export default App;
