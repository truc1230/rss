import classNames from 'classnames';
import { Check } from 'react-feather';

const CheckBox = ({
    active,
    boxContainerClassName,
    label,
    labelClassName,
    onChange,
    className,
    onusMode=false
}) => {
    const onCheck = () => onChange && onChange()
    return (
        <div className={classNames('flex items-center select-none', className)}>
            <div
                onClick={onCheck}
                className={classNames(
                    'w-[16px] h-[16px] flex items-center justify-center rounded-sm border border-divider dark:border-divider-dark cursor-pointer ',
                    {'hover:!border-dominant': !onusMode},
                    {'bg-onus-input !border-[#2B3247]': onusMode},
                    { '!bg-dominant border-dominant': !onusMode && active },
                    { '!bg-onus-base !border-onus-base': onusMode && active },
                    boxContainerClassName
                )}
            >
                {active && <Check size={14} className='text-white' />}
            </div>
            {label && (
                <div
                    className={classNames(
                        'ml-1.5 font-medium text-xs text-txtSecondary dark:text-txtSecondary-dark cursor-default',
                        labelClassName
                    )}
                >
                    {label}
                </div>
            )}
        </div>
    )
}

export default CheckBox
