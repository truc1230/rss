import * as React from 'react';
import {IconLoading} from 'components/common/Icons';
import NamiExchangeSvg from 'components/svg/NamiExchangeSvg';
import {formatNumber, getTradingViewTimezone} from 'redux/actions/utils';
import colors from '../../../styles/colors';
import {widget} from '../../TradingView/charting_library/charting_library.min';
import Datafeed from '../api';
import {ChartMode} from 'redux/actions/const';
import {VndcFutureOrderType} from '../../screens/Futures/PlaceOrder/Vndc/VndcFutureOrderType'
import ChartOptions from "components/TVChartContainer/MobileTradingView/ChartOptions";
import classNames from "classnames";
import IndicatorBars, {
    mainIndicators,
    subIndicators
} from "components/TVChartContainer/MobileTradingView/IndicatorBars";
import {find, get, set} from "lodash";

const CONTAINER_ID = "nami-mobile-tv";
const CHART_VERSION = "1.0.8";
const ChartStatus = {
    NOT_LOADED: 1,
    LOADED: 2,
    RECONNECTING: 3,
    UNABLE_TO_CONNECT: 4,
};

export class MobileTradingView extends React.PureComponent {
    state = {
        chartStatus: ChartStatus.NOT_LOADED,
        chartType: "price",
        interval: this.props.initTimeFrame,
        studies: [],
        priceChartType: 1,
        mainIndicator: null,
        subIndicator: null
    };

    tvWidget = null;
    drawnOrder = {};
    drawnSl = {};
    drawnTp = {};
    drawnProfit = {};
    intervalSaveChart = null;
    timer = null;
    firstTime = true;
    oldOrdersList = [];

    containerId = `${this.props.containerId || CONTAINER_ID}-${this.props.symbol}`;

    constructor(props) {
        super(props);
        this.timeFrame = React.createRef();
        this.t = props.t;
    }


    componentDidMount() {
        this.initWidget(this.props.symbol, this.props.initTimeFrame);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (
            this.props.symbol !== prevProps.symbol ||
            this.props.chartSize !== prevProps.chartSize
        ) {
            this.widget.remove();
            this.oldOrdersList = [];
            this.initWidget(this.props.symbol);
        }

        if (prevProps.theme !== this.props.theme) {
            const newTheme = this.props.theme === "dark" ? "Dark" : "Light";
            if (
                this.state.chartStatus === ChartStatus.LOADED &&
                newTheme !== this.theme &&
                this.widget
            ) {
                this.widget.changeTheme(newTheme);
                const isDark = this.props.theme === "dark";
                this.widget.applyOverrides({
                    "scalesProperties.lineColor": "#202C4C",
                    'paneProperties.background': colors.onus.bg,
                    "paneProperties.vertGridProperties.color": colors.onus.bg,
                    "paneProperties.horzGridProperties.color": colors.onus.bg,
                });
                this.theme = newTheme;
            }
        }

        if (prevProps.initTimeFrame !== this.props.initTimeFrame) {
            this.handleActiveTime(this.props.initTimeFrame)
        }

        if ((prevProps.ordersList !== this.props.ordersList) && !this.firstTime) {
            this.rawOrders();
        }
    }

    componentWillUnmount() {
        if (this.tvWidget !== null) {
            this.tvWidget.remove();
            this.tvWidget = null;
        }
        clearInterval(this.intervalSaveChart);
    }

    handleActiveTime = (value) => {
        if (this?.widget) {
            this.widget.setSymbol(this.props.symbol, value, () => {
            });
            this.setState({interval: value});
        }
    };

    handleChangeChartType = (type) => {
        if (this?.widget) {
            this.widget.chart().setChartType(type);
            this.setState({priceChartType: type});
        }
    };

    createIndicator = (name, cb) => this.widget.activeChart().createStudy(name, false, false, undefined, cb)

    handleChangeIndicator = (type) => (value) => {
        const indicatorStateKey = type === 'main' ? 'mainIndicator' : 'subIndicator';
        const studyId = this.state[indicatorStateKey]?.id
        if (studyId) {
            this.widget.activeChart().removeEntity(studyId)
        }
        if (value) {
            this.createIndicator(value, (id) => {
                this.setState({
                    ...this.state,
                    [indicatorStateKey]: {id, name: value}
                })
            })
        } else {
            this.setState({...this.state, [indicatorStateKey]: null})
        }
    }

