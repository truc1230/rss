import { IconNoSort, IconSort, IconStarFilled } from 'src/components/common/Icons';
import SearchInput from 'src/components/markets/SearchInput';
import compact from 'lodash/compact';
import orderBy from 'lodash/orderBy';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { Fragment, useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useAsync, useInterval } from 'react-use';
import SymbolListItem from 'src/components/markets/SymbolListItem';
import { CATEGORY_SPOT_SIGNAL, TRADING_MODE } from 'src/redux/actions/const';
import { getMarketWatch } from 'src/redux/actions/market';
import { getExchange24hPercentageChange } from 'src/redux/actions/utils';
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';
import colors from '../../styles/colors';
import { favoriteAction } from 'redux/actions/user';

const SymbolList = (props) => {
    const { query } = useRouter();
    const { t } = useTranslation();
    const { parentCallback, publicSocket, changeSymbolList, watchList } = props;
    const [symbolList, setSymbolList] = useState([]);
    const [sortField, setSortField] = useState();
    const [sortDirection, setSortDirection] = useState('asc');
    const [favorite, setFavorite] = useState([]);
    const [activeTab, setActiveTab] = useState('USDT');
    const [search, setSearch] = useState('');
    const [filteredSymbolList, setFilteredSymbolList] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState({ name: t('common:all'), value: CATEGORY_SPOT_SIGNAL.ALL });
    const [signals, setSignals] = useState([]);
    const [filteredSignals, setFilteredSignals] = useState([]);

    const exchangeConfig = useSelector(state => state.utils.exchangeConfig);
    const user = useSelector(state => state.auth.user) || null;

    const [currentTheme, ] = useDarkMode()

    const fetchFavorite = async () => {
        const _favorite = await favoriteAction('get', TRADING_MODE.EXCHANGE)
        _favorite && setFavorite(_favorite)

    }

    useEffect(() => {
        fetchFavorite()
    }, [])

    useAsync(async () => {
        const result = await getMarketWatch();
        setSymbolList(result);
    }, []);

    useInterval(async () => {
        const result = await getMarketWatch();
        setSymbolList(result);
    }, 5000);

    useEffect(() => {
        if (symbolList && symbolList.length) {
            let filterSymbols = [];

            if (selectedCategory.value === CATEGORY_SPOT_SIGNAL.ALL) {
                symbolList.forEach(sym => {
                    const {
                        'q': quoteAsset,
                        'b': baseAsset,
                    } = sym;
                    if (!(quoteAsset && baseAsset)) return null;
                    if (typeof search === 'string' && search.length) {
                        if (quoteAsset === activeTab
                        && baseAsset.toLowerCase().includes(search.toLowerCase())) {
                            filterSymbols.push(sym);
                        }
                    } else {
                        if (quoteAsset === activeTab) {
                            filterSymbols.push(sym);
                        }
                    }
                });
            } else if (selectedCategory.value === CATEGORY_SPOT_SIGNAL.SIGNAL) {
                if (typeof search === 'string' && search.length) {
                    const filteredSignal = signals.filter(signal => signal?.metadata?.baseAsset.toLowerCase().includes(search.toLowerCase()));
                    setFilteredSignals(filteredSignal);
                } else {
                    setFilteredSignals(signals);
                }
            } else if (selectedCategory?.assets && selectedCategory?.assets.length > 0) {
                selectedCategory?.assets.forEach(asset => {
                    symbolList.forEach(sym => {
                        const {
                            'q': quoteAsset,
                            'b': baseAsset,
                        } = sym;
                        if (!(quoteAsset && baseAsset)) return null;
                        if (quoteAsset === activeTab
                                && baseAsset.toLowerCase().includes(asset.toLowerCase())) {
                            filterSymbols.push(sym);
                        }
                    });
                });
            }
            filterSymbols = compact(filterSymbols);

            if (sortField === 'p' || sortField === 'change24h') {
                // sort khong can quan tam favorite
                filterSymbols = orderBy(filterSymbols, [
                    item => item,
                    // ...sortField && sortField === 'b' ? [item => item[sortField].toLowerCase().charAt(0)] : [],
                    ...sortField && sortField === 'p' ? [item => +item.p] : [],
                    ...sortField && sortField === 'change24h' ? [item => getExchange24hPercentageChange(item)] : [],
                ], [
                    'desc',
                    ...sortField ? [sortDirection] : ['desc'],
                ]);
            } else {
                // Sap xep favorite len dau
                filterSymbols = orderBy(filterSymbols, [
                    item => favorite && favorite.length && favorite.includes(item.b),
                    ...sortField && sortField === 'b' ? [item => item[sortField].toLowerCase().charAt(0)] : [],
                    // ...sortField && sortField === 'p' ? [item => +item.p] : [],
                    // ...sortField && sortField === 'change24h' ? [item => { return getExchange24hPercentageChange(item)}] : [],
                ], [
                    'desc',
                    ...sortField ? [sortDirection] : ['desc'],
                ]);
            }
            setFilteredSymbolList(filterSymbols);
        }
    }, [symbolList, search, activeTab, favorite, sortDirection, selectedCategory, sortField]);


    const SortIcon = ({ direction }) => {
        return (
            <div className={`transform ${direction === 'asc' ? 'rotate-180' : ''}`}>
                <IconSort />
            </div>
        );
    };


    const renderList = useCallback(() => {
        return (
            <>
                <div className="bg-bgContainer dark:bg-darkBlue-1 px-3">
                    <div className="flex justify-between items-center mb-2">
                        <div
                            className="flex flex-1 items-center justify-start text-txtSecondary dark:text-txtSecondary-dark text-xxs font-medium cursor-pointer select-none"
                            onClick={() => {
                                setSortField('b');
                                setSortDirection(value => (value === 'asc' ? 'desc' : 'asc'));
                            }}
                        >
                            <div
                                className="mr-1"
                            >{t('common:asset')}
                            </div>
                            {
                                sortField === 'b'
                                    ? <SortIcon direction={sortDirection} />
                                    : <IconNoSort fill={currentTheme === THEME_MODE.LIGHT ? colors.grey1 : colors.darkBlue5} />
                            }
                        </div>
                        <div
                            className="flex flex-1 items-center justify-end text-txtSecondary dark:text-txtSecondary-dark text-xxs font-medium cursor-pointer select-none"
                            onClick={() => {
                                setSortField('p');
                                setSortDirection(value => (value === 'asc' ? 'desc' : 'asc'));
                            }}
                        >
                            <div className="mr-1">{t('common:price')}</div>
                            {
                                sortField === 'p'
                                    ? <SortIcon direction={sortDirection} />
                                    : <IconNoSort fill={currentTheme === THEME_MODE.LIGHT ? colors.grey1 : colors.darkBlue5} />
                            }
                        </div>
                        <div
                            className="flex flex-1 items-center justify-end text-txtSecondary dark:text-txtSecondary-dark text-xxs font-medium cursor-pointer select-none"
                            onClick={() => {
                                setSortField('change24h');
                                setSortDirection(value => (value === 'asc' ? 'desc' : 'asc'));
                            }}
                        >
                            <div className="mr-1">{t('common:change')}</div>
                            {
                                sortField === 'change24h'
                                    ? <SortIcon direction={sortDirection} />
                                    : <IconNoSort fill={currentTheme === THEME_MODE.LIGHT ? colors.grey1 : colors.darkBlue5} />
                            }
                        </div>
                    </div>
                </div>
                <div className="overflow-y-auto max-h-[calc(100%-6rem)]">
                    {/* <div className="overflow-y-scroll"> */}
                    {filteredSymbolList.map((ticker, index) => {
                        return (
                            <Fragment
                                key={`${search}_${activeTab}_${ticker.b}}`}
                            >
                                <SymbolListItem
                                    changeSymbolList={changeSymbolList}
                                    exchangeConfig={exchangeConfig}
                                    favorite={favorite}
                                    symbolString={ticker?.s}
                                    publicSocket={publicSocket}
                                    currentId={query?.id}
                                    originTicker={ticker}
                                    watchList={watchList}
                                    pairKey={`${ticker?.bi}_${ticker?.qi}`}
                                    reFetchFavorite={fetchFavorite}
                                />
                            </Fragment>
                        );
                    })}
                </div>
            </>
        );
    }, [filteredSymbolList, selectedCategory, filteredSignals, query, currentTheme, changeSymbolList]);

    const renderFav = useCallback(() => {
        if (!symbolList) return null
        const origin = symbolList.filter(o => favorite.includes(`${o.bi}_${o.qi}`))
        let data = origin

        if (search) {
            // console.log('namidev-DEBUG: __ ', origin)
            data = origin.filter(d => {
                const _ = (`${d?.b}`).toLowerCase().includes(search.toLowerCase())
                const __ = (`${d?.b}${d?.q}`).toLowerCase().includes(search.toLowerCase())
                const ___ = (`${d?.b}/${d?.q}`).toLowerCase().includes(search.toLowerCase())
                // console.log('namidev-DEBUG: ___ ', _, __, ___)
                return _ || __ || ___
            })
        }

        return (
            <>
                <div className=" px-3">
                    <div className="flex justify-between items-center mb-3">
                        <div
                            className="flex flex-1 items-center justify-start text-txtSecondary dark:text-txtSecondary-dark text-xs font-semibold cursor-pointer select-none"
                            onClick={() => {
                                setSortField('b');
                                setSortDirection(value => (value === 'asc' ? 'desc' : 'asc'));
                            }}
                        >
                            <div
                                className="mr-1"
                            >{t('common:asset')}
                            </div>
                            {
                                sortField === 'b'
                                    ? <SortIcon direction={sortDirection} />
                                    : <IconNoSort fill={currentTheme === THEME_MODE.LIGHT ? colors.grey1 : colors.darkBlue5} />
                            }
                        </div>
                        <div
                            className="flex flex-1 items-center justify-end text-txtSecondary dark:text-txtSecondary-dark text-xs font-semibold cursor-pointer select-none"
                            onClick={() => {
                                setSortField('p');
                                setSortDirection(value => (value === 'asc' ? 'desc' : 'asc'));
                            }}
                        >
                            <div className="mr-1">{t('common:price')}</div>
                            {
                                sortField === 'p'
                                    ? <SortIcon direction={sortDirection} />
                                    : <IconNoSort fill={currentTheme === THEME_MODE.LIGHT ? colors.grey1 : colors.darkBlue5} />
                            }
                        </div>
                        <div
                            className="flex flex-1 items-center justify-end text-txtSecondary dark:text-txtSecondary-dark text-xs font-semibold cursor-pointer select-none"
                            onClick={() => {
                                setSortField('change24h');
                                setSortDirection(value => (value === 'asc' ? 'desc' : 'asc'));
                            }}
                        >
                            <div className="mr-1">{t('common:change')}</div>
                            {
                                sortField === 'change24h'
                                    ? <SortIcon direction={sortDirection} />
                                    : <IconNoSort fill={currentTheme === THEME_MODE.LIGHT ? colors.grey1 : colors.darkBlue5} />
                            }
                        </div>
                    </div>
                </div>
                <div className="overflow-y-auto max-h-[calc(100%-6rem)]">
                    {/* <div className="overflow-y-scroll"> */}
                    {data.map((ticker, index) => {
                        return (
                            <Fragment
                                key={`favorite_tab_${ticker.b}}`}
                            >
                                <SymbolListItem
                                    isFavoriteTab
                                    changeSymbolList={changeSymbolList}
                                    exchangeConfig={exchangeConfig}
                                    favorite={favorite}
                                    symbolString={ticker?.s}
                                    publicSocket={publicSocket}
                                    currentId={query?.id}
                                    originTicker={ticker}
                                    watchList={watchList}
                                    pairKey={`${ticker?.bi}_${ticker?.qi}`}
                                    reFetchFavorite={fetchFavorite}
                                />
                            </Fragment>
                        );
                    })}
                </div>
            </>)
        }, [favorite, selectedCategory, query, currentTheme, symbolList, changeSymbolList, exchangeConfig, publicSocket, watchList, search]);


    return (
        <>
            <div
                className="bg-bgSpotContainer dark:bg-bgSpotContainer-dark py-4 h-full"
            >
                <div className="mx-3 mb-3 dragHandleArea">
                        <SearchInput
                            placeholder={t('spot:search')}
                            onChange={(e) => setSearch(e.target.value)}
                            parentState={setSearch}
                            customStyle={{ height: '30px' }}

                        />
                    </div>

                    <div className="mx-2 mb-2 flex items-center">

                        {user && <div
                            className={'min-w-9 flex justify-center items-center text-sm mr-2.5 cursor-pointer ' + (activeTab === 'favorite' ? 'active text-teal border-mint' : 'border-divider dark:border-divider-dark')}
                            onClick={() => setActiveTab('favorite')}
                        >
                            <IconStarFilled size={12}
                                            color={activeTab === 'favorite' ? '#00C8BC' : currentTheme === THEME_MODE.LIGHT ? colors.grey1 : colors.darkBlue5}/>
                        </div>}
                        <a
                            className={'min-w-9 text-sm text-center mr-2.5 font-bold text-xs cursor-pointer ' + (activeTab === 'USDT' ? 'active text-teal border-mint' : 'text-txtSecondary dark:text-txtSecondary-dark border-divider dark:border-divider-dark')}
                            onClick={() => setActiveTab('USDT')}
                        > USDT
                        </a>
                        <a
                            className={'min-w-9 text-sm text-center mr-2.5 font-bold text-xs cursor-pointer ' + (activeTab === 'VNDC' ? 'active text-teal border-mint' : 'text-txtSecondary dark:text-txtSecondary-dark border-divider dark:border-divider-dark')}
                            onClick={() => setActiveTab('VNDC')}
                        > VNDC
                        </a>
                    </div>
                    {activeTab !== 'favorite' && renderList()}
                    {activeTab === 'favorite' && renderFav()}

            </div>
        </>
    );
};

export default SymbolList;
