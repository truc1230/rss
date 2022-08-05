import { Popover, Transition } from '@headlessui/react';
import Activity from 'src/components/svg/Activity';
import ChevronDown from 'src/components/svg/ChevronDown';
import find from 'lodash/find';
import * as React from 'react';
import { Component, Fragment } from 'react';
import colors from 'styles/colors';
import locale_vi from './locale_vi';

const ListTimeFrame = [
    { value: '1', text: '1m' },
    { value: '5', text: '5m' },
    { value: '15', text: '15m' },
    { value: '30', text: '30m' },
    { value: '60', text: '1h' },
    { value: '240', text: '4h' },
    { value: '1D', text: '1D' },
    { value: '1W', text: '1W' },
    { value: '1M', text: '1M' },
];

export const BarsChart = (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 28 28"
        width="20"
        height="20"
    >
        <g fill="none" stroke="currentColor" strokeLinecap="square">
            <path d="M10.5 7.5v15M7.5 20.5H10M13.5 11.5H11M19.5 6.5v15M16.5 9.5H19M22.5 16.5H20" />
        </g>
    </svg>
);
export const CandleChart = (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 28 28"
        width="20"
        height="20"
        fill="currentColor"
    >
        <path d="M17 11v6h3v-6h-3zm-.5-1h4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-.5.5h-4a.5.5 0 0 1-.5-.5v-7a.5.5 0 0 1 .5-.5z" />
        <path d="M18 7h1v3.5h-1zm0 10.5h1V21h-1z" />
        <path d="M9 8v12h3V8H9zm-.5-1h4a.5.5 0 0 1 .5.5v13a.5.5 0 0 1-.5.5h-4a.5.5 0 0 1-.5-.5v-13a.5.5 0 0 1 .5-.5z" />
        <path d="M10 4h1v3.5h-1zm0 16.5h1V24h-1z" />
    </svg>
);

export const CandleChartOnus = (
    <svg width="14" height="22" viewBox="0 0 14 22" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M11.457 21L11.457 3.5" stroke="#8492A7" stroke-width="1.02225" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M2.54297 21L2.54297 0.999999" stroke="#8492A7" stroke-width="1.02225" stroke-linecap="round" stroke-linejoin="round" />
        <rect x="0.511127" y="4.5121" width="4.06892" height="12.9777" rx="0.76669" fill="#1B222D" stroke="#8492A7" stroke-width="1.02225" />
        <rect x="9.42128" y="8.51308" width="4.06892" height="8.97775" rx="0.76669" fill="#1B222D" stroke="#8492A7" stroke-width="1.02225" />
    </svg>

);

export const AreaChart = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="20" height="20" fill="currentColor"><path d="M12.5 17.207L18.707 11h2l3.647-3.646-.708-.708L20.293 10h-2L12.5 15.793l-3-3-4.854 4.853.708.708L9.5 14.207z" /><path d="M9 16h1v1H9zm1 1h1v1h-1zm-1 1h1v1H9zm2 0h1v1h-1zm-1 1h1v1h-1zm-1 1h1v1H9zm2 0h1v1h-1zm-3-3h1v1H8zm-1 1h1v1H7zm-1 1h1v1H6zm2 0h1v1H8zm-1 1h1v1H7zm-2 0h1v1H5zm17-9h1v1h-1zm1-1h1v1h-1zm0 2h1v1h-1zm-1 1h1v1h-1zm-1 1h1v1h-1zm2 0h1v1h-1zm-1 1h1v1h-1zm-1 1h1v1h-1zm2 0h1v1h-1zm-1 1h1v1h-1zm-1 1h1v1h-1zm2 0h1v1h-1zm-1 1h1v1h-1zm-1 1h1v1h-1zm2 0h1v1h-1zm-5-7h1v1h-1zm2 0h1v1h-1zm1-1h1v1h-1zm-2 2h1v1h-1zm-1 1h1v1h-1zm2 0h1v1h-1zm-1 1h1v1h-1zm-1 1h1v1h-1zm2 0h1v1h-1zm-1 1h1v1h-1zm-1 1h1v1h-1zm2 0h1v1h-1zm-1 1h1v1h-1zm-2-6h1v1h-1zm-1 1h1v1h-1zm-1 1h1v1h-1zm2 0h1v1h-1zm-1 1h1v1h-1zm-1 1h1v1h-1zm2 0h1v1h-1zm-1 1h1v1h-1zm-1 1h1v1h-1zm2 0h1v1h-1zm-3-3h1v1h-1zm-1 1h1v1h-1zm-1 1h1v1h-1zm2 0h1v1h-1zm-1 1h1v1h-1z" /></svg>
);
export const LineChart = (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 28 28"
        width="20"
        height="20"
    >
        <path
            fill="currentColor"
            d="M11.982 16.689L17.192 12h3.033l4.149-4.668-.748-.664L19.776 11h-2.968l-4.79 4.311L9 12.293l-4.354 4.353.708.708L9 13.707z"
        />
    </svg>
);
export const BaseLineChart = (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 28 28"
        width="20"
        height="20"
    >
        <g fill="none" stroke="currentColor">
            <path strokeDasharray="1,1" d="M4 14.5h22" />
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7.5 12.5l2-4 1 2 2-4 3 6"
            />
            <path strokeLinecap="round" d="M5.5 16.5l-1 2" />
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.5 16.5l2 4 2-4m2-4l1-2-1 2z"
            />
        </g>
    </svg>
);