    // eslint-disable-next-line class-methods-use-this
    get getChartKey() {
        return `nami-tv__${CHART_VERSION}`;
    }

    loadSavedChart = () => {
        // Load saved chart
        let savedChart = localStorage.getItem(this.getChartKey);
        if (savedChart) {
            try {
                const data = JSON.parse(savedChart);
                set(data, 'charts[0].panes[0].sources[0].state.symbol', this.props.symbol)
                this.widget.load(data);
            } catch (err) {
                localStorage.removeItem(this.getChartKey);
                console.error('Load chart error', err);
            }
        }

        // Sync resolution to local component state
        setTimeout(() => {
            const interval = this.widget.activeChart().resolution()
            this.setState({
                ...this.state,
                interval,
                priceChartType: this.widget.activeChart().chartType(),
            })
            if (this.props.onIntervalChange) {
                this.props.onIntervalChange(interval)
            }
        }, 0)
    }

    // eslint-disable-next-line class-methods-use-this
    saveChart = () => {
        try {
            if (this.widget) {
                this.widget.save((data) => {
                    let currentData = JSON.parse(localStorage.getItem(this.getChartKey) || '{}')
                    localStorage.setItem(this.getChartKey, JSON.stringify(Object.assign(currentData, data)));
                });
            }
        } catch (err) {
            console.error("Save chart error", err);
        }
    };

    getOrderType = (order) => {
        const orderType = order.status === VndcFutureOrderType.ACTIVE ? '' : order.type;
        return `${order.side} ${orderType}`.toUpperCase();
    };

    getTicket = ({displaying_id: displayingId}) => {
        return displayingId;
    }

    toNormalText(line) {
        if (!line) return null;
        const font = line.getBodyFont();
        const rex = /(.+)(\s+)(\dpt)(\s+)(.+)/;
        return font.replace(rex, 'normal$2$3$4$5');
    }

    async newOrder(displayingId, order) {
        const isMatched = !(order.status === 0 || (order.status === 2 && order.openPrice == null))
        try {
            const color = this.getOrderType(order).startsWith('BUY') ? colors.onus.green : colors.onus.red;
            const colorSl = colors.onus.red;
            const colorTp = colors.onus.green;
            const line = this.widget
                .chart()
                .createOrderLine()
                .setText(`# ${this.getTicket(order)} ${this.getOrderType(order)}`)
                .setPrice(order?.open_price || order?.price)
                .setQuantity(null)
                .setEditable(false)
                .setLineColor(color)
                .setBodyTextColor('rgb(255,255,255)')
                .setQuantityBackgroundColor('rgba(0,0,0,0)')
                .setQuantityBorderColor('rgba(0,0,0,0)')
                .setQuantityTextColor('rgb(0, 0, 0)')
                .setLineLength(120)
                .setLineWidth(2)
                .setBodyBackgroundColor(color)
                .setBodyBorderColor(color)
                .setCancelButtonBorderColor('rgb(255,0,0)')
                .setCancelButtonBackgroundColor('rgb(0,255,0)')
                .setCancelButtonIconColor('rgb(0,0,255)');
            line.setBodyFont(this.toNormalText(line));
            this.drawnOrder[displayingId] = line;
            if (order.sl > 0) {
                const lineSl = this.widget
                    .chart()
                    .createOrderLine()
                    .setText(`# ${displayingId} SL`)
                    .setPrice(order.sl)
                    .setQuantity(null)
                    .setEditable(false)
                    .setLineColor(colorSl)
                    .setBodyTextColor(colorSl)
                    .setBodyBackgroundColor('rgba(0,0,0,0)')
                    .setBodyBorderColor('rgba(0,0,0,0)')
                    .setLineLength(100)
                    .setLineWidth(1)
                    .setLineStyle(0);
                lineSl.setBodyFont(this.toNormalText(lineSl));
                this.drawnSl[displayingId] = lineSl;
            }
            if (order.tp > 0) {
                const lineTp = this.widget
                    .chart()
                    .createOrderLine()
                    .setText(`# ${displayingId} TP`)
                    .setPrice(order.tp)
                    .setQuantity(null)
                    .setEditable(false)
                    .setLineColor(colorTp)
                    .setBodyTextColor(colorTp)
                    .setBodyBackgroundColor('rgba(0,0,0,0)')
                    .setBodyBorderColor('rgba(0,0,0,0)')
                    .setLineLength(100)
                    .setLineWidth(1)
                    .setLineStyle(0);
                lineTp.setBodyFont(this.toNormalText(lineTp));
                this.drawnTp[displayingId] = lineTp;
            }


            if (this.props.renderProfit) {
                const color = order.profit > 0 ? colors.onus.green : colors.onus.red;

                if (order.close_price != null && (order.profit != null || order.profitToDraw != null)) {
                    const lineProfit = this.widget
                        .chart()
                        .createOrderLine()
                        .setText(`# ${displayingId} Profit: ${order.profit.toFixed(4)}`)
                        .setQuantity(null)
                        .setPrice(order.close_price)
                        .setEditable(false)
                        .setLineColor(color)
                        .setBodyTextColor('rgba(255,255,255,1)')
                        .setQuantityBackgroundColor('rgba(0,0,0,0)')
                        .setQuantityBorderColor('rgba(0,0,0,0)')
                        .setQuantityTextColor('rgb(0, 0, 0)')
                        .setLineLength(120)
                        .setBodyBackgroundColor('rgb(187,187,187)')
                        .setBodyBorderColor('rgb(187,187,187)')
                        .setCancelButtonBorderColor('rgb(255,0,0)')
                        .setCancelButtonBackgroundColor('rgb(0,255,0)')
                        .setLineWidth(2)
                        .setLineStyle(0)
                        .setCancelButtonIconColor('rgb(0,0,255)');
                    this.drawnProfit[displayingId] = lineProfit;
                    lineProfit.setBodyFont(this.toNormalText(lineProfit));
                }
            }

            return line;
        } catch (err) {
            console.error('__ err', err);
        }
    }

