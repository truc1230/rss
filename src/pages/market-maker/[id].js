import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Menu, Transition } from '@headlessui/react';
import { IconArrowDownSlim } from 'components/common/Icons';
import { endOfDay, getUnixTime, startOfDay, startOfMonth, startOfWeek, startOfYesterday, } from 'date-fns';
import _ from 'lodash';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { Fragment, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useAsync } from 'react-use';
import LayoutWithHeader from 'src/components/common/layouts/layoutWithHeader';
import { ApiStatus, ExchangeOrderEnum } from 'src/redux/actions/const';
import { formatWallet, getSymbolString } from 'src/redux/actions/utils';
import fetchAPI from 'utils/fetch-api';
import showNotification from 'utils/notificationService';

/*eslint-disable */

// TODO them offset
// TODO them thong tin tai khoan
// TODO them offset

const SelectTimeButton = ({ onTimeChange, timeOptions, selectedTime }) => {
    // const [selectedTime, setSelectedTime] = useState('Last 7 days');

    const handleClickTime = (time) => {
        // setSelectedTime(time);
        onTimeChange(time);
    };

    return (
        <Menu as="div" className="relative inline-block text-left">
            <div>
                <Menu.Button className="flex items-center text-black-500 text-sm py-2 px-3">
                    <span className="mr-3">{selectedTime}</span>
                    <IconArrowDownSlim />
                </Menu.Button>
            </div>
            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <Menu.Items className="absolute right-0 w-40 mt-2 origin-top-right bg-white divide-y divide-black-100 rounded-md shadow-lg border border-black-200 z-10">
                    {timeOptions.map((option, index) => (
                        <Menu.Item key={index}>
                            {({ active }) => (
                                <button
                                    type="button"
                                    className={`${
                                        active
                                            ? "bg-violet-500 text-white"
                                            : "text-gray-900"
                                    } group flex rounded-md items-center w-full px-3 py-2 text-sm`}
                                    onClick={() => handleClickTime(option)}
                                >
                                    {option}
                                </button>
                            )}
                        </Menu.Item>
                    ))}
                </Menu.Items>
            </Transition>
        </Menu>
    );
};

