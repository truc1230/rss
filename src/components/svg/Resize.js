const SvgResize = ({ color, size, fill, style, className, onClick }) => {
    return (
        <svg
            style={style || {}}
            className={className || {}}
            onClick={() => onClick && onClick()}
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path d="M18 6V18H6" stroke={color || '#718096'} strokeLinecap="round"/>
        </svg>

    );
};

export default SvgResize;
