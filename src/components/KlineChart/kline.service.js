import axios from 'axios';
import ms from 'ms';
import io from 'socket.io-client';
import colors from '../../styles/colors';
import { _theme } from './defaultStyleOptions'

const PRICE_URL = process.env.NEXT_PUBLIC_PRICE_API_URL;

export const internalTimeFrame = {
    '1m': ms('1m'),
    '1h': ms('1h'),
    '1d': ms('1d'),
};

export const listTimeFrame = [
    { value: ms('1m'), text: '1m' },
    { value: ms('5m'), text: '5m' },
    { value: ms('15m'), text: '15m' },
    { value: ms('30m'), text: '30m' },
    { value: ms('1h'), text: '1h' },
    { value: ms('4h'), text: '4h' },
    { value: ms('1d'), text: '1D' },
    { value: ms('7d'), text: '1W' },
    { value: ms('30d'), text: '1M' },
];

const getInternalTimeFrame = (timeMs) => {
    if (timeMs >= internalTimeFrame['1m'] && timeMs < internalTimeFrame['1h']) {
        return '1m';
    }
    if (timeMs >= internalTimeFrame['1h'] && timeMs < internalTimeFrame['1d']) {
        return '1h';
    }
    return '1d';
};

export async function getData({ broker, symbol, from, to, resolution }) {
    const url = `${PRICE_URL}/api/v1/chart/history`;
    const { data } = await axios.get(url, {
        params: {
            broker,
            symbol,
            from: Math.floor(from / 1000),
            to: Math.ceil(to / 1000),
            resolution: getInternalTimeFrame(resolution),
        },
    }).catch(err => {
        console.error(err);
        return [];
    });

    if (!data) return [];

    // [ time, open, high, low, close, volume]
    return data.map(i => ({
        timestamp: i[0] * 1000,
        open: i[1],
        high: i[2],
        low: i[3],
        close: i[4],
        volume: i[5],
    }));
}

// Correct for upsize only (not equal case)!
export function calculateUpSizeBarData(data, resolution) {
    if (!data || !data.length) return [];
    let last;
    const newData = [];
    for (let i = 0; i < data.length; i++) {
        const element = data[i];

        if (last) {
            last.close = element.close;
            last.high = Math.max(last.high || -Infinity, element.high);
            last.low = Math.min(last.low || Infinity, element.low);
            last.volume += element.volume;
        }

        if (element.timestamp % resolution === 0) {
            if (last) {
                newData.push(last);
            }
            last = { ...element, open: element.close };
        }
    }
    return newData;
}

const socket_url = process.env.NEXT_PUBLIC_STREAM_SOCKET;
export const socket = io(socket_url, {
    transports: ['websocket'],
    upgrade: false,
    path: '/ws',
    reconnection: true,
    reconnectionDelay: 500,
    reconnectionDelayMax: 500,
    reconnectionAttempts: Infinity,
});

const getWidthText = (text) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext("2d");
    const width = ctx.measureText(text).width;
    canvas.remove();
    return width;
}



export const shapeTemplateTP = ({
    name: 'tp',
    totalStep: 2,
    checkEventCoordinateOnShape: ({ key, type, dataSource, eventCoordinate }) => {
    },
    createShapeDataSource: ({ step, points, coordinates, viewport, precision, styles, xAxis, yAxis, data }) => {
        const startWidth = getWidthText(String(points[0].text))
        const endWidth = getWidthText(String(points[0].value) + '0')
        return [
            {
                type: 'polygon',
                isDraw: true,
                isCheck: false,
                styles: { stroke: { color: colors.teal, style: 'dash', dashValue: [2, 2] } },
                dataSource: [
                    [
                        {
                            x: startWidth,
                            y: coordinates[0].y,
                        },
                        {
                            x: viewport.width - endWidth,
                            y: coordinates[0].y
                        },
                    ],
                ]
            },
            {
                type: 'text',
                isDraw: true,
                isCheck: false,
                styles: {
                    color: colors.teal,
                    offset: [4, 0],
                    size: 16, weight: 600,
                },
                dataSource: [
                    {
                        x: 0,
                        y: coordinates[0].y,
                        text: points[0].text,
                    },
                    {
                        x: viewport.width - endWidth + 2,
                        y: coordinates[0].y,
                        text: points[0].value
                    }
                ]
            },
        ]
    },
    drawExtend: ({ ctx, dataSource, styles, viewport, precision, xAxis, yAxis, data }) => {
        const positionId = dataSource[1].dataSource[0];
        const positionValue = dataSource[1].dataSource[1];
        labelLine(ctx, positionId, colors.teal)
        labelLine(ctx, positionValue, colors.teal)
    }
})

export const shapeTemplateSL = ({
    name: 'sl',
    totalStep: 2,
    checkEventCoordinateOnShape: ({ key, type, dataSource, eventCoordinate }) => {
    },
    createShapeDataSource: ({ step, points, coordinates, viewport, precision, styles, xAxis, yAxis, data }) => {
        const startWidth = getWidthText(String(points[0].text))
        const endWidth = getWidthText(String(points[0].value) + '0')

        return [
            {
                type: 'polygon',
                isDraw: true,
                isCheck: false,
                styles: { stroke: { color: colors.red, style: 'dash', dashValue: [2, 2] } },
                dataSource: [
                    [
                        {
                            x: startWidth,
                            y: coordinates[0].y,
                        },
                        {
                            x: viewport.width - endWidth,
                            y: coordinates[0].y
                        },
                    ],
                ]
            },
            {
                type: 'text',
                isDraw: true,
                isCheck: false,
                styles: {
                    color: colors.red,
                    offset: [4, 0],
                    size: 16, weight: 600
                },
                dataSource: [
                    {
                        x: 0,
                        y: coordinates[0].y,
                        text: points[0].text,
                    },
                    {
                        x: viewport.width - endWidth + 2,
                        y: coordinates[0].y,
                        text: points[0].value,
                    }
                ]
            },
        ]
    },
    drawExtend: ({ ctx, dataSource, styles, viewport, precision, xAxis, yAxis, data }) => {
        const positionId = dataSource[1].dataSource[0];
        const positionValue = dataSource[1].dataSource[1];
        labelLine(ctx, positionId, colors.red)
        labelLine(ctx, positionValue, colors.red)

    }
})

const labelLine = (ctx, position, color) => {
    const width = getWidthText(position.text)
    const height = 12;
    roundRect(ctx, position.x, position.y - 6, width, height, 2, color)
    ctx.font = `${_theme.fontSize}px ${_theme.fontFamily}`;
    ctx.fillStyle = colors.white;
    ctx.textBaseline = "middle";
    ctx.fillText(position.text, position.x + 3, position.y)
    ctx.canvas.style.zIndex = 5;
}

const roundRect = (ctx, x, y, w, h, radius, color) => {
    const r = x + w;
    const b = y + h;
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = "1";
    ctx.moveTo(x + radius, y);
    ctx.lineTo(r - radius, y);
    ctx.quadraticCurveTo(r, y, r, y + radius);
    ctx.lineTo(r, y + h - radius);
    ctx.quadraticCurveTo(r, b, r - radius, b);
    ctx.lineTo(x + radius, b);
    ctx.quadraticCurveTo(x, b, x, b - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.stroke();
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}