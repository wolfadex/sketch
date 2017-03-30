import React, { PureComponent } from 'react';

class EditPoints extends PureComponent {
    render() {
        const {
            movePoint,
            resizePoint,
            size = 6,
        } = this.props;
        const offset = size / 2;
        const editProps = {
            width: size,
            height: size,
        };

        return (
            <g>
                <rect
                    className='edit-point edit-point__move'
                    x={movePoint.x - offset}
                    y={movePoint.y - offset}
                    {...editProps}
                />
                <rect
                    className='edit-point edit-point__resize'
                    x={resizePoint.x - offset}
                    y={resizePoint.y - offset}
                    {...editProps}
                />
            </g>
        );
    }
}

export default EditPoints;
