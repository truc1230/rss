import { formatPercentage } from 'src/redux/actions/utils';
import { useMemo } from 'react';

const PercentageOf = ({ a, b, withBackground }) => {
    return useMemo(() => {
        if (Number.isNaN(a) || Number.isNaN(b)) {
            return '- %';
        }
        let percentage = 0;
        if (b === 0 || a === 0) {
            percentage = 0;
        } else {
            percentage = (a) / b * 100;
        }
        let sign = '';
        let className = 'text-teal';
        let bgClass = 'bg-teal';
        if (percentage > 0) {
            sign = '+';
        } else if (percentage < 0) {
            sign = '';
            className = 'text-red';
            bgClass = 'bg-pink';
        }
        if (withBackground) {
            return (
                <span className={`${bgClass} ${className} bg-opacity-10 ml-3 text-xs font-bold inline-block py-1 px-2 rounded`}>
                    {`${sign}${formatPercentage(percentage, 2, true)}%`}
                </span>
            );
        }
        return <span className={className}>{`${sign}${formatPercentage(percentage, 2, true)}%`}</span>;
    }, [a, b, withBackground]);
};

export default PercentageOf;
