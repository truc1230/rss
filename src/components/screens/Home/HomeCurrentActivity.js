import { useKeenSlider } from 'keen-slider/react';
import { useEffect, useRef, useState } from 'react';
import { useWindowSize } from 'utils/customHooks';
import { useTranslation } from 'next-i18next';

import 'keen-slider/keen-slider.min.css';
import { formatTime, formatWallet } from 'redux/actions/utils';

const HomeCurrentActivity = () => {
    // Initial State
    const [state, set] = useState({
        autoplay: true,
        phake: null
    })
    const setState = (state) => set(prevState => ({...prevState, ...state}))

    const { width } = useWindowSize()
    const { t } = useTranslation(['home', 'common'])

    // Inital Keen Slider
    const [sliderRef, slider] = useKeenSlider({
        slidesPerView: 1,
        centered: true,
        vertical: true,
        loop: true,
        // dragStart: () => setState({autoplay: false}),
        // dragEnd: () => setState({autoplay: true})
    })
    const timer = useRef()

    const phake = useRef(makeData(35)).current

    // Render Handler
    const renderActivityItem = () => {
        if (!phake || !Array.isArray(phake)) return null
        // log.d(phake)
        return phake.map((item, i) => {
            const phake = item
            return (
                <div key={`homepage_user_activity_${phake.token}_${i}`} className="keen-slider__slide homepage-activity__slide__item1">
                    <div className="homepage-activity__item___wrapper">
                        <div className="homepage-activity__item__inner">
                            <div className="homepage-activity__item__inner___text value-dominant">
                                {phake.code}
                            </div>
                            <div className="homepage-activity__item__inner___label">
                                Nami ID
                            </div>
                        </div>
                        <div className="homepage-activity__item__inner specific__case">
                            <div className="homepage-activity__item__inner___text text-dominant">
                                {phake.type === 'DEP' ? t('common:deposit') : t('common:withdraw')}
                            </div>
                            <div className="homepage-activity__item__inner___label">
                                {t('home:user_activity.trading_type')}
                            </div>
                        </div>
                        <div className="homepage-activity__item__inner">
                            <div className="homepage-activity__item__inner___text text-dominant">
                                {t('common:success')}
                            </div>
                            <div className="homepage-activity__item__inner___label">
                                {t('home:user_activity.status')}
                            </div>
                        </div>
                        <div className="homepage-activity__item__inner">
                            <div className="homepage-activity__item__inner___text text-dominant">
                                <span className="uppercase">{phake.symbol}</span> Token
                            </div>
                            <div className="homepage-activity__item__inner___label">
                                {t('home:user_activity.token_name')}
                            </div>
                        </div>
                        <div className="homepage-activity__item__inner">
                            <div className="homepage-activity__item__inner___text text-dominant">
                                {phake.amount}
                            </div>
                            <div className="homepage-activity__item__inner___label">
                                {t('home:user_activity.quantity')}
                            </div>
                        </div>
                        <div className="homepage-activity__item__inner">
                            <div className="homepage-activity__item__inner___text text-dominant">
                                {phake.time}
                            </div>
                            <div className="homepage-activity__item__inner___label">
                                {t('home:user_activity.time')}
                            </div>
                        </div>
                    </div>
                </div>
            )
        })
    }

    useEffect(() => {
        sliderRef.current.addEventListener("mouseover", () => {
            setState({ autoplay: false })
        })
        sliderRef.current.addEventListener("mouseout", () => {
            setState({ autoplay: true })
        })
    }, [sliderRef])

    useEffect(() => {
        timer.current = setInterval(() => state.autoplay && slider && slider.next(), 2800)
        return () => clearInterval(timer.current)
    }, [state.autoplay, slider])

    useEffect(() => {
        width && slider && slider.resize()
    }, [width, slider])

    return (
        <section className="homepage-activity">
            <div className="homepage-activity___wrapper mal-container">
                <div ref={sliderRef} className="keen-slider">
                    {renderActivityItem()}
                </div>
            </div>
        </section>
    )
}

const makeData = (length) => {
    const _ = []

    for (let i = 0; i < length; ++i) {
        const code = `Nami${makeCode()}`
        const type = Math.random() < 1 / 2 ? 'DEP' : 'WDL'
        const status = 'success'
        const token = TOKEN[Math.floor(Math.random() * TOKEN.length)];

        const symbol =  token.token
        const amount = Math.random() * (token.amountRange[1] - token.amountRange[0] + 1)

        const time = Date.now() - [2003000, 1000000, 900000, 1230000, 300000][Math.floor(Math.random() * 5)]

        _.push({
            code,
            type,
            status,
            symbol,
            amount: formatWallet(amount, 0),
            time: formatTime(time, 'HH:mm dd-MM-yyyy')
        })
    }

    return _
}

function makeCode(lengthArr = [3, 3, 3]) {
    let result = ''

    const number = '0123456789'
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'

    for (let i = 0; i < lengthArr[0]; i++) {
        result += number.charAt(Math.floor(Math.random() * number.length))
    }

    // for (let i = 0; i < lengthArr[1]; i++) {
        // result += characters.charAt(Math.floor(Math.random() * characters.length))
        result += '****'
    // }

    for (let i = 0; i < lengthArr[2]; i++) {
        result += number.charAt(Math.floor(Math.random() * number.length))
    }

    return result
}

const TOKEN = [
    { token: 'nami', amountRange: [100, 10000] },
    { token: 'kai', amountRange: [10, 1200] },
    { token: 'vndc', amountRange: [100000, 200000000] },
    { token: 'eth', amountRange: [0.01, 2] },
    { token: 'btc', amountRange: [0.00001, 1] },
    { token: 'atlas', amountRange: [100, 1200] },
    { token: 'axs', amountRange: [2.5, 50] },
    { token: 'sand', amountRange: [10, 100] },
    { token: 'rune', amountRange: [5, 80] },
    { token: 'near', amountRange: [5, 100] },
    { token: 'slp', amountRange: [1000, 10000] },
    { token: 'mana', amountRange: [10, 90] },
    { token: 'dot', amountRange: [3.5, 250] },
    { token: 'ldpi', amountRange: [10000, 100000] },
    { token: 'doge', amountRange: [1000, 15000] },

]

export default HomeCurrentActivity
