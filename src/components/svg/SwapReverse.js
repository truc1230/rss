const SwapReverse = ({ size, color }) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size || '30'} height={size || '30'} viewBox="0 0 30 30" fill="none">
            <path
                d="M15 30C6.71573 30 -2.93554e-07 23.2843 -6.55671e-07 15C-1.01779e-06 6.71573 6.71573 -2.93554e-07 15 -6.55671e-07C23.2843 -1.01779e-06 30 6.71573 30 15C30 23.2843 23.2843 30 15 30Z"
                fill={color || '#F2FCFC'}/>
            <path d="M11.25 22.5L11.25 8.4375" stroke="#00C8BC" strokeWidth="1.5" strokeLinecap="round"
                  strokeLinejoin="round"/>
            <path d="M7.5 12.1875L11.25 8.4375L15 12.1875" stroke="#00C8BC" strokeWidth="1.5" strokeLinecap="round"
                  strokeLinejoin="round"/>
            <path d="M18.75 8.4375L18.75 22.5" stroke="#00C8BC" strokeWidth="1.5" strokeLinecap="round"
                  strokeLinejoin="round"/>
            <path d="M22.5 18.75L18.75 22.5L15 18.75" stroke="#00C8BC" strokeWidth="1.5" strokeLinecap="round"
                  strokeLinejoin="round"/>
        </svg>
    )
}

export default SwapReverse
