

const SvgRefresh = ({ color, size, fill, style, className, onClick }) => {
    return (
        <div style={style || {}} className={className || {}} onClick={() => onClick && onClick()}>
            <svg xmlns="http://www.w3.org/2000/svg" width={size || '24'} height={size || '24'} viewBox="0 0 24 24" fill={fill || 'none'}>
                <path d="M20.9999 5.81641V10.7255H16.0908" stroke={color || '#718096'} strokeLinecap="round"
                      strokeLinejoin="round"/>
                <path d="M3 18.9071V13.998H7.90909" stroke={color || '#718096'} strokeLinecap="round" strokeLinejoin="round"/>
                <path
                    d="M5.05364 9.90716C5.46859 8.73452 6.17384 7.68612 7.10356 6.85977C8.03329 6.03342 9.1572 5.45605 10.3704 5.18155C11.5836 4.90704 12.8466 4.94434 14.0415 5.28997C15.2364 5.6356 16.3243 6.27828 17.2036 7.15806L21 10.7253M3 13.9981L6.79636 17.5653C7.6757 18.4451 8.76358 19.0878 9.95848 19.4334C11.1534 19.7791 12.4164 19.8164 13.6296 19.5419C14.8428 19.2673 15.9667 18.69 16.8964 17.8636C17.8262 17.0373 18.5314 15.9889 18.9464 14.8162"
                    stroke={color || '#718096'} strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        </div>
    );
};

export default SvgRefresh;
