import classNames from 'classnames';
import { isArray, isDate, isString } from 'lodash';
import { DatePicker } from 'antd';
import { forwardRef, useImperativeHandle, useMemo, useState } from 'react';
import { add } from 'date-fns';
import { useTranslation } from 'next-i18next';

const {RangePicker} = DatePicker

const FuturesTimeFilter2 = forwardRef(({currentTimeRange, onChange},ref) => {
    const { t } = useTranslation();
    const [customRange, setCustomRange] = useState(isString(currentTimeRange) ? currentTimeRange : '')
    const currentTime = new Date()

    useImperativeHandle(ref, () => ({
        onReset: (params) => setCustomRange(params)
    }));
    const timeRanges = {
        '1_day': [add(currentTime, {days: -1}), currentTime],
        '1_week': [add(currentTime, {weeks: -1}), currentTime],
        '1_month': [add(currentTime, {months: -1}), currentTime],
        '3_month': [add(currentTime, {months: -3}), currentTime],
    }

    const handleCustomRangeChange = (time) => () => {
        setCustomRange(time)
        onChange(timeRanges[time])
    }

    const value = useMemo(() => {
        // TOTO: improve check is moment object
        if (isArray(currentTimeRange) && currentTimeRange.every(e => !isDate(e))) {
            return currentTimeRange
        }
    }, [currentTimeRange])

    return (
        <div
            className='px-5 flex items-center font-medium text-xs text-txtSecondary dark:text-txtSecondary-dark select-none'>
            <div
                onClick={handleCustomRangeChange('1_day')}
                className={classNames(
                    'px-2 h-[20px] rounded-md mr-2 cursor-pointer',
                    {'bg-gray-5 dark:bg-darkBlue-4': customRange === '1_day'}
                )}
            >1 {t('futures:day')}
            </div>
            <div
                onClick={handleCustomRangeChange('1_week')}
                className={classNames(
                    'px-2 h-[20px] rounded-md mr-2 cursor-pointer',
                    {'bg-gray-5 dark:bg-darkBlue-4': customRange === '1_week'}
                )}
            >1 {t('futures:week')}
            </div>
            <div
                onClick={handleCustomRangeChange('1_month')}
                className={classNames(
                    'px-2 h-[20px] rounded-md mr-2 cursor-pointer',
                    {'bg-gray-5 dark:bg-darkBlue-4': customRange === '1_month'}
                )}
            >1 {t('futures:month')}
            </div>
            <div
                onClick={handleCustomRangeChange('3_month')}
                className={classNames(
                    'px-2 h-[20px] rounded-md cursor-pointer',
                    {'bg-gray-5 dark:bg-darkBlue-4': customRange === '3_month'}
                )}
            >3 {t('futures:month')}
            </div>
            <div className='flex items-center ml-5 custom_ant_datepicker mr-2'>
                <span className='mr-1.5'>{t('common:time')}</span>
                <RangePicker
                    bordered={false}
                    separator={t('futures:to')}
                    placeholder={['DD-MM-YYYY', 'DD-MM-YYYY']}
                    format='DD-MM-YYYY'
                    value={value}
                    allowClear={false}
                    onChange={(date) => {
                        if (!date) return onChange(null)
                        onChange([date[0].startOf('day'), date[1].endOf('day')])
                        setCustomRange('')
                    }}
                />
            </div>
        </div>
    )
})

export default FuturesTimeFilter2
