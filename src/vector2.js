export const Vector2 = (x = 0, y = 0) => ({ x, y });

export const add = (
    {
        x: x1,
        y: y1,
    },
    {
        x: x2,
        y: y2,
    },
) => ({
    x: x1 + x2,
    y: y1 + y2,
});

export const subtract = (
    {
        x: x1,
        y: y1,
    },
    {
        x: x2,
        y: y2,
    },
) => ({
    x: x1 - x2,
    y: y1 - y2,
});

export const distance = (
    {
        x: x1,
        y: y1,
    },
    {
        x: x2,
        y: y2,
    },
) => Math.sqrt(Math.abs(x1 - x2) ** 2 + Math.abs(y1 - y2) ** 2);