    rawOrders = async () => {
        const _ordersList = this.props.ordersList.filter(order => order?.symbol === this.props.symbol);
        const edited = localStorage.getItem('edited_id');
        if (edited) {
            const itemEdited = _ordersList.find(order => String(order?.displaying_id) === edited)
            if (itemEdited) {
                if (this.drawnOrder.hasOwnProperty(itemEdited?.displaying_id)) {
                    this.drawnOrder[itemEdited?.displaying_id].remove();
                    delete this.drawnOrder[itemEdited?.displaying_id];
                }
                if (this.drawnSl.hasOwnProperty(itemEdited?.displaying_id)) {
                    this.drawnSl[itemEdited?.displaying_id].remove();
                    delete this.drawnSl[itemEdited?.displaying_id];
                }
                if (this.drawnTp.hasOwnProperty(itemEdited?.displaying_id)) {
                    this.drawnTp[itemEdited?.displaying_id].remove();
                    delete this.drawnTp[itemEdited?.displaying_id];
                }
                if (this.drawnProfit.hasOwnProperty(itemEdited?.displaying_id)) {
                    this.drawnProfit[itemEdited?.displaying_id].remove();
                    delete this.drawnProfit[itemEdited?.displaying_id];
                }
                this.newOrder(itemEdited.displaying_id, itemEdited);
                localStorage.removeItem('edited_id');
            }
        }
        const newDataOrders = _ordersList.filter(order => {
            if (this.props.renderProfit) return true
            return (order.status === VndcFutureOrderType.Status.ACTIVE || order.status === VndcFutureOrderType.Status.PENDING) && !this.oldOrdersList.find(id => order.displaying_id === id)
        })
        if (newDataOrders.length > 0) {
            newDataOrders.forEach((order) => {
                this.newOrder(order.displaying_id, order);
            })
        } else {
            const removeOrders = this.oldOrdersList.filter(id => !_ordersList.find(order => order.displaying_id === id));
            removeOrders.forEach((id) => {
                if (this.drawnOrder.hasOwnProperty(id)) {
                    this.drawnOrder[id].remove();
                    delete this.drawnOrder[id];
                }
                if (this.drawnSl.hasOwnProperty(id)) {
                    this.drawnSl[id].remove();
                    delete this.drawnSl[id];
                }
                if (this.drawnTp.hasOwnProperty(id)) {
                    this.drawnTp[id].remove();
                    delete this.drawnTp[id];
                }
                if (this.drawnProfit.hasOwnProperty(id)) {
                    this.drawnProfit[id].remove();
                    delete this.drawnProfit[id];
                }
            })
        }
        this.oldOrdersList = this.props?.ordersList.map(order => (order.status === VndcFutureOrderType.Status.ACTIVE || order.status === VndcFutureOrderType.Status.PENDING) && order.displaying_id)
    };

