import { memo } from 'react';

const SegmentTabs = memo(({ active, tabSeries, onChange, callback }) => {
    return (
        <div className="flex items-center">
            {tabSeries.map(tab => (
                <div key={`segment_tab_item__${tab?.key}`}
                     onClick={() => {
                         active !== tab?.key && onChange(tab?.key)
                         callback && callback()
                     }}
                     className={active === tab?.key ? 'mr-3 px-4 py-1.5 xl:py-2.5 font-medium text-xs sm:text-sm text-white rounded-lg bg-dominant cursor-pointer select-none'
                         : 'mr-3 px-4 py-1.5 xl:py-2.5 font-medium text-xs sm:text-sm text-txtSecondary dark:text-txtSecondary-dark rounded-lg bg-gray-4 dark:bg-darkBlue-3 cursor-pointer select-none'}>
                    {tab?.title}
                </div>
            ))}
        </div>
    )
})

export default SegmentTabs
