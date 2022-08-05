



const SvgShare = ({ color, size, fill, style, className, onClick }) => {
    return (
        <div style={style || {}} className={className || {}} onClick={() => onClick && onClick()}>
            <svg xmlns="http://www.w3.org/2000/svg" width={size || '24'} height={size || '24'} viewBox="0 0 24 24" fill={fill || 'none'}>
                <path
                    d="M6 12V18.4C6 18.8243 6.16857 19.2313 6.46863 19.5314C6.76869 19.8314 7.17565 20 7.6 20H17.2C17.6243 20 18.0313 19.8314 18.3314 19.5314C18.6314 19.2313 18.8 18.8243 18.8 18.4V12"
                    stroke="#718096" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M15.6 7.2L12.4 4L9.19995 7.2" stroke={color || '#718096'} strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12.4 4V14.4" stroke={color || '#718096'} strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        </div>
    );
};

export default SvgShare;
