import classNames from 'classnames';

const Divider = ({ className }) => (
    <div
        className={classNames(
            'w-full h-[1px] bg-divider dark:bg-divider-dark',
            className
        )}
    />
)

export default Divider
