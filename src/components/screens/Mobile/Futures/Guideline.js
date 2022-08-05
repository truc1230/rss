import React, { useEffect, useMemo, useRef } from 'react';
import Tour from 'reactour';
import colors from 'styles/colors';
import { useTranslation } from 'next-i18next';
import styled from 'styled-components';
import { X } from 'react-feather';
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';
import { getS3Url } from 'redux/actions/utils';

const Guideline = ({pair, start, setStart, isFullScreen}) => {
    const {t} = useTranslation();
    const step = useRef(0);
    const refGuide = useRef(null)

    useEffect(() => {
        // if (pair) setStart(true);
    }, [pair])

    const getCurrentStep = (e) => {
        step.current = e;
    }

    useEffect(() => {
        const vh = window.innerHeight * 0.01;
        const order = document.querySelector('#futures-mobile')
        if (!order) return;
        if (start) {
            order.style.height = window.innerHeight + 'px';
        } else {
            order.style.height = vh * 100 + 'px'
        }
    }, [start])

    const tourConfig = useMemo(() => {
        return [
            {
                selector: '[data-tut="order-symbol"]',
                content: (props) => <Content {...props} top onClose={onClose}/>,
                position: 'bottom'
            },
            {
                selector: '[data-tut="order-side"]',
                content: (props) => <Content {...props} onClose={onClose}/>,
            },
            {
                selector: '[data-tut="order-type"]',
                content: (props) => <Content {...props} onClose={onClose}/>,
            },
            {
                selector: '[data-tut="order-leverage"]',
                content: (props) => <Content {...props} onClose={onClose}/>,
            },
            {
                selector: '[data-tut="order-volume"]',
                content: (props) => <Content {...props} onClose={onClose}/>,
            },
            {
                selector: '[data-tut="order-sl"]',
                content: (props) => <Content {...props} onClose={onClose}/>,
                highlightedSelectors: ['[data-tut="order-tp"]'],
                position: !isFullScreen ? [15, 0] : ''
            },
            {
                selector: '[data-tut="order-adjust-btn"]',
                content: (props) => <Content {...props} onClose={onClose}/>,
                position: !isFullScreen ? [15, 0] : ''
            },
            {
                selector: '[data-tut="order-button"]',
                content: (props) => <Content {...props} onClose={onClose}/>,
                position: !isFullScreen ? [15, 0] : 'top'
            }
        ]
    }, [isFullScreen])

    const onClose = (e) => {
        if (!e) {
            if (refGuide.current.state.current === tourConfig.length - 1) {
                setStart(false);
            } else {
                refGuide.current.nextStep()
            }
        } else {
            setStart(false);
        }
    }

    return (
        <Tour
            onRequestClose={() => onClose(false)}
            steps={tourConfig}
            isOpen={start}
            showCloseButton={false}
            maskClassName="guideline"
            rounded={5}
            startAt={0}
            disableInteraction
            disableKeyboardNavigation
            accentColor={colors.teal}
            getCurrentStep={getCurrentStep}
            showNavigation={false}
            showButtons={false}
            showNumber={false}
            scrollDuration="300"
            ref={refGuide}
            onAfterOpen={disableBodyScroll}
            onBeforeClose={enableBodyScroll}
            // inViewThreshold={100}
        />
    );
};

const Content = ({title, text, step, onClose, top, goTo, ...props}) => {
    const {t} = useTranslation();
    return (
        <div className="flex flex-col items-center font-inter justify-center" onClick={() => onClose(false)}>
            {top && <img className="m-auto" src={getS3Url("/images/icon/ic_guide_arrow_onus.png")} width={10}/>}
            <div className='relative'>
                <View id={`guideline-step-${step}`}>
                    <div className="flex items-center justify-between">
                        <label
                            className="text-onus-base font-semibold text-sm">{t(`futures:mobile:guide:step_title_${step}`)}</label>
                        <div className='cursor-pointer text-white' onClick={() => onClose(true)}>
                            <X width={20}/>
                        </div>
                    </div>
                    <div
                        className="mt-[8px] mb-[16px] text-onus-white text-xs">{t(`futures:mobile:guide:step_${step}`)}</div>
                    <div className="flex items-center justify-between font-medium text-white">
                        <div className='text-sm text-onus-white'>{t('futures:mobile:guide:step')} {step + '/'}<span
                            className="text-[10px]">8</span></div>
                    </div>
                </View>
                <div
                    className='absolute bottom-6 right-4 min-w-[60px] px-[10px] bg-onus-base rounded-[4.33333px] text-center text-[10px] text-onus-white'
                    onClick={() => step === 8 && onClose(true)}>
                    {t(step === 8 ? 'common:close' : 'futures:mobile:guide:next')}
                </div>
            </div>

            {!top && <img className="m-auto rotate-180" src={getS3Url("/images/icon/ic_guide_arrow_onus.png")} width={10}/>}
        </div>
    )
}

const View = styled.div.attrs({
    className: 'my-[10px] bg-onus-bgModal3 font-inter flex flex-col justify-between'
})`
    width: 294px;
${'' /* background-color:${colors.darkBlue1}; */}
    border: 1px solid ${colors.onus.base};
    opacity: 0.8;
    border-radius: 8px;
    padding: 16px;
`

export default Guideline;