const DefaultChartType = { type: 'Candle', value: 1, icon: CandleChart };
const ListChartType = [
    { type: 'Bar', value: 0, icon: BarsChart },
    { type: 'Candle', value: 1, icon: CandleChart },
    { type: 'Line', value: 2, icon: LineChart },
    { type: 'Area', value: 3, icon: AreaChart },
    { type: 'Base Line', value: 10, icon: BaseLineChart },
];

export default class TimeFrame extends Component {
    state = {
        selectedTime: '60',
        activeStudiesMap: new Map(),
        search: '',
        openPopover: false,
    };

    constructor(props) {
        super(props);
        this.indicatorBtn = React.createRef();
        this.t = props.t;
    }

    componentDidMount() {
        this.syncStudies();
        const { initTimeFrame } = this.props;

        this.updateTimeFrame(initTimeFrame);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const {
            initTimeFrame,
        } = this.props;
        if (initTimeFrame && initTimeFrame !== prevProps.initTimeFrame) {
            this.updateTimeFrame(this.props.initTimeFrame);
        }
        if(prevProps?.symbol!==this.props.symbol){
            this.setState({ selectedTime: '60' });
        }
    }

    updateTimeFrame = (initTimeFrame) => {
        const { chartType, handleActiveTime } = this.props;

        if (chartType === 'price') {
            if (handleActiveTime && typeof handleActiveTime === 'function') {
                if (initTimeFrame.length > 0) {
                    let initTime = '60';
                    switch (initTimeFrame) {
                        case '1h': {
                            initTime = '60';
                            break;
                        }
                        case '4h': {
                            initTime = '240';
                            break;
                        }
                        case '1d': {
                            initTime = '1D';
                            break;
                        }
                        case '1w': {
                            initTime = '1W';
                            break;
                        }
                        default:
                            break;
                    }
                    this.setState({ selectedTime: initTime });
                    handleActiveTime(initTime);
                }
            }
        }
    };

    setActiveTime = (value) => {
        const { chartType, handleActiveTime } = this.props;

        if (chartType === 'price') {
            if (handleActiveTime && typeof handleActiveTime === 'function') {
                this.setState({ selectedTime: value });
                handleActiveTime(value);
            }
        }
    };

    setOpen = (open) => {
        this.setState({ openPopover: open });
    };

    toggleFastStudy = (studyId) => {
        const { handleCreateStudy, handleRemoveStudy } = this.props;
        const haveStudy = this.state.activeStudiesMap.get(studyId);
        if (haveStudy) {
            if (handleRemoveStudy && typeof handleRemoveStudy === 'function') {
                handleRemoveStudy(haveStudy);
            }
        } else {
            if (handleCreateStudy && typeof handleCreateStudy === 'function') {
                handleCreateStudy(studyId);
            }
        }
    };

    syncStudies = (studyId = '', id = '') => {
        if (studyId && id) {
            this.setState((prevState) => ({
                activeStudiesMap: prevState.activeStudiesMap.set(studyId, id),
            }));
        } else {
            const { widget } = this.props;
            this.setState({ activeStudiesMap: new Map() });
            const currentStudies = widget.activeChart().getAllStudies();
            currentStudies.forEach((e) => {
                this.setState((prevState) => ({
                    activeStudiesMap: prevState.activeStudiesMap.set(
                        e.name,
                        e.id,
                    ),
                }));
            });
        }
    };

