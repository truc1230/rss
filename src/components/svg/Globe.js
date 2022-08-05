const SvgGlobe = ({ color, size, fill, style, className, onClick }) => {
    return (
        <div style={style || {}} className={className || {}} onClick={() => onClick && onClick()}>
            <svg xmlns="http://www.w3.org/2000/svg" width={size || '24'} height={size || '24'} viewBox="0 0 24 24" fill={fill || 'none'}>
                <path
                    d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                    stroke={color || '#718096'} strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12H22" stroke={color || '#718096'} strokeLinecap="round" strokeLinejoin="round"/>
                <path
                    d="M16 12C15.9228 8.29203 14.5013 4.73835 12 2C9.49872 4.73835 8.07725 8.29203 8 12C8.07725 15.708 9.49872 19.2616 12 22C14.5013 19.2616 15.9228 15.708 16 12Z"
                    stroke={color || '#718096'} strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        </div>
    )
};

export default SvgGlobe
