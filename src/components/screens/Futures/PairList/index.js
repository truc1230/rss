import { memo, useCallback, useState } from 'react';
import { Search, X } from 'react-feather';
import { useSelector } from 'react-redux';

import FuturesPairListItems from './PairListItems';
import Star from 'components/svg/Star';
import colors from 'styles/colors';
import classNames from 'classnames';
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';
import { useTranslation } from 'next-i18next';

const FuturesPairList = memo(({ mode, setMode, isAuth, activePairList }) => {
    const { t } = useTranslation()
    const [keyword, setKeyWord] = useState('')
    const [sortBy, setSortBy] = useState({}) // null = default, 1 => desc, 2 => asc
    const favoritePairs = useSelector((state) => state.futures.favoritePairs)
    const [theme] = useDarkMode()
    const isDark = theme === THEME_MODE.DARK

    const pairConfigs = useSelector((state) => state.futures.pairConfigs)

    const onSort = (field, value) => setSortBy({ field, value })

    const renderPairListItems = useCallback(() => {
        const dataFilter = pairConfigs.filter(rs => rs.quoteAsset !== 'USDT');
        let data = mode === '' ? dataFilter : dataFilter?.filter(i => {
            if (mode === 'Starred') return favoritePairs.find(rs => rs.replace('_', '') === i.symbol);
            return i.quoteAsset === mode
        })
        // sort by field
        if (Object.keys(sortBy)?.length) {
        }

        // filter keyword
        if (keyword) {
            data = data?.filter((o) =>
                o?.pair?.toLowerCase().includes(keyword?.toLowerCase())
            )
        }

        return data?.map((pair) => {
            const isFavorite = favoritePairs.find(rs => rs.replace('_', '') === pair.symbol);
            return (
                <FuturesPairListItems
                    key={`futures_pairListItems_${pair?.pair}`}
                    pairConfig={pair}
                    isDark={isDark}
                    isFavorite={isFavorite}
                    isAuth={isAuth}
                />
            )
        })
    }, [pairConfigs, sortBy, keyword, mode, favoritePairs, isAuth])

    const onHandleMode = (key) => {
        setMode(key !== mode ? key : '')
    }

    const renderModes = useCallback(
        () => (
            <div className='px-3.5 pb-3.5 flex items-center'>
                {isAuth &&
                    <Star
                        onClick={() => onHandleMode('Starred')}
                        size={14}
                        fill={
                            mode === 'Starred'
                                ? colors.yellow
                                : isDark
                                    ? colors.darkBlue5
                                    : colors.grey2
                        }
                        className='cursor-pointer'
                    />
                }
                {/* <div
                    onClick={() => onHandleMode('USDT')}
                    className={classNames(
                        'ml-3 font-medium text-xs text-txtSecondary dark:text-txtSecondary-dark hover:text-dominant',
                        { '!text-dominant': mode === 'USDT' }
                    )}
                >
                    USDT
                </div> */}
                <div
                    onClick={() => onHandleMode('VNDC')}
                    className={classNames(
                        'ml-3 font-medium text-xs text-txtSecondary dark:text-txtSecondary-dark hover:text-dominant',
                        { '!text-dominant': mode === 'VNDC' }
                    )}
                >
                    VNDC
                </div>
            </div>
        ),
        [mode, isDark, isAuth]
    )
    return (
        <div className={`${!activePairList ? 'hidden' : ''} py-4 min-w-[380px] bg-bgPrimary dark:bg-bgPrimary-dark dark:border dark:border-darkBlue-4 drop-shadow-onlyLight rounded-md`}>
            <div className='max-h-[300px] flex flex-col'>
                <div className='px-4 mb-3'>
                    <div className='px-2.5 py-1.5 rounded-md flex items-center bg-gray-5 dark:bg-darkBlue-3'>
                        <Search
                            size={16}
                            strokeWidth={1.2}
                            className='text-txtBtnSecondary dark:text-txtSecondary-dark'
                        />
                        <input
                            value={keyword}
                            onChange={(e) => setKeyWord(e.target?.value.trim())}
                            placeholder='Search...'
                            className='mx-2.5 text-xs flex-grow'
                        />
                        {keyword && (
                            <div className='px-1'>
                                <X
                                    size={16}
                                    strokeWidth={1.2}
                                    onClick={() => setKeyWord('')}
                                    className='text-txtBtnSecondary dark:text-txtSecondary-dark'
                                />
                            </div>
                        )}
                    </div>
                </div>

                {renderModes()}

                <div
                    style={{
                        height: ORDERS_HEADER_HEIGHT,
                    }}
                    className='px-3.5 pt-2.5 mb-2.5 flex items-center justify-between font-medium text-[10px] text-txtSecondary dark:text-txtSecondary-dark'
                >
                    <div style={{ flex: '1 1 0%' }} className='justify-start'>
                        Contract
                    </div>
                    <div
                        style={{ flex: '1 1 0%' }}
                        className='justify-end text-right'
                    >
                        {t('common:last_price')}
                    </div>
                    <div
                        style={{ flex: '1 1 0%' }}
                        className='justify-end text-right'
                    >
                        {t('futures:24h_change')}
                    </div>
                </div>

                <div className='flex-grow overflow-y-auto'>
                    {renderPairListItems()}
                </div>
            </div>
        </div>
    )
})

const ORDERS_HEADER_HEIGHT = 20

export default FuturesPairList