    checkAcronym = (str = '', stringSearch = '') => {
        if (!stringSearch) return true;
        if (str) {
            const matches = str.match(/\b(\w)/g);
            if (
                matches
                    .join('')
                    .toLowerCase()
                    .includes(stringSearch.toLowerCase()) ||
                str.toLowerCase().includes(stringSearch.toLowerCase())
            ) {
                return true;
            }
        }
        return false;
    };

    findTimeFrame = (value) => {
        return find(ListTimeFrame, (e) => e.value === value) || {};
    };

    createStudy = (studyId) => {
        const { handleCreateStudy } = this.props;
        if (handleCreateStudy && typeof handleCreateStudy === 'function') {
            handleCreateStudy(studyId);
        }
    };

    _renderCommonTimeframes() {
        const CommonTimeframes = [
            { value: '15', text: '15m' },
            { value: '60', text: '1h' },
            { value: '240', text: '4h' },
            { value: '1D', text: '1D' },
            { value: '1W', text: '1W' },
        ];

        const { selectedTime } = this.state;
        const { priceChartType } = this.props;

        const selectedPriceChartType = find(ListChartType, (e) => e.value === priceChartType) || DefaultChartType;

        const selectedTimeframeData = this.findTimeFrame(selectedTime);
        const isCommonTimeframe = find(
            CommonTimeframes,
            (e) => e.value === selectedTimeframeData?.value,
        );
        return (
            <div className="flex items-center">
                {CommonTimeframes.map((item) => {
                    const { value, text } = item;
                    const isActive = value == selectedTime;
                    return (
                        <span
                            key={value}
                            onClick={() => this.setActiveTime(value)}
                            className={`cursor-pointer text-xs font-medium h-5 px-2 mr-1 rounded-md hover:text-teal ${
                                isActive
                                    ? 'bg-teal bg-opacity-10 text-teal'
                                    : 'text-txtSecondary'
                            }`}
                        >
                            {text}
                        </span>
                    );
                })}
                <Popover className="relative">
                    {({ open }) => (
                        <>
                            <Popover.Button
                                className={`h-full flex items-center ${
                                    open ? '' : 'text-opacity-90'
                                } text-white group px-2`}
                            >
                                {!isCommonTimeframe && (
                                    <span className="cursor-pointer text-xs font-medium h-5 mr-1 text-teal">
                                        {selectedTimeframeData.text}
                                    </span>
                                )}
                                <ChevronDown
                                    className={`${
                                        open ? '' : 'text-opacity-70'
                                    } group-hover:text-opacity-80 transition ease-in-out duration-150`}
                                    aria-hidden="true"
                                />
                            </Popover.Button>
                            <Transition
                                as={Fragment}
                                enter="transition ease-out duration-200"
                                enterFrom="opacity-0 translate-y-1"
                                enterTo="opacity-100 translate-y-0"
                                leave="transition ease-in duration-150"
                                leaveFrom="opacity-100 translate-y-0"
                                leaveTo="opacity-0 translate-y-1"
                            >
                                <Popover.Panel className="absolute z-10">
                                    <div className="overflow-hidden rounded-lg shadow-lg bg-white dark:bg-darkBlue-3 p-5">
                                        <div className="text-txtPrimary dark:text-txtPrimary-dark font-medium text-xs mb-4">
                                            Select intervals
                                        </div>
                                        <div className="w-64 relative grid grid-cols-4 gap-2">
                                            {ListTimeFrame.map(
                                                (item, index) => {
                                                    const { value, text } = item;
                                                    const isActive = value === selectedTime;
                                                    return (
                                                        <div
                                                            onClick={() => this.setActiveTime(
                                                                value,
                                                            )}
                                                            key={index}
                                                            className={`cursor-pointer w-full h-5 border font-medium text-xs text-center rounded-sm hover:text-teal hover:border-teal-50 ${
                                                                isActive
                                                                    ? 'border-teal text-teal dark:border-teal dark:text-teal'
                                                                    : 'border-gray-5  text-txtSecondary dark:text-txtSecondary-dark dark:border-darkBlue-5'
                                                            }`}
                                                        >
                                                            {text}
                                                        </div>
                                                    );
                                                },
                                            )}
                                        </div>
                                    </div>
                                </Popover.Panel>
                            </Transition>
                        </>
                    )}
                </Popover>

                <Popover className="relative">
                    {({ open }) => (
                        <>
                            <Popover.Button
                                className={`h-full flex items-center ${
                                    open ? '' : 'text-opacity-90'
                                } text-white group px-2`}
                            >
                                <span className="text-txtSecondary dark:text-txtSecondary-dark">
                                    {selectedPriceChartType.icon}
                                </span>
                            </Popover.Button>
                            <Transition
                                as={Fragment}
                                enter="transition ease-out duration-200"
                                enterFrom="opacity-0 translate-y-1"
                                enterTo="opacity-100 translate-y-0"
                                leave="transition ease-in duration-150"
                                leaveFrom="opacity-100 translate-y-0"
                                leaveTo="opacity-0 translate-y-1"
                            >
                                <Popover.Panel className="absolute z-10">
                                    <div className="overflow-hidden rounded-lg shadow-lg bg-white dark:bg-darkBlue-3">
                                        <div className="w-32 relative">
                                            {ListChartType.map(
                                                (item, index) => {
                                                    const {
                                                        type,
                                                        value,
                                                        icon,
                                                    } = item;

                                                    const isActive = selectedPriceChartType.value === value;
                                                    return (
                                                        <div
                                                            onClick={() => this.props.handleChangeChartType(value)}
                                                            key={index}
                                                            className={
                                                                `h-8 px-2 flex content-start items-center cursor-pointer w-full font-medium text-xs text-center rounded-sm
                                                                text-txtSecondary dark:text-txtSecondary-dark
                                                                hover:text-teal
                                                                dark:hover:text-teal
                                                                ${isActive ? 'bg-opacity-10 dark:bg-opacity-10 bg-teal text-teal dark:bg-teal dark:text-teal' : ''}
                                                                `
                                                            }
                                                        >
                                                            {icon}
                                                            <span className="ml-2">{type}</span>
                                                        </div>
                                                    );
                                                },
                                            )}
                                        </div>
                                    </div>
                                </Popover.Panel>
                            </Transition>
                        </>
                    )}
                </Popover>

                <Activity
                    className="mx-2 cursor-pointer"
                    color={colors.darkBlue5}
                    size={20}
                    onClick={() => this.props.handleOpenStudty()}
                />
            </div>
        );
    }

