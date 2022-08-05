import { useEffect, useState } from 'react';
import Link from 'next/link';
import debounce from 'lodash/debounce';
import { formatPrice, render24hChange } from 'src/redux/actions/utils';
import { IconStar, IconStarFilled } from '../common/Icons';
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';
import colors from '../../styles/colors';
import { TRADING_MODE } from 'redux/actions/const';
import { favoriteAction } from 'redux/actions/user';

const SymbolListItem = (props) => {
    const { symbolString, publicSocket, exchangeConfig, originTicker, currentId, favorite, watchList, pairKey, isFavoriteTab = false, reFetchFavorite } = props;
    const [symbolTicker, setSymbolTicker] = useState(null);
    const [favoriteId, setFavoriteId] = useState('');
    const [alreadyInFav, setAlreadyInFav] = useState(false)

    const [currentTheme, ] = useDarkMode()

    useEffect(() => {
        if (watchList && watchList.length) {
            setFavoriteId(watchList.filter(list => list.type === 'FAVORITE')?.[0]?.id);
        }
        if (originTicker) {
            setSymbolTicker(originTicker);
        }
    }, []);

    const handleSetFavorite = async (pairKey) => {
        await favoriteAction(isFavoriteTab ? 'delete' : 'put', TRADING_MODE.EXCHANGE, pairKey)
        await reFetchFavorite()
    }

    const listenerHandler = debounce((data) => {
        setSymbolTicker(data);
    }, 1000);

    useEffect(() => {
        if (publicSocket && symbolString) {
            const event = `spot:mini_ticker:update:${symbolString}`;
            publicSocket.removeListener(event, listenerHandler);
            publicSocket.on(event, listenerHandler);
        }
        return function cleanup() {
            const event = `spot:mini_ticker:update:${symbolString}`;
            if (publicSocket && symbolString) {
                publicSocket.removeListener(event, listenerHandler);
            }
        };
    }, [publicSocket, symbolString]);

    useEffect(() => {
        if (favorite && favorite.includes(pairKey)) {
            setAlreadyInFav(true)
        } else {
            setAlreadyInFav(false)
        }
    }, [favorite, pairKey])

    const base = symbolTicker?.b;
    const quote = symbolTicker?.q;
    const up = symbolTicker?.u;

    return (
        <div
            className={`px-2.5 h-5 flex items-center cursor-pointer hover:bg-teal-lightTeal dark:hover:bg-darkBlue-3 ${currentId === `${base}-${quote}` ? 'bg-teal-lightTeal dark:bg-darkBlue-3' : ''}`}
        >
            <div className="mr-1.5 cursor-pointer"
                 onClick={() => handleSetFavorite(pairKey)}>
                {alreadyInFav ? <IconStarFilled color={colors.yellow} />
                    : <IconStar color={currentTheme === THEME_MODE.LIGHT ? colors.grey1 : colors.darkBlue5} />}
            </div>
            <Link href={`/trade/${base}-${quote}`} prefetch={false} shallow>
                <div className="flex items-center w-full">
                    <div
                        className="text-txtPrimary dark:text-txtPrimary-dark flex-1 text-xs font-medium leading-table flex items-center truncate min-w-0 mr-1.5"
                    >
                        {base}<span className="text-txtSecondary dark:text-txtSecondary-dark">/{quote}</span>
                    </div>
                    <div
                        className={`flex-1 text-xs font-medium leading-table text-right mr-1.5 ${!up ? 'text-teal' : 'text-red'}`}
                    >
                        {formatPrice(+symbolTicker?.p, exchangeConfig, quote)}
                    </div>
                    <div
                        className="flex-1 text-teal font-medium text-xs leading-table text-right"
                    >{render24hChange(symbolTicker)}
                    </div>
                </div>

            </Link>

        </div>
    );
};

export default SymbolListItem;
