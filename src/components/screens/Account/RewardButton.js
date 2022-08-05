import { memo, useMemo } from 'react';
import { useTranslation } from 'next-i18next';

const RewardButton = memo(({ title, status, buttonStyles = '', href, target = "_self", onClick, componentType = 'div' }) => {

    const { t } = useTranslation()

    const passive = useMemo(() => {
        const originClass = 'min-h-[32px] px-4 flex items-center justify-center rounded font-medium text-xs sm:text-sm text-center cursor-pointer '
        let className = ''
        let title = t('reward-center:claim')

        switch (status) {
            case REWARD_BUTTON_STATUS.AVAILABLE:
                className = originClass + 'text-dominant border border-dominant bg-bgContainer dark:bg-bgContainer-dark hover:opacity-80 '
                break
            case REWARD_BUTTON_STATUS.NOT_AVAILABLE:
            default:
                className = originClass + 'text-txtSecondary dark:text-txtSecondark-dark bg-gray-3 dark:bg-darkBlue-4 cursor-not-allowed'
                break
        }

        return {
            className,
            title
        }
    }, [status])

    if (componentType === 'a' || componentType === 'link') {
        return (
            <a href={href || '/'} target={target}
               className={passive?.className + ' ' + buttonStyles}
               onClick={e => e?.stopPropagation()}>
                {title}
            </a>
        )
    }

    if (componentType === 'div') {
        return (
            <div className={passive?.className + ' ' + buttonStyles}
                 onClick={() => status === REWARD_BUTTON_STATUS.AVAILABLE && onClick()}>
                {title}
            </div>
        )
    }
})

export const REWARD_BUTTON_STATUS = {
    AVAILABLE: 'AVAILABLE',
    NOT_AVAILABLE: 'NOT_AVAILABLE'
}

export default RewardButton
