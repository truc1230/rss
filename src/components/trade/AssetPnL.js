import TextLoader from 'src/components/loader/TextLoader';
import { useState } from 'react';
import { useAsync } from 'react-use';
import { formatPercentage } from 'src/redux/actions/utils';

const AssetPnL = (props) => {
    const { initialPrice, value, multiValue, symbolTicker } = props;
    const [percentage, setPercentage] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useAsync(async () => {
        setIsLoading(true);
        let price = 0;
        if (symbolTicker?.q === 'VNDC') {
            price = (1 / multiValue) * symbolTicker?.p;
        } else {
            price = symbolTicker?.p;
        }
        if (price > 0 && initialPrice > 0 && value > 0) {
            await setPercentage(formatPercentage((price - initialPrice) / initialPrice * 100, 2, true));
        } else {
            await setPercentage(0);
        }
        setIsLoading(false);
    }, [multiValue, initialPrice, value, symbolTicker]);

    if (isLoading) return <span><TextLoader height={18} /></span>;

    return <span className={Number(percentage) >= 0 ? 'text-teal' : 'text-red'}>{percentage}%</span>;
};

export default AssetPnL;
