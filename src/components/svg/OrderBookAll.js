const Svg = ({ color, size, fill, style, className, onClick }) => {
    return (
        <svg
            style={style || undefined}
            className={className || undefined}
            onClick={() => onClick && onClick()}
            xmlns="http://www.w3.org/2000/svg"
            width={size || "14"}
            height={size || "14"}
            viewBox="0 0 14 14"
            fill={fill || "none"}
        >
            <rect x="0.6" y="0.6" width="4.8" height="5.26154" stroke="#E5544B" strokeWidth="1.2"/>
            <rect x="0.6" y="8.13809" width="4.8" height="5.26154" stroke="#00C8BC" strokeWidth="1.2"/>
            <rect x="7" width="7" height="1.07692" fill="#718096"/>
            <rect x="7" y="3.23047" width="7" height="1.07692" fill="#718096"/>
            <rect x="7" y="6.46191" width="7" height="1.07692" fill="#718096"/>
            <rect x="7" y="9.69238" width="7" height="1.07692" fill="#718096"/>
            <rect x="7" y="12.9229" width="7" height="1.07692" fill="#718096"/>
        </svg>

    );
};

export default Svg;
