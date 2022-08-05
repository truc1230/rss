

const SvgHexagon = ({ color, size, fill, style, className, onClick }) => {
    return (
        <div style={style || {}} className={className || {}} onClick={() => onClick && onClick()}>
            <svg xmlns="http://www.w3.org/2000/svg" width={size || '20'} height={size || '20'} viewBox="0 0 20 20" fill={fill || 'none'}>
                <g clipPath="url(#clip0)">
                    <path
                        d="M7.67658 0.597656L9.98376 4.61422L7.67658 8.63109L3.06251 8.63109L0.755327 4.61422L3.06251 0.597656L7.67658 0.597656Z"
                        fill="#CBD5E0"/>
                    <path
                        d="M17.7717 0.597412L20.0789 4.61429L17.7717 8.63085L13.1576 8.63085L10.8504 4.61429L13.1576 0.597412L17.7717 0.597412Z"
                        fill="#E2E8F0"/>
                    <path
                        d="M7.67646 11.3691L9.98364 15.3857L7.67646 19.4026L3.06239 19.4026L0.755206 15.3857L3.06239 11.3691L7.67646 11.3691Z"
                        fill="#A0AEC0"/>
                    <path
                        d="M17.7718 11.3691L20.079 15.386L17.7718 19.4026L13.1577 19.4026L10.8505 15.386L13.1577 11.3691L17.7718 11.3691Z"
                        fill="#718096"/>
                </g>
                <defs>
                    <clipPath id="clip0">
                        <rect width="20" height="20" fill="white"/>
                    </clipPath>
                </defs>
            </svg>
        </div>
    );
};

export default SvgHexagon;
