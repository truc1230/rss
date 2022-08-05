export default ({ size, color, fill, onClick, className = '' }) => (
    <svg
        width={size || '12'}
        height={size || '12'}
        viewBox='0 0 12 12'
        className={className}
        fill={fill || 'none'}
        xmlns='http://www.w3.org/2000/svg'
        onClick={() => onClick && onClick()}
    >
        <path
            d='M6 1L7.545 4.13L11 4.635L8.5 7.07L9.09 10.51L6 8.885L2.91 10.51L3.5 7.07L1 4.635L4.455 4.13L6 1Z'
            stroke={fill ? fill : color || '#C5C6D2'}
            strokeWidth='1.5'
            strokeLinecap='round'
            strokeLinejoin='round'
        />
    </svg>
)
