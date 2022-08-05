import React, {useCallback, useEffect, useMemo, useState} from "react";
import Portal from "components/hoc/Portal";
import {PORTAL_MODAL_ID} from "constants/constants";
import {
    addDays,
    addMonths,
    eachDayOfInterval,
    eachMonthOfInterval,
    eachWeekOfInterval,
    endOfMonth, endOfWeek,
    format, isAfter, isBefore, isSameDay, isSameMonth,
    startOfMonth, startOfWeek
} from "date-fns";
import classNames from "classnames";
import {useTranslation} from "next-i18next";

const now = new Date()

const WEEKS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']

const config = {
    start: addMonths(now, -3 * 12),
    end: addMonths(now, 2)
}

const months = eachMonthOfInterval({
    start: config.start,
    end: config.end
})

function DateRangePicker({visible, value, onClose, onChange}) {
    const [range, setRange] = useState({
        start: null,
        end: null
    })

    const {t} = useTranslation()

    useEffect(() => {
        if (!visible) return
        const scrollToId = format(range.start ? range.start : now, 'M-yyyy')
        const currentMonthElement = document.getElementById(scrollToId)
        if (currentMonthElement) currentMonthElement.scrollIntoView()
    }, [visible])

    const _onOK = () => {
        onChange(range)
        onClose()
    }

    const _onCancel = () => {
        setRange(value)
        onClose()
    }

    return <Portal portalId={PORTAL_MODAL_ID}>
        <div className={classNames('fixed inset-0 bg-onus z-20 p-4', {
            hidden: !visible
        })}>
            <div className='w-full h-full overflow-y-auto pb-14'>
                {months.map((m, index) => {
                    return <Month key={index} range={range} setRange={setRange} date={addDays(m, -1)}/>
                })}
            </div>
            <div className='bg-onus absolute bottom-4 inset-x-0 px-4 pt-1 grid grid-cols-2 gap-2 font-semibold'>
                <div
                    className='h-12 flex justify-center items-center rounded bg-onus-line text-onus-grey'
                    onClick={_onCancel}
                >{t('futures:mobile:transaction_histories:cancel')}</div>
                <div
                    className='h-12 flex justify-center items-center rounded bg-onus-base'
                    onClick={_onOK}
                >{t('futures:mobile:transaction_histories:done')}</div>
            </div>
        </div>
    </Portal>
}

const Month = ({date, range, setRange}) => {
    const start = startOfMonth(date)
    const end = endOfMonth(date)
    const weekDays = useMemo(() => {
        return eachWeekOfInterval({start, end}).map(w => {
            return eachDayOfInterval({
                start: startOfWeek(w),
                end: endOfWeek(w),
            })
        })
    }, [date])

    return <div id={format(date, 'M-yyyy')} className='mt-6'>
        <div className='text-center font-semibold text-onus-base mb-3'>{format(date, 'LLLL yyyy')}</div>
        <div className='grid grid-cols-7 gap-y-2'>
            {WEEKS.map((w, index) => <div key={index}
                                          className='capitalize text-xs text-onus-grey text-center mb-2'>{w}</div>)}
            {weekDays.map(days => days.map((day, index) => {
                if (isBefore(day, start) || isAfter(day, end)) {
                    return <div key={index}/>
                }
                return <Day key={index} day={day} range={range} setRange={setRange}/>
            }))}
        </div>
    </div>
}

function Day({day, range, setRange}) {
    const disabled = isAfter(day, now)
    const inRange = isAfter(day, range.start) && isBefore(day, range.end)
    const isSelected = useMemo(() => {
        if ((range.start && !range.end) || (range.end && !range.start)) {
            return isSameDay(day, range.start || range.end)
        }
    }, [range])
    const isStart = isSameDay(day, range.start)
    const isEnd = isSameDay(day, range.end)

    const _handleChangeRange = () => {
        if (disabled) return
        if (range.start && range.end) {
            setRange({start: day})
        } else if (range.start && !range.end) {
            if (isSameDay(day, range.start)) {
                setRange({start: null, end: null})
            } else if (isBefore(day, range.start)) {
                setRange({start: day, end: range.start})
            } else {
                setRange({start: range.start, end: day})
            }
        } else if (!range.start && !range.end) {
            setRange({start: day})
        }
    }

    return <div
        onClick={_handleChangeRange}
        className={classNames('text-center text-onus-white text-sm h-full py-1', {
            '!text-onus-grey': disabled,
            'text-onus-green': isSameDay(day, now),
            'bg-onus-green/[.2]': inRange,
            'bg-onus-base rounded-full !text-onus-white': isSelected,
            'rounded-l-full !bg-onus-base': isStart,
            'rounded-r-full !bg-onus-base !text-onus-white': isEnd,
        })}>
        {format(day, 'd')}
    </div>
}

export default React.memo(DateRangePicker, (prev, next) => {
    return prev.visible === next.visible
})
