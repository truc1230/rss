const Candles = ({
    color = "#718096",
    size,
    fill= '#FBFBFB',
    style,
    className,
    onClick,
}) => {
    return (
        <svg
            style={style || undefined}
            className={className || undefined}
            onClick={() => onClick && onClick()}
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M15.8182 21L15.8182 5.25"
                stroke={color}
                strokeWidth="0.8"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M8.18182 21L8.18182 3"
                stroke={color}
                strokeWidth="0.8"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <rect
                x="6.4"
                y="6.1002"
                width="3.56364"
                height="11.8"
                rx="0.6"
                fill={fill}
                stroke={color}
                strokeWidth="0.8"
            />
            <rect
                x="14.0364"
                y="9.6998"
                width="3.56364"
                height="8.2"
                rx="0.6"
                fill={fill}
                stroke={color}
                strokeWidth="0.8"
            />
        </svg>
    );
};

export default Candles;
