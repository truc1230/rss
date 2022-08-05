/* eslint-disable no-param-reassign */
import { useEffect, useRef, useState } from 'react';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
import { getOrderBook } from 'src/redux/actions/market';
import { PublicSocketEvent } from 'src/redux/actions/const';
import { useAsync } from 'react-use';
import reverse from 'lodash/reverse';
import sortBy from 'lodash/sortBy';
import Emitter from 'src/redux/actions/emitter';
import colors from 'styles/colors';

if (typeof Highcharts === 'object' && typeof window.Highcharts === 'undefined') {
    window.Highcharts = Highcharts;
}

const DepthChart = ({ symbol, chartSize, darkMode }) => {
    const [orderBook, setOrderBook] = useState({
        bids: [[0, 0]],
        asks: [[0, 0]],
        mean: 0,
    });
    const chartComponent = useRef(null);
    const handleChangeOrderBook = (data) => {
        let bids = data?.bids || [];
        let asks = data?.asks || [];

        bids = sortBy(bids, [(o) => -(+o?.[0])]);
        asks = sortBy(asks, [(o) => +o?.[0]]);
        let newBids = [];
        const newAsks = [];

        let bv = 0; // bids volume
        let av = 0; // asks volume
        let mean = 0;
        if (bids.length && asks.length) {
            mean = (bids?.[0]?.[0] + asks?.[asks.length - 1]?.[0]) / 2;
        }

        for (let i = 0; i < bids.length; i++) {
            bv += +bids?.[i]?.[1];
            newBids.push([+bids?.[i]?.[0], bv]);
        }

        for (let i = 0; i < asks.length; i++) {
            av += +asks?.[i]?.[1];
            newAsks.push([+asks?.[i]?.[0], +av]);
        }
        newBids = reverse(newBids);
        setOrderBook({
            bids: newBids, asks: newAsks, mean,
        });
    };

    useAsync(async () => {
        // Get symbol list
        const data = await getOrderBook(symbol);
        handleChangeOrderBook(data);
    }, [symbol]);

    useEffect(() => {
        const event = PublicSocketEvent.SPOT_DEPTH_UPDATE + 'depth';
        Emitter.on(event, async (data) => {
            handleChangeOrderBook(data);
        });
        return function cleanup() {
            Emitter.off(event);
        };
    }, []);

    let options = {
        credits: {
            enabled: false,
        },
        chart: {
            type: 'area',
            zoomType: 'x',
            panning: {
                enabled: false,
            },
        },
        mapNavigation: {
            enableMouseWheelZoom: true,
        },
        title: {
            text: '',
        },
        exporting: {
            enabled: false,
        },
        navigator: {
            enabled: false,
        },
        xAxis: {
            minPadding: 0,
            maxPadding: 0,
            plotLines: [{
                color: '#EEF2FA',
                value: orderBook.mean,
                width: 1,
                label: {
                    text: '',
                    rotation: 90,
                },
            }],
            title: {
                text: null,
            },
            lineColor: '#ECECEC',
            tickWidth: 0,
            tickLength: 0,
            labels: {
                style: {
                    fontFamily: 'Barlow',
                    color: '#8B8C9B',
                    cursor: 'default',
                    fontSize: '10px',
                    lineHeight: '14px',
                },
                formatter() {
                    return Highcharts.numberFormat(this.value, -1, '.', ',');
                },
            },
            crosshair: {
                className: 'undefined',
                color: '#EEF2FA',
                dashStyle: 'Solid',
                snap: true,
                width: 1,
                zIndex: 2,
            },
        },
        yAxis: [{
            lineWidth: 0,
            gridLineWidth: 0,
            tickWidth: 0,
            tickLength: 0,
            tickPosition: 'inside',
            labels: {
                enabled: false,
            },
            title: {
                text: null,
            },
            crosshair: {
                className: 'undefined',
                color: '#EEF2FA',
                dashStyle: 'Solid',
                snap: true,
                width: 1,
                zIndex: 2,
            },
        }, {
            opposite: true,
            linkedTo: 0,
            lineWidth: 0,
            gridLineWidth: 0,
            title: null,
            tickWidth: 1,
            tickLength: 8,
            tickColor: '#C4C4C4',
            labels: {
                style: {
                    fontFamily: 'Barlow',
                    color: '#8B8C9B',
                    cursor: 'default',
                    fontSize: '12px',
                    lineHeight: '18px',
                },
                formatter() {
                    return Highcharts.numberFormat(this.value, -1, '.', ',');
                },
            },
            crosshair: true,
        }],
        legend: {
            enabled: false,
        },
        plotOptions: {
            area: {
                fillOpacity: 0.5,
                lineWidth: 1,
                step: 'center',
                states: {
                    hover: {
                        enabled: false,
                    },
                },
            },
            series: {
                animation: false,
            },
        },
        tooltip: {
            headerFormat: '<span style="font-size=10px;">Price: {point.key}</span><br/>',
            valueDecimals: 2,
            animation: false,
            hideDelay: 0,
        },
        series: [{
            name: 'Asks',
            data: orderBook.asks,
            fillColor: {
                linearGradient: [0, 0, 0, 500],
                stops: [
                    [0, 'rgba(233, 95, 103, 0.24)'],
                    [1, 'rgba(233, 95, 103, 0)'],
                ],
            },
            color: colors.red,
            marker: {
                enabled: false,
            },
            visible: true,
        }, {
            name: 'Bids',
            data: orderBook.bids,
            fillColor: {
                linearGradient: [0, 0, 0, 500],
                stops: [
                    [0, 'rgba(5, 177, 105, 0.24)'],
                    [1, 'rgba(5, 177, 105, 0)'],
                ],
            },
            color: colors.teal,
            marker: {
                enabled: false,
            },
            visible: true,
        }],
    };

    if (darkMode) {
        options = {
            ...options,
            chart: {
                ...options.chart,
                backgroundColor: {
                    linearGradient: [0, 0, 500, 500],
                    stops: [
                        [0, colors.darkBlue1],
                        [1, colors.darkBlue1],
                    ],
                },
            },
            xAxis: {
                ...options.xAxis,
                crosshair: {
                    ...options.xAxis.crosshair,
                    color: '#1A1D30',
                },
                lineColor: '#1A1D30',
            },
            yAxis: [{
                ...options.yAxis?.[0],
                crosshair: {
                    ...options.yAxis?.[0].crosshair,
                    color: '#1A1D30',
                },
            }],
        };
    } else {
        options = {
            ...options,
            chart: {
                ...options.chart,
                backgroundColor: {
                    linearGradient: [0, 0, 500, 500],
                    stops: [
                        [0, 'rgb(255, 255, 255)'],
                        [1, 'rgb(255, 255, 255)'],
                    ],
                },
            },
        };
    }

    return (
        <HighchartsReact
            containerProps={{ style: { width: '100%', marginTop: '20px' } }}
            highcharts={Highcharts}
            options={options}
            allowChartUpdate
            ref={chartComponent}
            key={chartSize}
        />
    );
};

export default DepthChart;
