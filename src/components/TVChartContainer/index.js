import * as React from 'react';
import { IconLoading } from 'src/components/common/Icons';
import NamiExchangeSvg from 'src/components/svg/NamiExchangeSvg';
import { getTradingViewTimezone } from 'src/redux/actions/utils';
import colors from '../../styles/colors';
import { widget } from '../TradingView/charting_library/charting_library.min';
import Datafeed from './api';
import DepthChart from './depth';
import TimeFrame from './timeFrame';
import styles from './tradingview.module.scss';
import { ChartMode } from 'redux/actions/const';
import { VndcFutureOrderType } from '../screens/Futures/PlaceOrder/Vndc/VndcFutureOrderType'
import { isMobile } from 'react-device-detect';

const CONTAINER_ID = "nami-tv";
const CHART_VERSION = "1.0.6";
const ChartStatus = {
    NOT_LOADED: 1,
    LOADED: 2,
    RECONNECTING: 3,
    UNABLE_TO_CONNECT: 4,
};
// eslint-disable-next-line func-names
const SignalSupportTimeframes = ['1', '5', '15', '60']
export class TVChartContainer extends React.PureComponent {
    containerId = `${CONTAINER_ID}-${this.props.symbol}`;

    state = {
        // active: true,
        chartStatus: ChartStatus.NOT_LOADED,
        chartType: "price",
        interval: "60",
        studies: [],
        priceChartType: 1,
        // chartCompareLoaded: true,
    };

    tvWidget = null;
    drawnOrder = {};
    drawnSl = {};
    drawnTp = {};
    intervalSaveChart = null;
    timer = null;
    firstTime = true;
    oldOrdersList = [];

    constructor(props) {
        super(props);
        this.timeFrame = React.createRef();
        this.t = props.t;
    }