    _renderChartMode() {
        const {
            chartType,
            handleChartType,
            widget,
            isOnSidebar,
            customChartFullscreen,
            fullScreen,
        } = this.props;
        const itemClass = 'cursor-pointer text-xs font-medium h-5 px-2 mr-1   rounded-md';
        const activeClass = 'bg-teal bg-opacity-10 text-teal';
        const inactiveClass = 'text-txtSecondary dark:text-txtSecondary-dark';
        return (
            <div className="flex items-center">
                {/* <span className={`${itemClass} ${activeClass}`}>Original</span> */}
                <span onClick={chartType !== 'price' ? handleChartType : null} className={`${itemClass} ${chartType === 'price' ? activeClass : inactiveClass}`}>{this.t('common:price')}</span>
                {!this.props.isVndcFutures && <span onClick={chartType === 'price' ? handleChartType : null} className={`${itemClass} ${chartType === 'depth' ? activeClass : inactiveClass}`}>{this.t('common:depth')}</span>}
                {/* <button
                    type="button"
                    onClick={customChartFullscreen}
                    className="px-1"
                >
                    {fullScreen ? (
                        <IconFullScreenChartDisable />
                    ) : (
                        <IconFullScreenChart />
                    )}
                </button> */}
            </div>
        );
    }

    render() {
        const {
            chartType,
            handleChartType,
            widget,
            isOnSidebar,
            customChartFullscreen,
            fullScreen,
        } = this.props;

        const { selectedTime } = this.state;
        // const studiesList = widget?.getStudiesList() || [];
        // const language = 'en';
        // const indicators = studiesList.map((e) => ({
        //     id: e,
        //     label: language === 'vi' ? locale_vi[`${e}_study`] || e : e,
        // }));

        return (
            <div className="flex items-center justify-between w-full bg-bgSpotContainer dark:bg-bgSpotContainer-dark">
                {this._renderCommonTimeframes()}
                {this._renderChartMode()}
            </div>
        );
    }
}
