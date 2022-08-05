import cn from 'classnames'
import PropTypes from 'prop-types'

function Tag({ className = '', type, children, onClick }) {
    return (
        <span
            className={cn(className, 'rounded text-xs py-1 px-4 font-medium', {
                'bg-teal text-white': type === 'primary',
                'bg-gray-4 text-gray-1': !type,
                'cursor-pointer': !!onClick,
            })}
            onClick={onClick}
        >
            {children}
        </span>
    )
}

Tag.propTypes = {
    className: PropTypes.string,
    children: PropTypes.node,
    type: PropTypes.oneOf(['primary', '']),
    onClick: PropTypes.func,
}

export default Tag
