const CoinPairs = ({color = '#718096', size = 24, fill = 'none', style, className, onClick}) => {
    return (
        <svg onClick={onClick} width={size} height={size} viewBox="0 0 24 24" fill={fill} xmlns="http://www.w3.org/2000/svg">
            <path d="M12 6.44458V17.5557" stroke={color} strokeLinecap="round" strokeLinejoin="round"/>
            <path
                d="M14.7779 8.66675H10.6112C10.0955 8.66675 9.60092 8.84234 9.23626 9.1549C8.87161 9.46746 8.66675 9.89139 8.66675 10.3334C8.66675 10.7754 8.87161 11.1994 9.23626 11.5119C9.60092 11.8245 10.0955 12.0001 10.6112 12.0001H13.389C13.9047 12.0001 14.3992 12.1757 14.7639 12.4882C15.1286 12.8008 15.3334 13.2247 15.3334 13.6667C15.3334 14.1088 15.1286 14.5327 14.7639 14.8453C14.3992 15.1578 13.9047 15.3334 13.389 15.3334H8.66675"
                stroke={color} strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="12" cy="12" r="10" stroke={color}/>
        </svg>

    );
};

export default CoinPairs;