    componentDidMount() {
        this.initWidget(this.props.symbol);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (
            this.props.symbol !== prevProps.symbol ||
            this.props.chartSize !== prevProps.chartSize
        ) {
            // if (this.widget && this.state.chartStatus === ChartStatus.LOADED) {

            //     this.widget.setSymbol(
            //         this.props.symbol,
            //         this.state.interval,
            //         () => {
            //             this.widget.applyOverrides({
            //                 "mainSeriesProperties.priceAxisProperties.autoScale": true,
            //             });
            //         }
            //     );
            // } else {
            //     this.initWidget(this.props.symbol, this.state.interval);
            // }
            this.widget.remove();
            this.oldOrdersList = [];
            this.initWidget(this.props.symbol, this.state.interval);
            // if (this.props.isVndcFutures) {
            //     if (this.timer) clearTimeout(this.timer)
            //     console.log(2222222222)
            //     this.timer = setTimeout(() => {
            //         this.rawOrders();
            //     }, 2000);
            // }
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
                    "scalesProperties.lineColor": isDark ? "#202C4C" : "#F2F4F6",
                    'paneProperties.background': isDark ? colors.darkBlue1 : colors.white,
                    "paneProperties.vertGridProperties.color": isDark ? colors.darkBlue2 : colors.grey4,
                    "paneProperties.horzGridProperties.color": isDark ? colors.darkBlue2 : colors.grey4,
                });
                this.theme = newTheme;
            }
        }
        if ((prevProps.ordersList !== this.props.ordersList) && this.props.isVndcFutures && !this.firstTime) {
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
                // const to = new Date().getTime() / 1000;
                // const from = to - 24 * 60 * 60 * getMultiValue(value);
                // this.widget
                //     .activeChart()
                //     .setVisibleRange(
                //         { from, to },
                //         { applyDefaultRightMargin: true },
                //     )
                //     .then(() => {});
            });
            this.setState({ interval: value });
        }
    };

    handleCreateStudy = (studyId) => {
        if (this?.widget) {
            this.widget
                .activeChart()
                .createStudy(studyId, false, false)
                .then((id) => {
                    this.timeFrame.current.syncStudies(studyId, id);
                });
        }
    };

    handleRemoveStudy = (id) => {
        if (this?.widget) {
            this.widget.activeChart().removeEntity(id, {
                disableUndo: true,
            });
        }
    };

    handleRemoveAllStudies = () => {
        if (this?.widget) {
            this.widget.activeChart().removeAllShapes();
            this.widget.activeChart().removeAllStudies();
        }
    };

    handleOpenStudty = () => {
        if (this?.widget) {
            this.widget.chart().executeActionById("insertIndicator");
        }
    };

    handleChangeChartType = (type) => {
        if (this?.widget) {
            this.widget.chart().setChartType(type);
            this.setState({ priceChartType: type });
        }
    };

    // eslint-disable-next-line class-methods-use-this
    get getChartKey() {
        return `nami-tv__${CHART_VERSION}`;
    }

    loadSavedChart = () => {
        // Load saved chart
        let savedChart = localStorage.getItem(this.getChartKey);
        if (savedChart) {
            try {
                const symbol = this.props.symbol
                const data = JSON.parse(savedChart);
                if (typeof data === 'object' && data[`chart_${symbol.toLowerCase()}`]) {
                    this.widget.load(data[`chart_${symbol.toLowerCase()}`]);
                }
            } catch (err) {
                console.error('Load chart error', err);
            }
        }
    }

    // eslint-disable-next-line class-methods-use-this
    saveChart = () => {
        try {
            if (this.widget) {
                this.widget.save((data) => {
                    let currentData = localStorage.getItem(this.getChartKey);
                    if (currentData) {
                        try {
                            currentData = JSON.parse(currentData);
                            if (typeof currentData !== "object") {
                                currentData = null;
                            }
                        } catch (ignored) {
                            currentData = null;
                        }
                    }
                    if (!currentData) {
                        currentData = {
                            created_at: new Date(),
                        };
                    }

                    const obj = {
                        updated_at: new Date(),
                        [`chart_${this.props.symbol.toLowerCase()}`]: data,
                        chart_all: data,
                    };
                    localStorage.setItem(
                        this.getChartKey,
                        JSON.stringify(Object.assign(currentData, obj))
                    );
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

    getTicket = ({ displaying_id: displayingId }) => {
        return displayingId;
    }

    toNormalText(line) {
        if (!line) return null;
        const font = line.getBodyFont();
        const rex = /(.+)(\s+)(\dpt)(\s+)(.+)/;
        return font.replace(rex, 'normal$2$3$4$5');
    }

    async newOrder(displayingId, order) {
        try {
            const color = this.getOrderType(order).startsWith('BUY') ? colors.teal : colors.red2;
            const colorSl = colors.red2;
            const colorTp = colors.teal;
            const line = this.widget.chart().
                createOrderLine().
                onModify(() => { }).
                setText(`${!isMobile ? ('#' + this.getTicket(order)) : ''} ${this.getOrderType(order)} ${order?.quantity}`).
                setPrice(order?.open_price || order?.price).
                setQuantity(null).
                setTooltip(
                    `${this.getOrderType(order)} ${order?.quantity} ${order?.symbol} at price ${order?.open_price}`).
                setEditable(false).
                setLineColor(color).
                setBodyBorderColor(color).
                setBodyTextColor(color).
                setQuantityBackgroundColor(color).
                setQuantityBorderColor(color).
                setLineLength(120).
                setBodyBackgroundColor('rgba(0,0,0,0)').
                setBodyBorderColor('rgba(0,0,0,0)').
                setCancelButtonBorderColor('rgb(255,0,0)').
                setCancelButtonBackgroundColor('rgb(0,255,0)').
                setCancelButtonIconColor('rgb(0,0,255)');
            line.setBodyFont(this.toNormalText(line));
            this.drawnOrder[displayingId] = line;
            if (order.sl > 0) {
                const lineSl = this.widget.chart().
                    createOrderLine().
                    setText(`${!isMobile ? ('#' + this.getTicket(order)) : ''} sl ${order.sl}`).
                    setPrice(order.sl).
                    setQuantity(null).
                    setEditable(false).
                    setLineColor(colorSl).
                    setBodyTextColor(colorSl).
                    setBodyBackgroundColor('rgba(0,0,0,0)').
                    setBodyBorderColor('rgba(0,0,0,0)').
                    setLineLength(100).
                    setLineStyle(1);
                lineSl.setBodyFont(this.toNormalText(lineSl));
                this.drawnSl[displayingId] = lineSl;
            }
            if (order.tp > 0) {
                const lineTp = this.widget.chart().
                    createOrderLine().
                    setText(`${!isMobile ? ('#' + this.getTicket(order)) : ''} tp ${order.tp}`).
                    setPrice(order.tp).
                    setQuantity(null).
                    setEditable(false).
                    setLineColor(colorTp).
                    setBodyTextColor(colorTp).
                    setBodyBackgroundColor('rgba(0,0,0,0)').
                    setBodyBorderColor('rgba(0,0,0,0)').
                    setLineLength(100).
                    setLineStyle(1);
                lineTp.setBodyFont(this.toNormalText(lineTp));
                this.drawnTp[displayingId] = lineTp;
            }
            return line;
        } catch (err) {
            // console.error('__ err', err);
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
                this.newOrder(itemEdited.displaying_id, itemEdited);
                localStorage.removeItem('edited_id');
            }
        }
        const newDataOrders = _ordersList.filter(order => (order.status === VndcFutureOrderType.Status.ACTIVE || order.status === VndcFutureOrderType.Status.PENDING) && !this.oldOrdersList.find(id => order.displaying_id === id));
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
            })
        }
        this.oldOrdersList = this.props?.ordersList.map(order => (order.status === VndcFutureOrderType.Status.ACTIVE || order.status === VndcFutureOrderType.Status.PENDING) && order.displaying_id)
    };

    initWidget = (symbol, interval) => {
        if (!symbol) return;
        const isDark = this.props.theme === "dark";

        const datafeed = new Datafeed(this.props.mode || ChartMode.SPOT)
        const widgetOptions = {
            symbol,
            theme: this.props.theme === "dark" ? "Dark" : "Light",
            datafeed,
            interval: this.props.interval,
            container_id: this.containerId,
            library_path: this.props.libraryPath,
            locale: "en",
            disabled_features: [
                "compare_symbol",
                "display_market_status",
                "go_to_date",
                "volume_force_overlay",
                "header_interval_dialog_button",
                "header_settings",
                "source_selection_markers",
                "header_symbol_search",
                "header_compare",
                "header_undo_redo",
                "symbol_info",
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
            loading_screen: { backgroundColor: this.props.theme === "dark" ? "#00091F" : "#fff", },
            studies_overrides: {
                "volume.volume.color.0": colors.red2,
                "volume.volume.color.1": colors.teal,
                "volume.volume ma.color": colors.red2,
                "volume.volume ma.linewidth": 5,
                "volume.volume ma.visible": true,
            },
            timezone: getTradingViewTimezone(),
            overrides: {
                "scalesProperties.fontSize": 10,

                editorFontsList: ["Barlow", "Sans"],

                "mainSeriesProperties.candleStyle.borderUpColor": colors.teal,
                "mainSeriesProperties.candleStyle.borderDownColor": colors.red2,
                "mainSeriesProperties.candleStyle.wickUpColor": colors.teal,
                "mainSeriesProperties.candleStyle.wickDownColor": colors.red2,
                "mainSeriesProperties.candleStyle.upColor": colors.teal,
                "mainSeriesProperties.candleStyle.downColor": colors.red2,
                "mainSeriesProperties.hollowCandleStyle.borderColor":
                    colors.teal,
                "mainSeriesProperties.hollowCandleStyle.borderDownColor":
                    colors.red2,
                "mainSeriesProperties.priceAxisProperties.autoScale": true,
                volumePaneSize: "small",
            },
            time_frames: [{ text: "1h", resolution: "60", description: "1h" }],
        };
        // eslint-disable-next-line new-cap
        this.widget = new widget(widgetOptions);
        this.widget.onChartReady(() => {

            // Load saved chart
            this.loadSavedChart()
            this.handleActiveTime(60);
            const isDark = this.props.theme === 'dark'
            this.widget.applyOverrides({
                "mainSeriesProperties.priceAxisProperties.autoScale": true,
                "scalesProperties.lineColor": isDark ? "#202C4C" : "#F2F4F6",
                'paneProperties.background': isDark ? colors.darkBlue1 : colors.white,
                "paneProperties.vertGridProperties.color": isDark ? colors.darkBlue2 : colors.grey4,
                "paneProperties.horzGridProperties.color": isDark ? colors.darkBlue2 : colors.grey4,
            });
            this.setState({ chartStatus: ChartStatus.LOADED });
            if (this.props.isVndcFutures) {
                if (this.timer) clearTimeout(this.timer)
                this.timer = setTimeout(() => {
                    this.rawOrders();
                    this.firstTime = false;
                }, 2000);
            }
            if (this?.intervalSaveChart) clearInterval(this.intervalSaveChart);
            this.intervalSaveChart = setInterval(() => this.saveChart(), 5000);
        });
    };

    handleChartType = () => {
        const { chartType } = this.state;
        if (chartType === "price") {
            return this.setState({ chartType: "depth" });
        }
        return this.setState({ chartType: "price" });
    };

    render() {
        const { chartType } = this.state;

        return (
            <>
                <div
                    className="relative flex flex-grow flex-col min-w-max chartWrapper h-full"
                    id="chart-container"
                >
                    <div
                        className={`absolute w-full h-full bg-bgSpotContainer dark:bg-bgSpotContainer-dark flex justify-center items-center ${this.state.chartStatus === ChartStatus.LOADED
                            ? "hidden"
                            : ""
                            }`}
                    >
                        <IconLoading color="#00C8BC" />
                    </div>
                    <div className="w-full border-b border-gray-4 dark:border-darkBlue-3 py-1 px-1 dragHandleArea">
                        {this.state.chartStatus === ChartStatus.LOADED && (
                            <TimeFrame
                                symbol={this.props.symbol}
                                handleActiveTime={this.handleActiveTime}
                                chartType={chartType}
                                widget={this.widget}
                                handleChartType={this.handleChartType}
                                ref={this.timeFrame}
                                handleCreateStudy={this.handleCreateStudy}
                                handleRemoveStudy={this.handleRemoveStudy}
                                handleRemoveAllStudies={
                                    this.handleRemoveAllStudies
                                }
                                handleOpenStudty={this.handleOpenStudty}
                                handleChangeChartType={
                                    this.handleChangeChartType
                                }
                                interval={this.state.interval}
                                studies={this.state.studies}
                                isOnSidebar={this.props.isOnSidebar}
                                t={this.t}
                                initTimeFrame={this.props.initTimeFrame}
                                extendsIndicators={this.props.extendsIndicators}
                                priceChartType={this.state.priceChartType}
                                clearExtendsIndicators={
                                    this.props.clearExtendsIndicators
                                }
                                customChartFullscreen={
                                    this.props.customChartFullscreen
                                }
                                fullScreen={this.props.fullScreen}
                                isVndcFutures={this.props.isVndcFutures}
                            />
                        )}
                    </div>

                    <div
                        id={this.containerId}
                        className={`${styles.TVChartContainer
                            } flex-grow h-full w-full  ${chartType === "depth" && "hidden"
                            }`}
                    />
                    {chartType === "depth" && (
                        <DepthChart
                            symbol={this.props.symbol}
                            chartSize={this.props.chartSize}
                            darkMode={this.props.theme === "dark"}
                        />
                    )}
                    <div className="cheat-watermark">
                        <NamiExchangeSvg
                            color={
                                this.props.theme === "dark"
                                    ? colors.grey4
                                    : colors.darkBlue4
                            }
                        />
                    </div>
                </div>
            </>
        );
    }
}

TVChartContainer.defaultProps = {
    symbol: "BTCUSDT",
    interval: "1",
    containerId: "tv_chart_container",
    datafeedUrl: "https://demo_feed.tradingview.com",
    libraryPath: "/library/trading_view/charting_library/",
    chartsStorageUrl: "https://saveload.tradingview.com",
    chartsStorageApiVersion: "1.1",
    clientId: "tradingview.com",
    userId: "public_user_id",
    fullscreen: false,
    autosize: true,
    time_frames: [{ text: "1h", resolution: "60", description: "1h" }],
    studies_overrides: {
        "volume.volume.color.0": "#03BBCC",
        "volume.volume.color.1": "#ff0065",
        "volume.volume ma.color": "#ff0065",
        "volume.volume ma.linewidth": 5,
        "volume.volume ma.visible": true,
        "bollinger bands.median.color": "#33FF88",
        "bollinger bands.upper.linewidth": 7,
    },
};
