import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';
import { useRef } from 'react';
import ReactTooltip from 'react-tooltip';
import styled from 'styled-components';
import colors from 'styles/colors';

const Tooltip = ({ children, ...restProps }) => {
    const [currentTheme] = useDarkMode()
    const ref = useRef()

    return (
        <TooltipWrapper isDark={currentTheme === THEME_MODE.DARK}>
            <ReactTooltip
                ref={ref}
                className='!text-txtPrimary dark:!text-txtPrimary-dark !bg-gray-3 dark:!bg-darkBlue-4 !rounded-lg !opacity-100'
                arrowColor={
                    currentTheme === THEME_MODE.DARK
                        ? colors.darkBlue4
                        : colors.grey3
                }
                place='left'
                effect='solid'
                {...restProps}
                afterShow={() => ref?.current?.updatePosition()}
            >
                {children}
            </ReactTooltip>
        </TooltipWrapper>
    )
}

const TooltipWrapper = styled.div`
    // .place-left {
    //   ::after {
    //     border-left-color: ${({ isDark }) =>
        isDark ? colors.darkBlue4 : colors.grey3} !important;
    //     border-top-color: transparent !important;
    //   }
    // }
    //
    // .__react_component_tooltip {
    //   ::after {
    //     border-top-color: ${({ isDark }) =>
        isDark ? colors.darkBlue4 : colors.grey3} !important;
    //   }
    // }
`

export default Tooltip
