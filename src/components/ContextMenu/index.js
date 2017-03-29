import './index.less';
import React, { PureComponent } from 'react';
import { styles } from 'root/theme';
import { connect } from 'react-redux';
import enhanceWithClickOutside from 'react-click-outside';
import * as contextMenuActions from 'actions/contextMenu';
import * as drawingActions from 'actions/drawing';
import * as themeActions from 'actions/theme';
import { pieSlicePath } from 'root/shapes';

const radius = 100;
const iconAngle = (start, end) => Math.PI * (start + (end - start) / 2) / 180;
const iconX = (start, end) => radius / 2 * Math.cos(iconAngle(start, end));
const iconY = (start, end) => radius / 2 * Math.sin(iconAngle(start, end));
const menuSlice = ({
    child,
    end,
    key,
    start,
    ...pathProps
}) => (
    <g
        key={key}
    >
        <path
            className='pie-menu--selectable'
            d={pieSlicePath(0, 0, start, end, radius)}
            {...pathProps}
        />
        <g
            style={{
                transform: `translate(${iconX(start, end)}px, ${iconY(start, end)}px)`
            }}
        >
            {child}
        </g>
    </g>
);

@connect(({
    contextMenu: {
        position: {
            x,
            y,
        } = {},
    },
    theme: {
        colors,
    },
}) => ({
    colors,
    x,
    y,
}))
@enhanceWithClickOutside
class ContextMenu extends PureComponent {
    constructor(props) {
        super(props);

        this.handleClickOutside = this.handleClickOutside.bind(this);
        this.handleSetShape = this.handleSetShape.bind(this);
    }

    render() {
        const {
            colors,
            dispatch,
            x,
            y,
        } = this.props;
        const menuOptions = [
            {
                onClick: () => this.handleSetShape('rect'),
                child:
                    <rect
                        x='0'
                        y='0'
                        width='20'
                        height='20'
                        fill='none'
                        stroke='black'
                        strokeWidth='3px'
                    />,
            },
            {
                onClick: () => this.handleSetShape('circle'),
                child:
                    <circle
                        cx='0'
                        cy='0'
                        r='10'
                        fill='none'
                        stroke='black'
                        strokeWidth='3px'
                    />,
            },
            {
                onClick: () => this.handleSetShape('line'),
                child:
                    <line
                        x1='0'
                        y1='20'
                        x2='20'
                        y2='0'
                        stroke='black'
                        strokeWidth='3px'
                    />,
            },
            // {
            //     onClick: () => his.handleSetShape('path'),
            //     // child:
            //     //     'icon',
            // },
        ].map((option, i, arr) => menuSlice({
            end: 360 / arr.length * (i + 1),
            key: `context-menu__option__${i}`,
            start: 360 / arr.length * i,
            stroke: styles[colors].grid,
            ...option
        }));

        return (
            <g
                className='spring-forth'
                style={{
                    transform: `translate(${x}px, ${y}px)`,
                }}
            >
                <circle
                    cx='0'
                    cy='0'
                    r={radius}
                    fill={styles[colors].background}
                    stroke={styles[colors].grid}
                    filter='url(#dropShadow)'
                />
                {menuOptions}
                <circle
                    cx='0'
                    cy='0'
                    r='20'
                    fill={styles[colors].background}
                    stroke={styles[colors].grid}
                />
                <circle
                    cx='0'
                    cy='0'
                    r='20'
                    className='pie-menu--selectable'
                    stroke='none'
                    onClick={() => dispatch(themeActions.toggleColor())}
                />
            </g>
        );
    }

    handleClickOutside() {
        this.props.dispatch(contextMenuActions.show(false));
    }

    handleSetShape(type) {
        const {
            dispatch,
        } = this.props;

        dispatch(drawingActions.setShapeType(type));
        dispatch(contextMenuActions.show());
    }
}

export default ContextMenu;
