import './index.less';
import React, { PureComponent } from 'react';
import { styles } from 'root/theme';
import { connect } from 'react-redux';
import enhanceWithClickOutside from 'react-click-outside';
import * as contextMenuActions from 'actions/contextMenu';
import * as drawingActions from 'actions/drawing';
import * as themeActions from 'actions/theme';
import { pieSlicePath } from 'root/shapes';

const menuSlice = ({
    end,
    start,
    ...pathProps
}) => (
    <path
        className='pieMenuSlice'
        d={pieSlicePath(0, 0, start, end, 100)}
        // fill={'red'}
        // stroke={styles[colors].grid}
        {...pathProps}
    />
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
                onClick: () => dispatch(drawingActions.setShapeType('rect')),
                child:
                    <rect
                        x='0'
                        y='0'
                        width='10'
                        height='10'
                    />,
            },
            {
                onClick: () => dispatch(drawingActions.setShapeType('circle')),
                child:
                    <circle
                        cx='0'
                        cy='0'
                        r='5'
                    />,
            },
            {
                onClick: () => dispatch(drawingActions.setShapeType('line')),
                child:
                    <line
                        x1='0'
                        y1='10'
                        x2='10'
                        y2='0'
                    />,
            },
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
                    r='100'
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
                    onClick={() => dispatch(themeActions.toggleColor())}
                />
            </g>
        );
    }

    handleClickOutside() {
        this.props.dispatch(contextMenuActions.show(false));
    }
}

export default ContextMenu;
