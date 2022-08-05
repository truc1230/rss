

const SvgExchange = ({ color, size, fill, style, className, onClick }) => {
    return (
        <div style={style || {}} className={className || {}} onClick={() => onClick && onClick()}>
            <svg xmlns="http://www.w3.org/2000/svg" width={size || '24'} height={size || '24'} viewBox="0 0 24 24"
                 fill={fill || 'none'}>
                <path d="M8 20L8 5" stroke={color || '#718096'} strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M4 9L8 5L12 9" stroke={color || '#718096'} strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 5L16 20" stroke={color || '#718096'} strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M20 16L16 20L12 16" stroke={color || '#718096'} strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        </div>
    );
};

export default SvgExchange;
