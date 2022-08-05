import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'next-i18next';
import FuturesLeverageSettings from 'components/screens/Futures/LeverageSettings';
import { API_FUTURES_LEVERAGE } from 'redux/actions/apis';
import axios from 'axios';
import { ApiStatus } from 'redux/actions/const';

const OrderLeverage = ({ leverage, setLeverage, isAuth, pair, pairConfig, context, getLeverage }) => {
    const { t } = useTranslation();
    const [openModal, setOpenModal] = useState(false);

    useEffect(() => {
        pairConfig?.pair && isAuth && fetchLeverage(pairConfig?.pair)
    }, [pairConfig?.pair, isAuth])

    const fetchLeverage = async (symbol) => {
        const { data } = await axios.get(API_FUTURES_LEVERAGE, {
            params: {
                symbol,
            },
        })
        if (data?.status === ApiStatus.SUCCESS) {
            if (getLeverage) getLeverage(data?.data?.[pairConfig?.pair])
            setLeverage(data?.data?.[pairConfig?.pair])
        }
    }

    useEffect(() => {
        document.addEventListener('click', _onClose)
        return () => {
            document.removeEventListener('click', _onClose)
        }
    }, [])

    const _onClose = (e) => {
        const container = document.querySelector('.leverage-mobile');
        if (container && !container.contains(e.target.parentElement)) {
            setOpenModal(false);
        }
    }

    return (
        <>
            <div
                onClick={() => setOpenModal(true)}
                data-tut="order-leverage"
                className="flex items-center justify-center h-[32px] w-12 text-onus-white border-onus-white leading-8 text-center border-[1px] text-xs px-[5px] rounded-[4px] font-medium">{leverage}x
            </div>
            {openModal &&
                <FuturesLeverageSettings
                    onusMode={true}
                    pair={pair}
                    leverage={leverage}
                    setLeverage={setLeverage}
                    pairConfig={pairConfig}
                    isVisible={openModal}
                    isAuth={isAuth}
                    onClose={() => setOpenModal(false)}
                    isVndcFutures={true}
                    dots={5}
                    className="max-w-full overflow-hidden"
                    // containerStyle={{ transform: 'unset' }}
                />
            }
        </>
    );
};

export default OrderLeverage;
