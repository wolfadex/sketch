export const pieSlicePath = (startX, startY, startAngle, endAngle, radius) => {
    const x1 = startX + radius * Math.cos(Math.PI * startAngle / 180);
    const y1 = startY + radius * Math.sin(Math.PI * startAngle / 180);
    const x2 = startX + radius * Math.cos(Math.PI * endAngle / 180);
    const y2 = startY + radius * Math.sin(Math.PI * endAngle / 180);

    return `M${startX} ${startY} L${startX + radius * Math.cos(Math.PI * startAngle / 180)} ${y1} A${radius} ${radius} 0 0 1 ${x2} ${y2} z`;
};
