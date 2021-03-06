import React from 'react';
import { Vector2 } from 'root/vector2';

export const pieSlicePath = (startX, startY, startAngle, endAngle, radius) => {
    const x1 = startX + radius * Math.cos(Math.PI * startAngle / 180);
    const y1 = startY + radius * Math.sin(Math.PI * startAngle / 180);
    const x2 = startX + radius * Math.cos(Math.PI * endAngle / 180);
    const y2 = startY + radius * Math.sin(Math.PI * endAngle / 180);

    return `M${startX} ${startY} L${startX + radius * Math.cos(Math.PI * startAngle / 180)} ${y1} A${radius} ${radius} 0 0 1 ${x2} ${y2} z`;
};

const drawableShapes = {
    rect: (
        {
            x: x1,
            y: y1,
        },
        {
            x: x2,
            y: y2,
        },
        props,
    ) => (
        <polygon
            points={`${x1} ${y1}, ${x2} ${y1}, ${x2} ${y2}, ${x1} ${y2}`}
            {...props}
        />
    ),
    line: (
        {
            x: x1,
            y: y1,
        },
        {
            x: x2,
            y: y2,
        },
        props,
    ) => (
        <line
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            {...props}
        />
    ),
    circle: (
        {
            x: x1,
            y,
        },
        {
            x: x2,
        },
        props,
    ) => (
        <circle
            cx={x1}
            cy={y}
            r={Math.abs(x1 - x2)}
            fill='none'
            {...props}
        />
    ),
    text: (
        {
            x: x1,
            y: y1,
        },
        {
            x: x2,
        },
        {
            content = 'Text',
            stroke,
            fill,
            ...props
        },
    ) => (
        <text
            x={x1}
            y={y1}
            fontFamily='sans-serif'
            fontSize={Math.max(0, x2 - x1)}
            {...props}
            stroke={fill}
            fill={stroke}
            style={{
                userSelect: 'none',
            }}
        >
            {content}
        </text>
    ),
};

export const drawShape = ({
    type,
    p1,
    p2,
    ...props
}) => drawableShapes[type](p1, p2, props);

export const getShapeMove = ({
    type,
    p1: {
        x,
        y,
    } = {},
}) => {
    switch (type) {
        case 'rect':
        case 'circle':
        case 'line':
        default:
            return Vector2(x, y);
    }
};

export const getShapeResize = ({
    type,
    p1: {
        x: x1,
        y: y1,
    } = {},
    p2: {
        x: x2,
        y: y2,
    } = {},
}) => {
    switch (type) {
        case 'circle':
            return Vector2(x2, y1);
        case 'text':
            return Vector2(Math.max(x1 + 3, x2), y1);
        case 'rect':
        case 'line':
        default:
            return Vector2(x2, y2);
    }
};
