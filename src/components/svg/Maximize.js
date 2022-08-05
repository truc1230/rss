const Maximize = ({color = '#8492A7', size = 24, fill, style, className, onClick}) => {
    return (
        <svg onClick={onClick} width={size} height={size} viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14.666 4.29297H19.9993V9.6263" stroke={color} strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9.33333 20.2933H4V14.96" stroke={color} strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M19.9996 4.29297L13.7773 10.5152" stroke={color} strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M4 20.2925L10.2222 14.0703" stroke={color} strokeLinecap="round" strokeLinejoin="round"/>
        </svg>

    );
};

export default Maximize;