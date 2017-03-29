// import './index.less';
import React, { Component } from 'react';
import { styles } from 'root/theme';
import { connect } from 'react-redux';

@connect(({
    theme: {
        colors,
        gridSpacing,
    } = {},
}) => ({
    colors,
    gridSpacing,
}))
class Background extends Component {
    render() {
        const {
            colors,
            currentShape,
            gridSpacing,
            height,
            width,
        } = this.props;
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
        );
    }
}

export default Background;
