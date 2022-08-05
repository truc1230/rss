import { memo, useCallback, useMemo } from 'react';

const Button = memo((props) => {
    // Own Props
    const {
        title,
        style,
        color,
        href = '/',
        componentType = 'link',
        type,
        onClick,
        disabled,
        className = '',
        target = '',
        onusMode = false,
    } = props

    const disabledStyle = useMemo(() => {
        if (type === 'disabled' || disabled)
            return '!pointer-events-none !bg-gray-2 !dark:bg-darkBlue-3'
        return ''
    }, [type, disabled])

    const render = useCallback(() => {
        if (componentType === 'link') {
            return (
                <a
                    href={href}
                    style={{ ...style, display: 'block', background: color }}
                    target={target}
                    className={`mal-button ${
                        type === 'primary'
                            ? `${onusMode ? 'bg-onus-base text-onus-textPrimary': 'bg-bgBtnPrimary text-txtBtnPrimary'}`
                            : `${onusMode ? 'bg-onus-bg2 text-onus-textPrimary dark:bg-onus-bg2 dark:text-onus-textPrimary': 'bg-bgBtnSecondary text-txtBtnSecondary dark:bg-bgBtnSecondary-dark dark:text-txtBtnSecondary-dark'}`
                    } ${disabledStyle} ${className}`}
                >
                    {title || 'TITLE_NOT_FOUND'}
                </a>
            )
        }

        if (componentType === 'button') {
            return (
                <button
                    style={{ ...style, background: color }}
                    className={`mal-button ${
                        type === 'primary'
                            ? `${onusMode ? 'bg-onus-base text-onus-textPrimary': 'bg-bgBtnPrimary text-txtBtnPrimary'}`
                            : `${onusMode ? 'bg-onus-bg2 text-onus-textPrimary dark:bg-onus-bg2 dark:text-onus-textPrimary': 'bg-bgBtnSecondary text-txtBtnSecondary dark:bg-bgBtnSecondary-dark dark:text-txtBtnSecondary-dark'}`
                    } ${disabledStyle} ${className}
                    ${disabled && onusMode ? '!bg-onus-base opacity-30' : ''}
                    `}
                    onClick={() => onClick && !disabled && onClick()}
                >
                    {title || 'TITLE_NOT_FOUND'}
                </button>
            )
        }

        return null
    }, [href, title, componentType, type, onClick, disabled, color, style, target, className])

    return render()
})

export default Button
