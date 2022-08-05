import PropTypes from 'prop-types';
import colors from 'styles/colors';

function SortIcon({size = 14, color = '#C4C4C4', activeColor = colors.teal, direction }) {
    return <svg width={size} height={size} viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7 3L9.59808 6H4.40192L7 3Z" fill={direction === 'asc' ? activeColor: color}/>
        <path d="M7 11L4.40192 8L9.59808 8L7 11Z" fill={direction === 'desc' ? activeColor: color}/>
    </svg>
}

SortIcon.propTypes = {
    size: PropTypes.number,
    color: PropTypes.string,
    direction: PropTypes.oneOf(['asc', 'desc'])
}

export default SortIcon
