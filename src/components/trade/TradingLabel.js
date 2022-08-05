import classNames from 'classnames';

const TradingLabel = ({
    useColon = false,
    label = '--',
    value = '--',
    valueLoading,
    containerClassName = '',
    valueClassName = '',
    labelClassName = ''
}) => {
    return (
        <div className={classNames('font-medium text-sm', containerClassName)}>
            <span className={`mr-1 text-txtSecondary dark:text-txtSecondary-dark ${labelClassName}`}>
                {label}
                {useColon && ':'}
            </span>
            <span className={valueClassName}>{value}</span>
        </div>
    )
}

export default TradingLabel
