import { useEffect, useMemo, useRef } from 'react';
import { Active, Dot, DotContainer, SliderBackground, Thumb, Track, } from './StyleInputSlider';
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';
import classNames from 'classnames';
import colors from 'styles/colors';
import Hexagon from 'components/screens/Mobile/Wallet/Hexagon';

function getClientPosition(e) {
    const {touches} = e

    if (touches && touches.length) {
        const finger = touches[0]
        return {
            x: finger.clientX,
            y: finger.clientY,
        }
    }

    return {
        x: e.clientX,
        y: e.clientY,
    }
}

const Slider = ({
                    disabled,
                    axis,
                    x,
                    y,
                    xmin,
                    xmax,
                    ymin,
                    ymax,
                    xstep,
                    ystep,
                    onChange,
                    onDragStart,
                    onDragEnd,
                    leverage = false,
                    labelSuffix = '',
                    xStart = 0,
                }) => {
    const container = useRef(null)
    const handle = useRef(null)
    const start = useRef({})
    const offset = useRef({})
    const BIAS = 8
    const _xStart = useRef(xStart)

    const [currentTheme] = useDarkMode()
    const isDark = currentTheme === THEME_MODE.DARK

    function getPosition() {
        let top = ((y - ymin) / (ymax - ymin)) * 100
        let left = ((x - xmin) / (xmax - xmin)) * 100 + _xStart.current
        _xStart.current = 0
        if (top > 100) top = 100
        if (top < 0) top = 0
        if (axis === 'x') top = 0

        if (left > 100) left = 100
        if (left < 0) left = 0
        if (axis === 'y') left = 0

        return {top, left}
    }

    function change({top, left}) {
        if (!onChange) return

        const {width, height} = container.current.getBoundingClientRect()
        let dx = 0
        let dy = 0

        if (left < 0) left = 0
        if (left > width) left = width
        if (top < 0) top = 0
        if (top > height) top = height

        // Lam tron voi cac gia tri %25

        const largeStep = Math.round(left / (width / 4))
        const bias = Math.abs((width * largeStep) / 4 - left)

        if (axis === 'x' || axis === 'xy') {
            dx = (left / width) * (xmax - xmin)
        }

        if (axis === 'y' || axis === 'xy') {
            dy = (top / height) * (ymax - ymin)
        }

        let x = (dx !== 0 ? parseInt(dx / xstep, 10) * xstep : 0) + xmin
        const y = (dy !== 0 ? parseInt(dy / ystep, 10) * ystep : 0) + ymin

        if (leverage && bias < BIAS) {
            x = largeStep * 25
        }

        onChange({x, y})
    }

    function handleMouseDown(e) {
        if (disabled) return

        e.preventDefault()
        e.stopPropagation()
        e.nativeEvent.stopImmediatePropagation()
        const dom = handle.current
        const clientPos = getClientPosition(e)

        start.current = {
            x: dom.offsetLeft,
            y: dom.offsetTop,
        }

        offset.current = {
            x: clientPos.x,
            y: clientPos.y,
        }

        document.addEventListener('mousemove', handleDrag)
        document.addEventListener('mouseup', handleDragEnd)
        document.addEventListener('touchmove', handleDrag, {passive: false})
        document.addEventListener('touchend', handleDragEnd)
        document.addEventListener('touchcancel', handleDragEnd)

        if (onDragStart) {
            onDragStart(e)
        }
    }

    function getPos(e) {
        const clientPos = getClientPosition(e)
        const left = clientPos.x + start.current.x - offset.current.x
        const top = clientPos.y + start.current.y - offset.current.y

        return {left, top}
    }

    function handleDrag(e) {
        if (disabled) return

        e.preventDefault()
        change(getPos(e))
    }

    function handleDragEnd(e) {
        if (disabled) return

        e.preventDefault()
        document.removeEventListener('mousemove', handleDrag)
        document.removeEventListener('mouseup', handleDragEnd)

        document.removeEventListener('touchmove', handleDrag, {
            passive: false,
        })
        document.removeEventListener('touchend', handleDragEnd)
        document.removeEventListener('touchcancel', handleDragEnd)

        if (onDragEnd) {
            onDragEnd(e)
        }
    }

    function handleTrackMouseDown(e) {
        if (disabled) return

        e.preventDefault()
        const clientPos = getClientPosition(e)
        const rect = container.current.getBoundingClientRect()

        start.current = {
            x: clientPos.x - rect.left,
            y: clientPos.y - rect.top,
        }

        offset.current = {
            x: clientPos.x,
            y: clientPos.y,
        }

        document.addEventListener('mousemove', handleDrag)
        document.addEventListener('mouseup', handleDragEnd)
        document.addEventListener('touchmove', handleDrag, {passive: false})
        document.addEventListener('touchend', handleDragEnd)
        document.addEventListener('touchcancel', handleDragEnd)

        change({
            left: clientPos.x - rect.left,
            top: clientPos.y - rect.top,
        })

        if (onDragStart) {
            onDragStart(e)
        }
    }

    useEffect(() => {
        _xStart.current = xStart
    }, [])

    const pos = useMemo(() => {
        return getPosition()
    }, [x])

    const valueStyle = {}
    if (axis === 'x') {
        valueStyle.width = pos.left + '%'
    }
    if (axis === 'y') valueStyle.height = pos.top + '%'
    const handleStyle = {
        borderRadius: '50%',
        zIndex: 20,
        position: 'absolute',
        transform: 'translate(-50%, -50%)',
        left: pos.left + '%',
        top: pos.top + '%',
    }

    if (axis === 'x') {
        handleStyle.top = '50%'
    } else if (axis === 'y') {
        handleStyle.left = '50%'
    }

    const renderDotAndLabel = () => {
        let dotStep = 15
        const dot = []
        const label = []
        if (xmax % 5 === 0) dotStep = 5
        if (xmax > 10 && xmax % 10 === 0) dotStep = 10
        if (xmax > 15 && xmax % 15 === 0) dotStep = 15
        if (xmax > 25 && xmax % 25 === 0) dotStep = 25
        const _dots = xmax / dotStep
        const size = 100 / _dots

        for (let i = 0; i <= _dots; ++i) {
            const labelX = (i * dotStep).toFixed(0)
            const valueX = (i * dotStep).toFixed(0)
            const active = pos.left >= i * size
            dot.push(
                <Dot key={`inputSlider_dot_${i}`} percentage={i * size}>
                    <Hexagon
                        size={10}
                        fill={isDark ? colors.darkBlue1 : colors.white}
                        stroke={active ? colors.teal : isDark ? colors.darkBlue4 : colors.grey3}
                        strokeWidth={2}
                    />
                </Dot>
            )

            label.push(
                <div className='relative' key={`inputSlider_label_${i}`}>
                    <span
                        onClick={() => {
                            onChange && onChange({x: valueX})
                        }}
                        className={classNames(
                            'block absolute font-medium text-xs text-txtSecondary dark:text-txtSecondary-dark select-none cursor-pointer',
                            {
                                'left-1/2 -translate-x-1/2':
                                    i > 0 && i !== _dots,
                                '-left-1/2 translate-x-[-80%]': i === _dots,
                            }
                        )}
                    >
                        {labelX}
                        {labelSuffix}
                    </span>
                </div>
            )
        }

        return {dot, label}
    }

    return (
        <>
            <Track
                ref={container}
                onTouchStart={handleTrackMouseDown}
                onMouseDown={handleTrackMouseDown}
            >
                <Active style={valueStyle}/>
                <SliderBackground isDark={currentTheme === THEME_MODE.DARK}/>
                <DotContainer>{renderDotAndLabel()?.dot}</DotContainer>
                <div
                    ref={handle}
                    style={handleStyle}
                    onTouchStart={handleMouseDown}
                    onMouseDown={handleMouseDown}
                    onClick={function (e) {
                        e.stopPropagation()
                        e.nativeEvent.stopImmediatePropagation()
                    }}
                >
                    <Thumb
                        isZero={pos.left === 0}
                        isDark={currentTheme === THEME_MODE.DARK}
                    >
                        <Hexagon
                            className='absolute'
                            size={18}
                            fill={isDark ? colors.darkBlue1 : colors.white}
                            stroke={colors.teal}
                            strokeWidth={2}
                        />
                    </Thumb>
                </div>
            </Track>
            <div className='relative w-full flex items-center justify-between'>
                {renderDotAndLabel()?.label}
            </div>
            <div className='h-[12px] w-full'/>
        </>
    )
}

Slider.defaultProps = {
    disabled: false,
    axis: 'x',
    x: 50,
    xmin: 0,
    xmax: 100,
    y: 50,
    ymin: 0,
    ymax: 100,
    xstep: 1,
    ystep: 1,
    styles: {},
}

export default Slider
