import KlineChart from "components/KlineChart/KlineChart";
import ms from "ms";
import {listTimeFrame} from "components/KlineChart/kline.service";
import React, {useState} from "react";
import classNames from "classnames";

export default function KlineChartPage() {
    const [resolution, setResolution] = useState(ms('30m'))
    const [mainIndicator, setMainIndicator] = useState()
    const [subIndicator, setSubIndicator] = useState()
    // const [themeMode, switchTheme] = useDarkMode()

    // mainI: MA, EMA, BOLL
    // subI: VOL, MACD, RSI, KDJ

    return (
        <div className="">
            {/*<button onClick={() => switchTheme()}>{themeMode}</button>*/}
            <div>{ms(resolution)}</div>
            <div className='space-x-2'>
                {listTimeFrame.map(t => {
                    return <button key={t.value} onClick={() => setResolution(t.value)}>{t.text}</button>
                })}
            </div>
            <div className='space-x-2'>
                {['MA', 'EMA', 'BOLL'].map(t => {
                    return <button
                        className={classNames({'text-teal': mainIndicator === t})}
                        key={t}
                        onClick={() => setMainIndicator(mainIndicator === t ? '' : t)}>{t}</button>
                })}
            </div>
            <div className='space-x-2'>
                {['VOL', 'MACD', 'RSI', 'KDJ'].map(t => {
                    return <button
                        className={classNames({'text-teal': subIndicator === t})} key={t}
                        onClick={() => {
                            setSubIndicator(subIndicator === t ? '' : t)
                        }}>{t}</button>
                })}
            </div>
            <div className='flex flex-col w-full h-[40vh]'>

                <KlineChart
                    symbolInfo={{exchange: 'NAMI_FUTURES', symbol: 'BTCVNDC', pricePrecision: 2}}
                    resolution={resolution}
                    mainIndicator={mainIndicator}
                    subIndicator={subIndicator}
                />
            </div>
        </div>
    )
}
