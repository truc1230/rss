import { Fragment, memo, useMemo, useState } from 'react';
import { DatePicker } from 'antd';
import classNames from 'classnames';

import 'antd/dist/antd.css';
import { endOfDay, startOfDay, startOfMonth, startOfWeek } from 'date-fns';
import { Popover, Transition } from '@headlessui/react';
import ChevronDown from 'components/svg/ChevronDown';
import { getS3Url } from 'redux/actions/utils';

const { RangePicker } = DatePicker

const FuturesTimeFilter = memo(({ currentTimeRange, onChange, onFilter, onReset, arrCate }) => {
    const [incomeType, setIncomeType] = useState('ALL');

    const _onFilter = () => {
        if (!currentTimeRange) {
            onFilter(incomeType !== 'ALL' ? { incomeType: incomeType } : {});
            return;
        }
        let date = new Date();
        let startTime;
        let endTime = endOfDay(date).getTime();
        if (typeof currentTimeRange === 'string') {
            switch (currentTimeRange) {
                case '1_day':
                    startTime = startOfDay(date).getTime();
                    break;
                case '1_week':
                    startTime = startOfWeek(date).getTime()
                    break;
                case '1_month':
                    startTime = startOfMonth(date).getTime();
                    break;
                case '3_month':
                    date = date.setMonth(date.getMonth() - 3);
                    startTime = startOfDay(date).getTime();
                    break;
                default:
                    break
            }
        } else {
            startTime = startOfDay(new Date(currentTimeRange[0])).getTime();
            endTime = endOfDay(new Date(currentTimeRange[1])).getTime();
        }
        onFilter({ startTime, endTime, ...(incomeType !== 'ALL' ? { incomeType: incomeType } : {}) });
    }

    const _onReset = () => {
        setIncomeType('ALL');
        onChange('');
        onReset();
    }

    const _incomeType = useMemo(() => {
        if (!Array.isArray(arrCate)) return null;
        return arrCate.find(i => i.id === incomeType);
    }, [incomeType, arrCate])

    return (
        <div className='px-5 flex items-center font-medium text-xs text-txtSecondary dark:text-txtSecondary-dark select-none'>
            <div
                onClick={() => onChange('1_day')}
                className={classNames(
                    'px-2 h-[20px] rounded-md mr-2 cursor-pointer',
                    {
                        'bg-gray-5 dark:bg-darkBlue-4':
                            currentTimeRange === '1_day',
                    }
                )}
            >
                1 Day
            </div>
            <div
                onClick={() => onChange('1_week')}
                className={classNames(
                    'px-2 h-[20px] rounded-md mr-2 cursor-pointer',
                    {
                        'bg-gray-5 dark:bg-darkBlue-4':
                            currentTimeRange === '1_week',
                    }
                )}
            >
                1 Week
            </div>
            <div
                onClick={() => onChange('1_month')}
                className={classNames(
                    'px-2 h-[20px] rounded-md mr-2 cursor-pointer',
                    {
                        'bg-gray-5 dark:bg-darkBlue-4':
                            currentTimeRange === '1_month',
                    }
                )}
            >
                1 Month
            </div>
            <div
                onClick={() => onChange('3_month')}
                className={classNames(
                    'px-2 h-[20px] rounded-md cursor-pointer',
                    {
                        'bg-gray-5 dark:bg-darkBlue-4':
                            currentTimeRange === '3_month',
                    }
                )}
            >
                3 Month
            </div>
            <div className='flex items-center ml-5 custom_ant_datepicker mr-2'>
                <span className='mr-1.5'>Time</span>
                <RangePicker
                    bordered={false}
                    separator='to'
                    placeholder={['DD-MM-YYYY', 'DD-MM-YYYY']}
                    format='DD-MM-YYYY'
                    value={Array.isArray(currentTimeRange) ? currentTimeRange : []}
                    onChange={(date) => onChange(date)}
                />
            </div>
            {Array.isArray(arrCate) &&
                <Popover className="relative">
                    {({ open, close }) => (
                        <>
                            <Popover.Button >
                                <div className="px-[8px] flex items-center py-[1px] mr-2 text-xs font-medium cursor-pointer hover:opacity-80 rounded-md">
                                    {_incomeType?.name}
                                    <ChevronDown size={16} className="ml-1" />
                                </div>
                            </Popover.Button>
                            <Transition
                                as={Fragment}
                                enter="transition ease-out duration-200"
                                enterFrom="opacity-0 translate-y-1"
                                enterTo="opacity-100 translate-y-0"
                                leave="transition ease-in duration-150"
                                leaveFrom="opacity-100 translate-y-0"
                                leaveTo="opacity-0 translate-y-1"
                            >
                                <Popover.Panel className="absolute left-0 z-50 bg-white">
                                    <div className="min-w-[134px] pl-[12px] py-[8px] shadow-onlyLight font-medium text-xs flex flex-col">
                                        {arrCate.map(item => (
                                            <span onClick={() => {
                                                setIncomeType(item.id)
                                                close()
                                            }} key={item.id} className={`text-darkBlue py-[1px] my-[2px] hover:text-teal cursor-pointer ${_incomeType?.id === item.id ? '!text-teal' : ''}`}>{item.name}</span>
                                        ))}
                                    </div>
                                </Popover.Panel>
                            </Transition>
                        </>
                    )}
                </Popover>
            }
            {onFilter &&
                <div
                    onClick={_onFilter}
                    className="px-[8px] flex items-center py-[1px] mr-2 text-xs font-medium bg-bgSecondary dark:bg-bgSecondary-dark dark:text-white cursor-pointer hover:opacity-80 rounded-md">
                    <img className='w-[12px] h-[12px]' src={getS3Url("/images/icon/ic_search.png")} />&nbsp; Search
                </div>
            }
            {onReset &&
                <div
                    onClick={_onReset}
                    className="px-[8px] flex py-[1px] mr-2 text-xs font-medium bg-bgSecondary dark:bg-bgSecondary-dark dark:text-white cursor-pointer hover:opacity-80 rounded-md">
                    Reset
                </div>
            }
        </div>
    )
})

export default FuturesTimeFilter