    initWidget = (symbol) => {
        if (!symbol) return;

        const datafeed = new Datafeed(this.props.mode || ChartMode.SPOT)
        const widgetOptions = {
            symbol,
            datafeed,
            theme: 'Dark',
            interval: this.props.initTimeFrame,
            container_id: this.containerId,
            library_path: this.props.libraryPath,
            locale: "en",
            disabled_features: [
                'legend_context_menu',
                'symbol_search_hot_key',
                'legend_widget',
                'timeframes_toolbar',
                'study_templates',
                'header_saveload',
                'caption_buttons_text_if_possible',
                'context_menus',
                'symbol_info', // Header
                'header_widget_dom_node',
                'header_symbol_search',
                'symbol_search_hot_key',
                'header_interval_dialog_button',
                'show_interval_dialog_on_key_press',
                'header_settings',
                'header_compare',
                'header_undo_redo',
                'header_screenshot',
                'header_fullscreen_button',
                'main_series_scale_menu',
                'left_toolbar',
                'volume_force_overlay',
                'use_localstorage_for_settings',

                "compare_symbol",
                "display_market_status",
                "go_to_date",
                "source_selection_markers",
                "popup_hints",
                "header_widget",
                "axis_pressed_mouse_move_scale",
            ],
            enabled_features: [
                "move_logo_to_main_pane",
                "edit_buttons_in_legend",
            ],
            charts_storage_url: this.props.chartsStorageUrl,
            charts_storage_api_version: this.props.chartsStorageApiVersion,
            client_id: this.props.clientId,
            user_id: this.props.userId,
            fullscreen: this.props.fullscreen,
            autosize: true,
            loading_screen: { backgroundColor: colors.onus.bg, },
            studies_overrides: {
                "volume.volume.color.0": colors.onus.red,
                "volume.volume.color.1": colors.onus.green,
                "volume.volume ma.color": colors.onus.red,
                "volume.volume ma.linewidth": 5,
                "volume.volume ma.visible": true,
                "bollinger bands.median.color": "#33FF88",
                "bollinger bands.upper.color": "#00ffff",
                "bollinger bands.lower.color": "#f263f3",
                "moving average exponential.plot.color": "#00C8BC",
                "moving average.plot.color": "#00ffff",
                "macd.histogram.color": "#00ffff",
                "macd.macd.color": "#e9a55d",
                "macd.signal.color": "#f263f3",
                "relative strength index.plot.color": "#00ffff",
            },
            timezone: getTradingViewTimezone(),
            overrides: {
                "scalesProperties.fontSize": 10,
                editorFontsList: ["Inter", "Sans"],
                "volumePaneSize": "tiny"
            },
            custom_css_url: '/library/trading_view/custom_mobile_chart.css?version=2'
        };

        // Clear to solve config when load saved chart
        if (this?.intervalSaveChart) clearInterval(this.intervalSaveChart);

        // eslint-disable-next-line new-cap
        this.widget = new widget(widgetOptions);
        this.widget.onChartReady(() => {

            // Load saved chart
            this.loadSavedChart()
            this.syncIndicators()
            this.widget.applyOverrides({
                "mainSeriesProperties.priceAxisProperties.autoScale": true,
                "scalesProperties.lineColor": colors.onus.bg,
                "scalesProperties.textColor": colors.onus.grey,
                'paneProperties.background': colors.onus.bg,
                "paneProperties.vertGridProperties.color": colors.onus.bg,
                "paneProperties.horzGridProperties.color": colors.onus.bg,

                "mainSeriesProperties.candleStyle.borderUpColor": colors.onus.green,
                "mainSeriesProperties.candleStyle.borderDownColor": colors.onus.red,
                "mainSeriesProperties.candleStyle.wickUpColor": colors.onus.green,
                "mainSeriesProperties.candleStyle.wickDownColor": colors.onus.red,
                "mainSeriesProperties.candleStyle.upColor": colors.onus.green,
                "mainSeriesProperties.candleStyle.downColor": colors.onus.red,
                "mainSeriesProperties.hollowCandleStyle.borderColor": colors.onus.green,
                "mainSeriesProperties.hollowCandleStyle.borderDownColor": colors.onus.red,

                "volumePaneSize": "tiny"
            });
            this.setState({chartStatus: ChartStatus.LOADED});
            // if (this.props.isVndcFutures) {
                if (this.timer) clearTimeout(this.timer)
                this.timer = setTimeout(() => {
                    this.rawOrders();
                    this.firstTime = false;
                }, 2000);
            // }
            if (this?.intervalSaveChart) clearInterval(this.intervalSaveChart);
            this.intervalSaveChart = setInterval(this.saveChart, 5000);
        });
    };

