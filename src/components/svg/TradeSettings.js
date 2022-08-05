import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';
import colors from 'styles/colors';

const TradeSetings = ({ color, size, fill, className, onClick }) => {
    const [theme] = useDarkMode()
    const isDark = theme === THEME_MODE.DARK

    return (
        <svg
            width={size || '16'}
            height={size || '16'}
            viewBox='0 0 16 16'
            fill={fill || 'none'}
            xmlns='http://www.w3.org/2000/svg'
            className={className || ''}
            onClick={() => onClick && onClick()}
        >
            <path
                d='M0.666016 5.33331H15.3327'
                stroke={color || isDark ? colors.grey2 : '#223050'}
                strokeLinecap='round'
                strokeLinejoin='round'
            />
            <path
                d='M0.666016 10.6667H15.3327'
                stroke={color || isDark ? colors.grey2 : '#223050'}
                strokeLinecap='round'
                strokeLinejoin='round'
            />
            <path
                d='M10.666 7.33331C11.7706 7.33331 12.666 6.43788 12.666 5.33331C12.666 4.22874 11.7706 3.33331 10.666 3.33331C9.56145 3.33331 8.66602 4.22874 8.66602 5.33331C8.66602 6.43788 9.56145 7.33331 10.666 7.33331Z'
                fill={isDark ? colors.darkBlue : 'white'}
                stroke={color || isDark ? colors.grey2 : '#223050'}
                strokeLinecap='round'
                strokeLinejoin='round'
            />
            <path
                d='M5.33398 12.6667C6.43855 12.6667 7.33398 11.7713 7.33398 10.6667C7.33398 9.56212 6.43855 8.66669 5.33398 8.66669C4.22941 8.66669 3.33398 9.56212 3.33398 10.6667C3.33398 11.7713 4.22941 12.6667 5.33398 12.6667Z'
                fill={isDark ? colors.darkBlue : 'white'}
                stroke={color || isDark ? colors.grey2 : '#223050'}
                strokeLinecap='round'
                strokeLinejoin='round'
            />
        </svg>
    )
}

export default TradeSetings
