import classNames from 'classnames';

const FuturesPairDetailItem = ({
    label = 'Label',
    value = '--',
    containerClassName,
    labelClassName,
    valueClassName,
}) => {
    return (
        <div className={classNames('w-auto font-medium', containerClassName)}>
            <div
                className={classNames(
                    'font-medium text-[10px] text-txtSecondary dark:text-txtSecondary-dark whitespace-nowrap select-none',
                    labelClassName
                )}
            >
                {label}
            </div>
            <div
                className={classNames(
                    'text-xs whitespace-nowrap',
                    valueClassName
                )}
            >
                {value}
            </div>
        </div>
    )
}

export default FuturesPairDetailItem