const MarketMaker = ({ token }) => {
    const router = useRouter();
    const timeOptions = ["Today", "Yesterday", "This week", "This month", "Previous month"];
    const { id } = router.query;
    // Check pattern
    let symbolFromUrl = null;
    if (typeof id === "string" && id.length) {
        const [base, quote] = id.split("-");
        if (base && quote) {
            symbolFromUrl = { base, quote };
        }
    }
    const [selectedTime, setSelectedTime] = useState(timeOptions[0]);
    const [symbol, setSymbol] = useState(symbolFromUrl);
    const [detail, setDetail] = useState(null);
    const [message, setMessage] = useState("");
    const [bids, setBids] = useState([]);
    const [asks, setAsks] = useState([]);
    const [configLoading, setConfigLoading] = useState(true);
    const [initAsset, setInitAsset] = useState(null);

    const [orderBookConfig, setOrderBookConfig] = useState({
        bestAsk: 0,
        bestBid: 0,
        depthMinus2Perc: 0,
        depthPlus2Perc: 0,
        totalAsks: 0,
        totalBids: 0,
        additionVolume: 0,
        totalBuyPerDay: 0,
        totalSellPerDay: 0,
        refreshRate: 5,
    });
    const [timeRange, setTimeRange] = useState({
        startDate: startOfDay(new Date()),
        endDate: endOfDay(new Date()),
        key: "selection",
    });

    const handleChangeTime = (time) => {
        setSelectedTime(time);
        switch (time) {
            // Today
            case timeOptions[0]: {
                return setTimeRange({
                    startDate: startOfDay(new Date()),
                    endDate: endOfDay(new Date()),
                    key: "selection",
                });
            }
            case timeOptions[1]: {
                return setTimeRange({
                    startDate: startOfYesterday(new Date()),
                    endDate: startOfDay(new Date()),
                    key: "selection",
                });
            }
            case timeOptions[2]: {
                return setTimeRange({
                    startDate: startOfWeek(new Date()),
                    endDate: endOfDay(new Date()),
                    key: "selection",
                });
            }
            case timeOptions[3]: {
                return setTimeRange({
                    startDate: startOfMonth(new Date()),
                    endDate: endOfDay(new Date()),
                    key: "selection",
                });
            }
            case timeOptions[4]: {
                // set date

                const m = new Date();
                m.setDate(1);

                return setTimeRange({
                    startDate: startOfMonth(
                        new Date(m.getTime() - 24 * 60 * 60 * 1000)
                    ),
                    endDate: startOfMonth(m),
                    key: "selection",
                });
            }
            default:
                break;
        }
    };

    const user = useSelector((state) => state.auth.user) || null;

    useEffect(() => {
        if (
            symbolFromUrl?.quote !== symbol?.quote ||
            symbolFromUrl?.base !== symbol?.base
        ) {
            setSymbol(symbolFromUrl);
        }
    }, [symbolFromUrl]);

    const postMarketMakerConfig = async (e) => {
        setConfigLoading(true);
        e.preventDefault();
        try {
            const opts = {
                url: "/api/v3/market_maker/config",
                options: {
                    method: "POST",
                },
                params: {
                    ...orderBookConfig,
                    symbol: symbolString,
                },
            };

            const res = await fetchAPI(opts);
            const { status, data } = res;

            if (status === ApiStatus.SUCCESS) {
                setOrderBookConfig(data.orderBookConfig);
                setMessage("Update successfully");
                getOrderBook(symbolString);
            } else {
                setMessage("Update failed");
            }
        } catch (e) {
            console.error("== fetchRegisterStatus ", e);
        } finally {
            setConfigLoading(false);
        }
    };

    const closeOrder = async (displayingId, symbol) => {
        try {
            const opts = {
                url: "/api/v3/market_maker/close",
                options: {
                    method: "POST",
                },
                params: {
                    displayingId,
                    symbol,
                },
            };

            const res = await fetchAPI(opts);
            const { status, data } = res;

            if (status === ApiStatus.SUCCESS) {
                showNotification({
                    message: `Close order #${displayingId} successfully`,
                    title: "Success",
                    type: "success",
                });
            } else {
                showNotification({
                    message: `Close order #${displayingId} failed`,
                    title: "Failed",
                    type: "error",
                });
            }
        } catch (e) {
            console.error("== fetchRegisterStatus ", e);
        } finally {
        }
    };

    const getOrderBook = async (symbol = null) => {
        try {
            const opts = {
                url: "/api/v3/market_maker/order_book",
                options: {
                    method: "GET",
                },
            };
            if (symbol) {
                opts.params = {
                    symbol,
                };
            }
            const res = await fetchAPI(opts);
            const { status, data } = res;
            if (status === ApiStatus.SUCCESS) {
                let bids = _.filter(data, { side: ExchangeOrderEnum.Side.BUY });
                let asks = _.filter(data, {
                    side: ExchangeOrderEnum.Side.SELL,
                });

                bids = _.sortBy(bids, [
                    function (o) {
                        return -o.price;
                    },
                ]);
                asks = _.sortBy(asks, [
                    function (o) {
                        return o.price;
                    },
                ]);
                setBids(bids);
                setAsks(asks);
                return data;
            }
        } catch (e) {
            return null;
        }
    };

    const getConfig = async (symbol = null) => {
        try {
            const opts = {
                url: "/api/v3/market_maker/config",
                options: {
                    method: "GET",
                },
            };
            if (symbol) {
                opts.params = {
                    symbol,
                };
            }
            const res = await fetchAPI(opts);
            const { status, data } = res;
            if (status === ApiStatus.SUCCESS) {
                if (data?.orderBookConfig) {
                    setOrderBookConfig(data.orderBookConfig);
                    setInitAsset(data.initAsset);
                    setConfigLoading(false);
                }
            }
        } catch (e) {
            return null;
        }
    };

    const getAccountInformation = async (symbol = null) => {
        try {
            const opts = {
                url: "/api/v3/market_maker/detail",
                options: {
                    method: "GET",
                },
            };
            if (symbol) {
                opts.params = {
                    symbol,
                    from: getUnixTime(timeRange.startDate) * 1000,
                    to: getUnixTime(timeRange.endDate) * 1000,
                };
            }
            const res = await fetchAPI(opts);
            const { status, data } = res;
            if (status === ApiStatus.SUCCESS) {
                setDetail(data);
            }
        } catch (e) {
            return null;
        }
    };

    const symbolString = getSymbolString(symbol);

    useAsync(async () => {
        if (symbol) {
            await getOrderBook(symbolString);
        }
    }, [symbol]);
    useAsync(async () => {
        if (symbol) {
            await getConfig(symbolString);
        }
    }, [symbol]);

    useAsync(async () => {
        if (symbol) {
            await getAccountInformation(symbolString);
        }
    }, [symbol, timeRange]);

    if (!symbol) return null;

    /* This example requires Tailwind CSS v2.0+ */

    const OrderBook = (side) => {
        const orders = side === "buy" ? bids : asks;
        return (
            <div className="w-full h-[1000px] border rounded overflow-scroll">
                <table className="divide-y divide-gray-200 w-full">
                    <tbody className="bg-white divide-y divide-gray-200">
                        {orders.map((o, index) => {
                            let textColor =
                                side === "buy" ? "text-green" : "text-red";
                            textColor = o.isMM ? textColor : "opacity-70";
                            return (
                                <tr key={index}>
                                    <td
                                        className={`text-right ${textColor} text-xs`}
                                    >
                                        {o.price}
                                    </td>
                                    <td
                                        className={`text-right ${textColor} text-xs`}
                                    >
                                        {o.quantity - o.executedQty}
                                    </td>
                                    <td
                                        className={`text-right ${textColor} text-xs px-2`}
                                    >
                                        {/*{(o.price * o.quantity).toFixed(0)}*/}

                                        {o.isMM ? (
                                            <FontAwesomeIcon
                                                onClick={() =>
                                                    closeOrder(
                                                        o.displayingId,
                                                        o.symbol
                                                    )
                                                }
                                                className="cursor-pointer ml-2"
                                                icon={faTrashAlt}
                                                size="sm"
                                                color="black"
                                            />
                                        ) : (
                                            <span className="ml-3">-</span>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        );
    };

    const BidConfig = () => {
        return (
            <>
                <div className="form-section mb-4">
                    <div className="form-group">
                        <label className="block text-sm font-medium text-gray-700">
                            Best bid
                        </label>
                        <input
                            value={orderBookConfig?.bestBid}
                            onChange={(e) => {
                                setOrderBookConfig({
                                    ...orderBookConfig,
                                    bestBid: +e.target.value,
                                });
                            }}
                            className="form-control text-right"
                        />
                    </div>
                </div>
            </>
        );
    };
    const AskConfig = () => {
        return (
            <>
                <div className="form-section mb-4">
                    <div className="form-group">
                        <label className="block text-sm font-medium text-gray-700">
                            Best ask
                        </label>
                        <input
                            value={orderBookConfig?.bestAsk}
                            onChange={(e) => {
                                setOrderBookConfig({
                                    ...orderBookConfig,
                                    bestAsk: +e.target.value,
                                });
                            }}
                            className="form-control text-right"
                        />
                    </div>
                </div>
            </>
        );
    };

    const baseChanged =
        (detail?.baseWallet?.value || 0) - (initAsset?.base || 0);
    const quoteChanged =
        (detail?.quoteWallet?.value || 0) - (initAsset?.quote || 0);
    let avgPrice = 0;
    if (baseChanged !== 0) {
        avgPrice = quoteChanged / baseChanged;
    }
    return (
        <>
            <LayoutWithHeader showBanner>
                <div className="container mx-auto my-8">
                    <p className="text-4xl text-black font-bold mt-10 mb-8">
                        Market Maker
                    </p>
                    <div className="grid lg:grid-cols-2 sm:grid-cols-1 gap-4 mb-4">
                        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                            <div className="px-4 py-5 sm:px-6">
                                <h3 className="text-lg leading-6 font-medium text-gray-900">
                                    Asset Information
                                </h3>
                                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                                    Personal details and application.
                                </p>
                            </div>
                            <div className="border-t border-gray-200">
                                <dl>
                                    <div className="bg-gray-50 px-4 py-4 grid lg:grid-cols-3 md:grid-cols-1 gap-4 px-6">
                                        <dt className=" text-sm font-medium text-gray-500">
                                            Init
                                        </dt>
                                        <dd className=" mt-1 text-sm text-gray-900 text-right">
                                            {formatWallet(
                                                initAsset?.base || 0,
                                                0,
                                                true
                                            )}{" "}
                                            {detail?.baseAsset}
                                        </dd>
                                        <dd className=" mt-1 text-sm text-gray-900 text-right">
                                            {formatWallet(
                                                initAsset?.quote || 0,
                                                0,
                                                true
                                            )}{" "}
                                            {detail?.quoteAsset}
                                        </dd>
                                    </div>
                                    <div className="bg-gray-50 px-4 py-4 grid lg:grid-cols-3 md:grid-cols-1 gap-4 px-6">
                                        <dt className=" text-sm font-medium text-gray-500">
                                            Balance
                                        </dt>
                                        <dd className=" mt-1 text-sm text-gray-900 text-right">
                                            {formatWallet(
                                                detail?.baseWallet?.value || 0,
                                                0,
                                                true
                                            )}{" "}
                                            {detail?.baseAsset}
                                        </dd>
                                        <dd className=" mt-1 text-sm text-gray-900 text-right">
                                            {formatWallet(
                                                detail?.quoteWallet?.value || 0,
                                                0,
                                                true
                                            )}{" "}
                                            {detail?.quoteAsset}
                                        </dd>
                                    </div>
                                    <div className="bg-white px-4 py-4 grid lg:grid-cols-3 md:grid-cols-1 gap-4 px-6">
                                        <dt className=" text-sm font-medium text-gray-500">
                                            In Order
                                        </dt>
                                        <dd className=" mt-1 text-sm text-gray-900 text-right">
                                            {formatWallet(
                                                detail?.baseWallet
                                                    ?.lockedValue || 0,
                                                0,
                                                true
                                            )}{" "}
                                            {detail?.baseAsset}
                                        </dd>
                                        <dd className=" mt-1 text-sm text-gray-900 text-right">
                                            {formatWallet(
                                                detail?.quoteWallet
                                                    ?.lockedValue || 0,
                                                0,
                                                true
                                            )}{" "}
                                            {detail?.quoteAsset}
                                        </dd>
                                    </div>
                                    <div className="bg-gray-50 px-4 py-4 grid lg:grid-cols-3 md:grid-cols-1 gap-4 px-6">
                                        <dt className=" text-sm font-medium text-gray-500">
                                            Changed <br />
                                            <span className="text-xs font-normal">
                                                Avg price:{" "}
                                                {formatWallet(
                                                    avgPrice,
                                                    2,
                                                    true
                                                )}
                                            </span>
                                        </dt>
                                        <dd className=" mt-1 text-sm text-gray-900 text-right">
                                            {formatWallet(
                                                (detail?.baseWallet?.value ||
                                                    0) - (initAsset?.base || 0),
                                                0,
                                                true
                                            )}{" "}
                                            {detail?.baseAsset}
                                        </dd>
                                        <dd className=" mt-1 text-sm text-gray-900 text-right">
                                            {formatWallet(
                                                (detail?.quoteWallet?.value ||
                                                    0) -
                                                    (initAsset?.quote || 0),
                                                0,
                                                true
                                            )}{" "}
                                            {detail?.quoteAsset}
                                        </dd>
                                    </div>
                                </dl>
                            </div>
                        </div>
                        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                            <div className="px-4 py-5 sm:px-6">
                                <div className="flex justify-between">
                                    <div>
                                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                                            24h Transaction History
                                        </h3>
                                        <p className="mt-1 max-w-2xl text-sm text-gray-500">
                                            Personal details and application.
                                        </p>
                                    </div>
                                    <div className="panel-header-actions">
                                        <SelectTimeButton
                                            onTimeChange={handleChangeTime}
                                            timeOptions={timeOptions}
                                            selectedTime={selectedTime}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="border-t border-gray-200">
                                <dl>
                                    <div className="bg-gray-50 px-4 py-4 grid lg:grid-cols-3 md:grid-cols-1 gap-4 px-6">
                                        <dt className=" text-sm font-medium text-gray-500">
                                            Count
                                        </dt>
                                        <dd className=" mt-1 text-sm text-red text-right">
                                            {detail?.sell24hCount} sell
                                        </dd>
                                        <dd className=" mt-1 text-sm text-green text-right">
                                            {detail?.buy24hCount} buy
                                        </dd>
                                    </div>
                                    <div className="bg-white px-4 py-4 grid lg:grid-cols-3 md:grid-cols-1 gap-4 px-6">
                                        <dt className=" text-sm font-medium text-gray-500">
                                            Base Asset
                                        </dt>
                                        <dd className=" mt-1 text-sm text-red text-right">
                                            {formatWallet(
                                                detail?.sell24hBaseVolume,
                                                0
                                            )}{" "}
                                            {detail?.baseAsset}
                                        </dd>
                                        <dd className=" mt-1 text-sm text-green text-right">
                                            {formatWallet(
                                                detail?.buy24hBaseVolume,
                                                0
                                            )}{" "}
                                            {detail?.baseAsset}
                                        </dd>
                                    </div>
                                    <div className="bg-gray-50 px-4 py-4 grid lg:grid-cols-3 md:grid-cols-1 gap-4 px-6">
                                        <dt className=" text-sm font-medium text-gray-500">
                                            Quote Asset
                                        </dt>
                                        <dd className=" mt-1 text-sm text-red text-right">
                                            {formatWallet(
                                                detail?.sell24hQuoteVolume,
                                                0
                                            )}{" "}
                                            {detail?.quoteAsset}
                                        </dd>
                                        <dd className=" mt-1 text-sm text-green text-right">
                                            {formatWallet(
                                                detail?.buy24hQuoteVolume,
                                                0
                                            )}{" "}
                                            {detail?.quoteAsset}
                                        </dd>
                                    </div>
                                    <div className="bg-white px-4 py-4 grid lg:grid-cols-3 md:grid-cols-1 gap-4 px-6">
                                        <dt className=" text-sm font-medium text-gray-500">
                                            Avg Price
                                        </dt>
                                        <dd className=" mt-1 text-sm text-red text-right">
                                            {formatWallet(
                                                detail?.sell24hBaseVolume > 0
                                                    ? detail?.sell24hQuoteVolume /
                                                          detail?.sell24hBaseVolume
                                                    : 0
                                            )}{" "}
                                            {detail?.quoteAsset}
                                        </dd>
                                        <dd className=" mt-1 text-sm text-green text-right">
                                            {formatWallet(
                                                detail?.buy24hBaseVolume > 0
                                                    ? detail?.buy24hQuoteVolume /
                                                          detail?.buy24hBaseVolume
                                                    : 0
                                            )}{" "}
                                            {detail?.quoteAsset}
                                        </dd>
                                    </div>
                                </dl>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2  gap-4 h-screen w-full ">
                        <div className="col-span-1 sm:px-2 bg-white shadow sm:rounded-lg">
                            <div className="px-4 py-5 sm:px-6">
                                <h3 className="text-lg leading-6 font-medium text-gray-900">
                                    Order Book
                                </h3>
                                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                                    Personal details and application.
                                </p>
                                <hr className="mt-4" />
                            </div>
                            <div className="grid grid-cols-2 gap-4 px-4 sm:px-6">
                                <div className="col-span-1">
                                    {OrderBook("buy")}
                                </div>
                                <div className="col-span-1">
                                    {OrderBook("sell")}
                                </div>
                            </div>
                        </div>
                        <div className="col-span-1 sm:px-2 bg-white shadow sm:rounded-lg">
                            <div className="px-4 py-5 sm:px-6">
                                <h3 className="text-lg leading-6 font-medium text-gray-900">
                                    Market Maker Config
                                </h3>
                                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                                    Personal details and application.
                                </p>
                                <hr className="mt-4" />
                            </div>
                            <form className="grid grid-cols-2 gap-4 px-4 py-5 sm:px-6">
                                <div className="col-span-1">
                                    {BidConfig()}

                                    <div className="form-section mb-4">
                                        <div className="form-group">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Total bid depth
                                            </label>
                                            <input
                                                value={
                                                    orderBookConfig?.totalBids
                                                }
                                                onChange={(e) => {
                                                    setOrderBookConfig({
                                                        ...orderBookConfig,
                                                        totalBids:
                                                            +e.target.value,
                                                    });
                                                }}
                                                className="form-control text-right"
                                            />
                                        </div>
                                    </div>
                                    <div className="form-section mb-4">
                                        <div className="form-group">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Total bid depth 2%
                                            </label>
                                            <input
                                                value={
                                                    orderBookConfig?.depthMinus2Perc
                                                }
                                                onChange={(e) => {
                                                    setOrderBookConfig({
                                                        ...orderBookConfig,
                                                        depthMinus2Perc:
                                                            +e.target.value,
                                                    });
                                                }}
                                                className="form-control text-right"
                                            />
                                        </div>
                                    </div>
                                    <div className="form-section mb-4">
                                        <div className="form-group">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Max buy per day
                                            </label>
                                            <input
                                                value={
                                                    orderBookConfig?.totalBuyPerDay
                                                }
                                                onChange={(e) => {
                                                    setOrderBookConfig({
                                                        ...orderBookConfig,
                                                        totalBuyPerDay:
                                                            +e.target.value,
                                                    });
                                                }}
                                                type="number"
                                                className="form-control text-right"
                                            />
                                        </div>
                                    </div>
                                    <div className="form-section mb-4">
                                        <div className="form-group">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Refresh rate (min)
                                            </label>
                                            <input
                                                value={
                                                    orderBookConfig?.refreshRate
                                                }
                                                onChange={(e) => {
                                                    setOrderBookConfig({
                                                        ...orderBookConfig,
                                                        refreshRate:
                                                            +e.target.value,
                                                    });
                                                }}
                                                type="number"
                                                className="form-control text-right"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-span-1">
                                    {AskConfig()}
                                    <div className="form-section mb-4">
                                        <div className="form-group">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Total ask depth
                                            </label>
                                            <input
                                                value={
                                                    orderBookConfig?.totalAsks
                                                }
                                                onChange={(e) => {
                                                    setOrderBookConfig({
                                                        ...orderBookConfig,
                                                        totalAsks:
                                                            +e.target.value,
                                                    });
                                                }}
                                                className="form-control text-right"
                                            />
                                        </div>
                                    </div>
                                    <div className="form-section mb-4">
                                        <div className="form-group">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Total ask depth 2%
                                            </label>
                                            <input
                                                value={
                                                    orderBookConfig?.depthPlus2Perc
                                                }
                                                onChange={(e) => {
                                                    setOrderBookConfig({
                                                        ...orderBookConfig,
                                                        depthPlus2Perc:
                                                            +e.target.value,
                                                    });
                                                }}
                                                className="form-control text-right"
                                            />
                                        </div>
                                    </div>
                                    <div className="form-section mb-4">
                                        <div className="form-group">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Max sell per day
                                            </label>
                                            <input
                                                value={
                                                    orderBookConfig?.totalSellPerDay
                                                }
                                                onChange={(e) => {
                                                    setOrderBookConfig({
                                                        ...orderBookConfig,
                                                        totalSellPerDay:
                                                            +e.target.value,
                                                    });
                                                }}
                                                type="number"
                                                className="form-control text-right"
                                            />
                                        </div>
                                    </div>
                                    <div className="form-section mb-4">
                                        <div className="form-group">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Optional
                                            </label>
                                            <input
                                                type="number"
                                                className="form-control text-right"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="col-span-2">
                                    <p>{message}</p>
                                    <button
                                        className="btn btn-primary w-full"
                                        onClick={postMarketMakerConfig}
                                        disabled={configLoading}
                                    >
                                        {configLoading
                                            ? "Updating..."
                                            : "Update"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </LayoutWithHeader>
        </>
    );
};
export async function getServerSideProps({ locale }) {
    return {
        props: {
            ...(await serverSideTranslations(locale, [
                "common",
                "navbar",
                "wallet",
                "404",
                "footer",
                "spot",
            ])),
        },
    };
}
export default MarketMaker;
