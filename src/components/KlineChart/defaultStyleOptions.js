import { THEME_MODE } from 'hooks/useDarkMode';
import colors from '../../styles/colors';

export const _theme = {
    fontSize: 10,
    fontFamily: 'Barlow, sans-serif',
    textColor: colors.white,
};

// Read more: https://klinecharts.com/guide/style
export default (themeMode = THEME_MODE.DARK) => {
    const theme = {
        ..._theme,
        textColor: {
            [THEME_MODE.DARK]: colors.white,
            [THEME_MODE.LIGHT]: colors.grey1,
        }[themeMode],
    };
    return {
        grid: {
            show: true,
            horizontal: {
                show: true,
                size: 1,
                color: 'rgba(113,128,150,0.12)',
                // 'solid'|'dash'
                style: 'solid',
                dashValue: [2, 2],
            },
            vertical: {
                show: false,
                size: 1,
                color: colors.grey4,
                // 'solid'|'dash'
                style: 'dash',
                dashValue: [2, 2],
            },
        },
        candle: {
            margin: {
                top: 0.2,
                bottom: 0.1,
            },
            // 'candle_solid'|'candle_stroke'|'candle_up_stroke'|'candle_down_stroke'|'ohlc'|'area'
            type: 'candle_solid',
            bar: {
                upColor: colors.teal,
                downColor: colors.red,
                noChangeColor: colors.teal,
            },
            area: {
                lineSize: 2,
                lineColor: '#2196F3',
                value: 'close',
                backgroundColor: [{
                    offset: 0,
                    color: 'rgba(33, 150, 243, 0.01)',
                }, {
                    offset: 1,
                    color: 'rgba(33, 150, 243, 0.2)',
                }],
            },
            priceMark: {
                show: true,
                high: {
                    show: true,
                    color: colors.grey1,
                    textMargin: 5,
                    textSize: 10,
                    textFamily: theme.fontFamily,
                    textWeight: 'normal',
                },
                low: {
                    show: true,
                    color: colors.grey1,
                    textMargin: 5,
                    textSize: 10,
                    textFamily: theme.fontFamily,
                    textWeight: 'normal',
                },
                last: {
                    show: true,
                    upColor: colors.teal,
                    downColor: colors.red,
                    noChangeColor: colors.teal,
                    line: {
                        show: true,
                        // 'solid'|'dash'
                        style: 'dash',
                        dashValue: [4, 4],
                        size: 1,
                    },
                    text: {
                        show: true,
                        size: theme.fontSize,
                        paddingLeft: 2,
                        paddingTop: 2,
                        paddingRight: 2,
                        paddingBottom: 2,
                        color: '#FFFFFF',
                        family: theme.fontFamily,
                        weight: 'normal',
                        borderRadius: 2,
                    },
                },
            },
            tooltip: {
                // 'always' | 'follow_cross' | 'none'
                showRule: 'follow_cross',
                // 'standard' | 'rect'
                showType: 'rect',
                labels: ['T: ', 'O: ', 'C: ', 'H: ', 'L: ', 'V: '],
                values: null,
                defaultValue: 'n/a',
                rect: {
                    paddingLeft: 0,
                    paddingRight: 0,
                    paddingTop: 0,
                    paddingBottom: 6,
                    offsetLeft: 8,
                    offsetTop: 8,
                    offsetRight: 70,
                    borderRadius: 4,
                    borderSize: 1,
                    borderColor: '#3f4254',
                    backgroundColor: 'rgba(17, 17, 17, .3)',
                },
                text: {
                    size: theme.fontSize,
                    family: theme.fontFamily,
                    weight: 'normal',
                    color: theme.textColor,
                    marginLeft: 8,
                    marginTop: 6,
                    marginRight: 8,
                    marginBottom: 0,
                },
            },
        },
        technicalIndicator: {
            margin: {
                top: 0.2,
                bottom: 0.1,
            },
            bar: {
                upColor: colors.teal,
                downColor: colors.red,
                noChangeColor: colors.teal,
            },
            line: {
                size: 1,
                // colors: ['#FF9600', '#9D65C9', '#2196F3', '#E11D74', '#01C5C4'],
                colors: ['rgba(255,150,0,0.6)', 'rgba(157,101,201,0.6)', 'rgba(33,150,243,0.6)', 'rgba(225,29,116,0.6)', 'rgba(1,197,196,0.6)'],
            },
            circle: {
                upColor: colors.teal,
                downColor: colors.red,
                noChangeColor: colors.teal,
            },
            lastValueMark: {
                show: false,
                text: {
                    show: false,
                    color: '#ffffff',
                    size: theme.fontSize,
                    family: theme.fontFamily,
                    weight: 'normal',
                    paddingLeft: 3,
                    paddingTop: 2,
                    paddingRight: 3,
                    paddingBottom: 2,
                    borderRadius: 2,
                },
            },
            tooltip: {
                // 'always' | 'follow_cross' | 'none'
                showRule: 'none',
                // 'standard' | 'rect'
                showType: 'standard',
                showName: true,
                showParams: true,
                defaultValue: 'n/a',
                text: {
                    size: theme.fontSize,
                    family: theme.fontFamily,
                    weight: 'normal',
                    color: theme.textColor,
                    marginTop: 6,
                    marginRight: 8,
                    marginBottom: 0,
                    marginLeft: 8,
                },
            },
        },
        xAxis: {
            show: true,
            height: null,
            axisLine: {
                show: false,
                color: '#888888',
                size: 1,
            },
            tickText: {
                show: true,
                color: theme.textColor,
                family: theme.fontFamily,
                weight: 'normal',
                size: theme.fontSize,
                paddingTop: 3,
                paddingBottom: 6,
            },
            tickLine: {
                show: false,
                size: 1,
                length: 3,
                color: '#888888',
            },
        },
        yAxis: {
            show: true,
            width: null,
            // 'left' | 'right'
            position: 'right',
            // 'normal' | 'percentage' | 'log'
            type: 'normal',
            inside: true,
            axisLine: {
                show: false,
                color: '#888888',
                size: 1,
            },
            tickText: {
                show: true,
                color: theme.textColor,
                family: theme.fontFamily,
                weight: 'normal',
                size: theme.fontSize,
                paddingLeft: 3,
                paddingRight: 6,
            },
            tickLine: {
                show: false,
                size: 1,
                length: 3,
                color: '#888888',
            },
        },
        separator: {
            size: 1,
            color: 'rgba(113,128,150,0.24)',
            fill: true,
            activeBackgroundColor: 'rgba(230, 230, 230, .15)',
        },
        crosshair: {
            show: true,
            horizontal: {
                show: true,
                line: {
                    show: true,
                    // 'solid'|'dash'
                    style: 'dash',
                    dashValue: [4, 2],
                    size: 1,
                    color: '#888888',
                },
                text: {
                    show: true,
                    color: colors.white,
                    size: theme.fontSize,
                    family: theme.fontFamily,
                    weight: 'normal',
                    paddingLeft: 2,
                    paddingRight: 2,
                    paddingTop: 2,
                    paddingBottom: 2,
                    borderSize: 1,
                    borderColor: '#505050',
                    borderRadius: 2,
                    backgroundColor: '#505050',
                },
            },
            vertical: {
                show: true,
                line: {
                    show: true,
                    // 'solid'|'dash'
                    style: 'dash',
                    dashValue: [4, 2],
                    size: 1,
                    color: '#888888',
                },
                text: {
                    show: true,
                    color: colors.white,
                    size: theme.fontSize,
                    family: theme.fontFamily,
                    weight: 'normal',
                    paddingLeft: 2,
                    paddingRight: 2,
                    paddingTop: 2,
                    paddingBottom: 2,
                    borderSize: 1,
                    borderColor: '#505050',
                    borderRadius: 2,
                    backgroundColor: '#505050',
                },
            },
        },
        shape: {
            point: {
                backgroundColor: '#2196F3',
                borderColor: '#2196F3',
                borderSize: 1,
                radius: 4,
                activeBackgroundColor: '#2196F3',
                activeBorderColor: '#2196F3',
                activeBorderSize: 1,
                activeRadius: 6,
            },
            line: {
                // 'solid'|'dash'
                style: 'solid',
                color: '#2196F3',
                size: 1,
                dashValue: [2, 2],
            },
            polygon: {
                // 'stroke'|'fill'
                style: 'stroke',
                stroke: {
                    // 'solid'|'dash'
                    style: 'solid',
                    size: 1,
                    color: '#2196F3',
                    dashValue: [2, 2],
                },
                fill: {
                    color: 'rgba(33, 150, 243, 0.1)',
                },
            },
            arc: {
                // 'stroke'|'fill'
                style: 'stroke',
                stroke: {
                    // 'solid'|'dash'
                    style: 'solid',
                    size: 1,
                    color: '#2196F3',
                    dashValue: [2, 2],
                },
                fill: {
                    color: '#2196F3',
                },
            },
            text: {
                style: 'fill',
                color: '#2196F3',
                size: 12,
                family: 'Helvetica Neue',
                weight: 'normal',
                offset: [0, 0],
            },
        },
        annotation: {
            // 'top' | 'bottom' | 'point'
            position: 'top',
            offset: [20, 0],
            symbol: {
                // 'diamond' | 'circle' | 'rect' | 'triangle' | 'custom' | 'none'
                type: 'diamond',
                size: 8,
                color: '#2196F3',
                activeSize: 10,
                activeColor: '#FF9600',
            },
        },
        tag: {
            // 'top' | 'bottom' | 'point'
            position: 'point',
            offset: 0,
            line: {
                show: true,
                style: 'dash',
                dashValue: [4, 2],
                size: 1,
                color: '#2196F3',
            },
            text: {
                color: '#FFFFFF',
                backgroundColor: '#2196F3',
                size: 12,
                family: 'Helvetica Neue',
                weight: 'normal',
                paddingLeft: 2,
                paddingRight: 2,
                paddingTop: 2,
                paddingBottom: 2,
                borderRadius: 2,
                borderSize: 1,
                borderColor: '#2196F3',
            },
            mark: {
                offset: 0,
                color: '#FFFFFF',
                backgroundColor: '#2196F3',
                size: 12,
                family: 'Helvetica Neue',
                weight: 'normal',
                paddingLeft: 2,
                paddingRight: 2,
                paddingTop: 2,
                paddingBottom: 2,
                borderRadius: 2,
                borderSize: 1,
                borderColor: '#2196F3',
            },
        },
    };
};
