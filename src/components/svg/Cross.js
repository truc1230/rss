const SvgCross = ({ color, size, fill, style, className, onClick }) => {
    return (
        <svg
            style={style || {}}
            className={className || {}}
            onClick={() => onClick && onClick()}
            xmlns="http://www.w3.org/2000/svg"
            width={size ? `${size}` : '20'}
            height={size ? `${size}` : '20'}
            viewBox="0 0 20 20"
            fill={fill || 'none'}
        >
            <path d="M5 5L15 15" stroke={color || '#718096'} strokeLinecap="round" strokeLinejoin="round" />
            <path d="M5 15L15 5" stroke={color || '#718096'} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
};

export default SvgCross;
