import { useCallback } from 'react';
import SvgFlame from 'src/components/svg/SvgFlame';

const MarketLabel = ({ labelType }) => {

    if (!labelType) return null

    const renderLabel = useCallback(() => {
        if (labelType === 'top_view') return <span className="ml-3"><SvgFlame size={16}/></span>
        return (
            <span className="min-w-[27px] min-h-[15px] text-center uppercase whitespace-nowrap ml-3 text-xxs
                         text-dominant px-1.5 py-0.5 bg-gray-4 dark:bg-darkBlue-3 rounded-sm">
                {labelType}
        </span>
        )
    }, [labelType])

    return renderLabel()
}

export default MarketLabel
