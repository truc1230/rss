

const SvgSun = ({ color, size, fill, style, className, onClick }) => {
    return (
        <div style={style || {}} className={className || {}} onClick={() => onClick && onClick()}>
            <svg xmlns="http://www.w3.org/2000/svg" width={size || '24'} height={size || '24'}
                 viewBox="0 0 24 24" fill={fill || 'none'}>
                <path
                    d="M12 17C14.7614 17 17 14.7614 17 12C17 9.23858 14.7614 7 12 7C9.23858 7 7 9.23858 7 12C7 14.7614 9.23858 17 12 17Z"
                    stroke={color || '#718096'} strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 1V3" stroke={color || '#718096'} strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 21V23" stroke={color || '#718096'} strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M4.21997 4.21997L5.63997 5.63997" stroke={color || '#718096'} strokeLinecap="round"
                      strokeLinejoin="round"/>
                <path d="M18.3601 18.3601L19.7801 19.7801" stroke={color || '#718096'} strokeLinecap="round"
                      strokeLinejoin="round"/>
                <path d="M1 12H3" stroke={color || '#718096'} strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21 12H23" stroke={color || '#718096'} strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M4.21997 19.7801L5.63997 18.3601" stroke={color || '#718096'} strokeLinecap="round"
                      strokeLinejoin="round"/>
                <path d="M18.3601 5.63997L19.7801 4.21997" stroke={color || '#718096'} strokeLinecap="round"
                      strokeLinejoin="round"/>
            </svg>
        </div>
    );
};

export default SvgSun
