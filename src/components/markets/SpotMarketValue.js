import { formatBalance, formatSpotFee } from 'src/redux/actions/utils';
import { PublicSocketEvent, SpotFeePercentage } from 'src/redux/actions/const';
import { useEffect, useState } from 'react';
import Emitter from 'src/redux/actions/emitter';

const SpotMarketValue = (props) => {
    const { quantity, type } = props;
    const [symbolTicker, setSymbolTicker] = useState(null);
    useEffect(() => {
        Emitter.on(PublicSocketEvent.SPOT_TICKER_UPDATE, async (data) => {
            setSymbolTicker(data);
        });
        return function cleanup() {
            Emitter.off(PublicSocketEvent.SPOT_TICKER_UPDATE);
        };
    }, [Emitter]);

    if (!symbolTicker) return null;

    const orderValue = quantity * (symbolTicker?.p || 0);

    const feeValue = orderValue * SpotFeePercentage.NORMAL;

    if (type === 'fee') {
        return (
            <>
                {formatSpotFee(feeValue, 2)}
            </>
        );
    }
    if (type === 'order_value') {
        return (
            <>
                {formatBalance(quantity * (symbolTicker?.p || 0), 2)}
            </>
        );
    }
};

export default SpotMarketValue;
