import { useState } from 'react';
import { getS3Url, setTransferModal } from 'redux/actions/utils';
import { useTranslation } from 'next-i18next';
import { useDispatch } from 'react-redux';

import TradingLabel from 'components/trade/TradingLabel';
import AvblAsset from 'components/trade/AvblAsset';
import FuturesCalculator from 'components/screens/Futures/Calculator';

const FuturesOrderUtilities = ({ quoteAssetId, quoteAsset, isAuth, isVndcFutures }) => {
    const [openCalculator, setCalculator] = useState(false)

    const { t } = useTranslation()
    const dispatch = useDispatch()

    const openTransferModal = () =>
        dispatch(setTransferModal({ isVisible: true, asset: quoteAsset }))

    const onOpenCalculator = () => setCalculator((prevState) => !prevState)

    return (
        <>
            <div className='flex items-center'>
                <div className='flex-grow'>
                    <TradingLabel
                        label={t('common:available_balance')}
                        value={<AvblAsset useSuffix assetId={quoteAssetId} />}
                    />
                </div>
                {isAuth &&
                    <div className='w-6 h-6 flex items-center justify-center rounded-md cursor-pointer hover:bg-gray-4 dark:hover:bg-darkBlue-3'>
                        <div
                            className='flex flex-col text-txtSecondary dark:text-txtSecondary-dark'
                            onClick={openTransferModal}
                        >
                           <img src={getS3Url("/images/icon/ic_exchange2.png")} height="16" width="16" />
                        </div>
                    </div>
                }
                {!isVndcFutures &&
                    <div
                        className='w-6 h-6 ml-2 flex items-center justify-center rounded-md cursor-pointer hover:bg-gray-4 dark:hover:bg-darkBlue-3 text-txtSecondary dark:text-txtSecondary-dark'
                        onClick={onOpenCalculator}
                    >
                        {/* <File size={16} strokeWidth={1.8} /> */}
                        <svg
                            xmlns='http://www.w3.org/2000/svg'
                            width={16}
                            height={16}
                            viewBox='0 0 24 24'
                            fill='none'
                        >
                            <path
                                fillRule='evenodd'
                                clipRule='evenodd'
                                d='M19.5 3h-14v18h14V3zM8 5.5h9v3.908H8V5.5zm6 6h3v7h-3v-7zm-6 0h4V14H8v-2.5zM8 16h4v2.5H8V16z'
                                fill='currentColor'
                            ></path>
                        </svg>
                    </div>
                }
            </div>
            <FuturesCalculator
                isVisible={openCalculator}
                onClose={() => setCalculator(false)}
            />
        </>
    )
}

export default FuturesOrderUtilities
