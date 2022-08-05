import React, { memo } from 'react';
import TradingInput from '../../../../trade/TradingInput';
import { useTranslation } from 'next-i18next';

const initPercent = 25;
const OrderVolumeMobile = memo(({ decimal, pairConfig, setShowEditVolume, quoteQty }) => {
    const { t } = useTranslation();

    return (
        <div onClick={() => setShowEditVolume(true)} >
            <TradingInput
                onusMode={true}
                thousandSeparator={true}
                label={t('futures:mobile:volume')}
                value={quoteQty}
                allowNegative={false}
                // onValueChange={({ floatValue = '' }) => setSize(floatValue)}
                // validator={getValidator('quantity')}
                decimalScale={decimal}
                labelClassName='whitespace-nowrap capitalize text-onus-grey'
                containerClassName="h-[36px] bg-onus-input"
                tailContainerClassName='flex items-center text-onus-grey font-medium text-xs select-none'
                renderTail={() => (
                    <div className='relative group select-none text-onus-grey'>
                        <div className='flex items-center'>
                            {pairConfig?.quoteAsset ?? ''}
                        </div>
                    </div>
                )}
                readOnly
                inputClassName="text-xs !text-center !text-white"
            // onFocus={() => context.onHiddenBottomNavigation(true)}
            // onBlur={() => context.onHiddenBottomNavigation(false)}
            />
        </div>
    );
});

export default OrderVolumeMobile;