    syncIndicators = () => {
        const currentStudies = this.widget.activeChart().getAllStudies();
        this.setState({
            ...this.state,
            mainIndicator: find(currentStudies, s => !!find(mainIndicators, {value: s.name})),
            subIndicator: find(currentStudies, s => !!find(subIndicators, {value: s.name})),
        })
    }

    handleOpenIndicatorModal = () => {
        if (this?.widget) {
            this.widget.chart().executeActionById("insertIndicator");
        }
    };

    resetComponent = () => {
        localStorage.removeItem(this.getChartKey);
        if (this.props.reNewComponentKey) this.props.reNewComponentKey()
    }

    render() {
        return (
            <>
                <div
                    className="relative flex flex-grow flex-col h-full bg-onus"
                    id="chart-container"
                >
                    <div
                        className={classNames(`absolute w-full h-full flex justify-center items-center`, {
                            "hidden": this.state.chartStatus === ChartStatus.LOADED
                        })}
                    >
                        <IconLoading color={colors.onus.green}/>
                    </div>
                    {this.props.showTimeFrame &&
                    <div className="w-full border-b border-onus-line py-2 dragHandleArea z-10">
                        <ChartOptions
                            pair={this.props.symbol}
                            pairConfig={this.props.pairConfig}
                            isVndcFutures={this.props.isVndcFutures}
                            resolution={this.state.interval}
                            setResolution={this.handleActiveTime}
                            isFullScreen={this.props.isFullScreen}
                            chartType={this.state.priceChartType}
                            setChartType={this.handleChangeChartType}
                            showSymbol={this.props.showSymbol}
                            showIconGuide={this.props.showIconGuide}
                        />
                    </div>
                    }
                    <div
                        id={this.containerId}
                        className={`h-full pr-2 ${this.props.classNameChart}`}
                        style={this.props.styleChart}
                    />
                    <div>
                        {
                            this.state.chartStatus === ChartStatus.LOADED &&
                            <IndicatorBars
                                handleOpenIndicatorModal={this.handleOpenIndicatorModal}
                                setMainIndicator={this.handleChangeIndicator('main')}
                                setSubIndicator={this.handleChangeIndicator('sub')}
                                mainIndicator={this.state.mainIndicator?.name}
                                subIndicator={this.state.subIndicator?.name}
                                setCollapse={this.props.setCollapse}
                                collapse={this.props.collapse}
                                resetComponent={this.resetComponent}
                            />
                        }
                    </div>
                    {/*<div className="!w-32 cheat-watermark">*/}
                    {/*    <NamiExchangeSvg color={colors.grey4}/>*/}
                    {/*</div>*/}
                </div>
            </>
        );
    }
}

MobileTradingView.defaultProps = {
    symbol: "BTCUSDT",
    interval: "1",
    containerId: "nami-mobile-tv",
    datafeedUrl: "https://demo_feed.tradingview.com",
    libraryPath: "/library/trading_view/charting_library/",
    chartsStorageUrl: "https://saveload.tradingview.com",
    chartsStorageApiVersion: "1.1",
    clientId: "tradingview.com",
    userId: "public_user_id",
    isFullScreen: false,
    showSymbol: true,
    showIconGuide: true,
    autosize: true,
    showTimeFrame: true,
    renderProfit: false,
    ordersList: [],
    studies_overrides: {
        "volume.volume.color.0": colors.onus.green,
        "volume.volume.color.1": colors.onus.red,
        "volume.volume ma.color": colors.onus.red,
        "volume.volume ma.linewidth": 5,
        "volume.volume ma.visible": true,
        "bollinger bands.median.color": "#33FF88",
        "bollinger bands.upper.linewidth": 7,
    },
};
