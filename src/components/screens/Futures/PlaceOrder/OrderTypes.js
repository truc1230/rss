import { memo } from 'react';
import { FuturesOrderTypes as OrderTypes } from 'redux/reducers/futures';
import { SET_FUTURES_PRELOADED_FORM } from 'redux/actions/types';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'next-i18next';
import { ChevronDown } from 'react-feather';

import classNames from 'classnames';

const FuturesOrderTypes = memo(({ currentType, orderTypes, isVndcFutures }) => {
    const { t } = useTranslation()
    const currentAdvType = useSelector(
        (state) => state.futures.preloadedState?.orderAdvanceType
    )
    const dispatch = useDispatch()

    // ? Helper
    const getTypesLabel = (type) => {
        switch (type) {
            case OrderTypes.Limit:
                return t('trade:order_types.limit')
            case OrderTypes.StopLimit:
                return t('trade:order_types.stop_limit')
            case OrderTypes.Market:
                return t('trade:order_types.market')
            case OrderTypes.StopMarket:
                return t('trade:order_types.stop_market')
            case OrderTypes.TrailingStopMarket:
                return t('trade:order_types.trailing_stop')
            default:
                return '--'
        }
    }
    const setOrderTypes = (payload, isAdvance = false) => {
        if (payload !== currentType) {
            dispatch({
                type: SET_FUTURES_PRELOADED_FORM,
                payload: { orderType: payload },
            })
            isAdvance &&
                dispatch({
                    type: SET_FUTURES_PRELOADED_FORM,
                    payload: { orderAdvanceType: payload },
                })
        }
    }

    // ? Render handler
    const renderCommonTypes = () => {
        const orderFilter = isVndcFutures ? orderTypes : orderTypes?.filter((o) => o === OrderTypes.Limit || o === OrderTypes.Market)
        return orderFilter?.map((o) => (
            <div
                key={`futures_margin_mode_${o}`}
                className={classNames(
                    'pb-2 w-1/3 min-w-[78px] text-txtSecondary dark:text-txtSecondary-dark font-medium text-xs text-center cursor-pointer border-b-[2px] border-transparent',
                    {
                        '!text-txtPrimary dark:!text-txtPrimary-dark border-dominant':
                            o === currentType,
                    }
                )}
                onClick={() => setOrderTypes(o)}
            >
                {getTypesLabel(o)}
            </div>
        ))
    }

    const renderCurrentAdvanceTypes = () => {
        return (
            <>
                <div
                    className={classNames(
                        'pb-2 w-1/3 max-w-1/3 max-w-[78px] text-txtSecondary dark:text-txtSecondary-dark font-medium text-xs text-center cursor-pointer border-b-[2px] border-transparent truncate',
                        {
                            '!text-txtPrimary dark:!text-txtPrimary-dark border-dominant':
                                currentAdvType === currentType,
                        }
                    )}
                    onClick={() => setOrderTypes(currentAdvType)}
                >
                    {getTypesLabel(currentAdvType)}
                </div>
            </>
        )
    }

    const renderAdvanceTypesDropdown = () => {
        const advanceTypes =
            orderTypes?.filter(
                (o) =>
                    o !== OrderTypes.TakeProfit &&
                    o !== OrderTypes.TakeProfitMarket &&
                    o !== OrderTypes.Limit &&
                    o !== OrderTypes.Market &&
                    o !== OrderTypes.TrailingStopMarket
            ) || false
        if (!advanceTypes) return null

        const advTypesElement = advanceTypes?.map((o) => (
            <div
                key={`futures_margin_mode_${o}`}
                className={classNames(
                    'px-3 py-2 mb-2 last:mb-0 hover:bg-teal-lightTeal dark:hover:bg-teal-opacity',
                    {
                        'text-dominant': currentType === o,
                    }
                )}
                onClick={() => setOrderTypes(o, true)}
            >
                {getTypesLabel(o)}
            </div>
        ))
        return (
            <div className='pt-2 absolute z-30 bottom-0 right-0 translate-y-full hidden group-hover:block'>
                <div className='py-1 rounded-md min-w-[114px] bg-bgPrimary dark:bg-bgPrimary-dark drop-shadow-onlyLight dark:border dark:border-darkBlue-4 text-xs font-medium whitespace-nowrap'>
                    {advTypesElement}
                </div>
            </div>
        )
    }

    return (
        <div className='relative flex items-center select-none'>
            <div className='relative z-20 mr-[18px] flex flex-grow'>
                {renderCommonTypes()}
                {!isVndcFutures && renderCurrentAdvanceTypes()}
            </div>
            {!isVndcFutures &&
                <div className='relative group pb-2 cursor-pointer'>
                    <ChevronDown
                        size={16}
                        strokeWidth={1.8}
                        className='text-txtSecondary dark:text-txtSecondary-dark hover:text-txtPrimary dark:hover:text-txtPrimary-dark group-hover:rotate-180'
                    />
                    {renderAdvanceTypesDropdown()}
                </div>
            }
            <div className='absolute z-10 w-full left-0 bottom-0 h-[2px] bg-divider dark:bg-divider-dark' />
        </div>
    )
})

export default FuturesOrderTypes
