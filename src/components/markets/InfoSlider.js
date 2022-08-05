import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'react-feather';
import classNames from 'classnames';

const DIRECTION = {
    PREV: 'prev',
    NEXT: 'next',
}

const InfoSlider = ({
    forceUpdateState,
    children,
    gutter = 12,
    className,
    containerClassName,
    gradientColor,
}) => {
    const [rightControllable, setRightControllable] = useState(false)
    const [leftControllable, setLeftControllable] = useState(false)

    let scrollStepSize = 80
    const containerRef = useRef()
    const ref = useRef()

    // Action
    const onScroll = (scrollStep) =>
        ref?.current?.scrollTo({
            left: ref.current?.scrollLeft + scrollStep,
            behavior: 'smooth',
        })

    // Helper
    const watchingScrollPosition = () => {
        const position = ref.current?.scrollLeft || 0
        position <= 0 ? setLeftControllable(false) : setLeftControllable(true)

        ref?.current?.offsetWidth + position >= ref.current?.scrollWidth &&
        position >= gutter
            ? setRightControllable(false)
            : setRightControllable(true)
    }

    useEffect(() => {
        const position = ref.current?.scrollLeft || 0
        const childNodes = ref.current?.childNodes

        // Init right controllable state
        if (
            !(
                ref?.current?.offsetWidth + position >=
                    ref.current?.scrollWidth && position >= gutter
            )
        ) {
            setRightControllable(true)
        }

        if (childNodes?.length && ref.current?.scrollWidth !== undefined) {
            // Create scroll step size
            scrollStepSize = ref.current?.scrollWidth / childNodes.length
        }

        // On scroll handling
        ref?.current?.addEventListener('scroll', watchingScrollPosition)

        return () =>
            ref?.current?.removeEventListener('scroll', watchingScrollPosition)
    }, [])

    useEffect(() => {
        if (ref?.current?.scrollWidth) {
            if (
                ref.current.scrollWidth <=
                containerRef?.current?.clientWidth - gutter
            ) {
                setRightControllable(false)
            } else {
                setRightControllable(true)
            }
        }
    }, [forceUpdateState, gutter])

    return (
        <div
            ref={containerRef}
            className={classNames(
                'flex items-center overflow-hidden',
                className
            )}
        >
            <div
                onClick={() => onScroll(-scrollStepSize)}
                style={{
                    background: `linear-gradient(to right, ${gradientColor} 42.24%, transparent 95.69%)`,
                }}
                className={classNames(
                    'min-w-[24px] h-full min-h-[45px] flex items-center justify-center invisible cursor-pointer pointer-events-none hover:text-dominant',
                    { '!visible !pointer-events-auto': leftControllable }
                )}
            >
                <ChevronLeft size={14} />
            </div>
            <div
                ref={ref}
                className={classNames(
                    'flex items-center overflow-x-auto no-scrollbar',
                    containerClassName
                )}
            >
                {children}
            </div>
            <div
                onClick={() => onScroll(scrollStepSize)}
                style={{
                    background: `linear-gradient(to left, ${gradientColor} 42.24%, transparent 95.69%)`,
                }}
                className={classNames(
                    'min-w-[24px] h-full min-h-[45px] flex items-center justify-center invisible cursor-pointer pointer-events-none hover:text-dominant',
                    { '!visible !pointer-events-auto': rightControllable }
                )}
            >
                <ChevronRight size={14} />
            </div>
        </div>
    )
}

export default InfoSlider
