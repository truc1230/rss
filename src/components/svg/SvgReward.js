const SvgReward = ({ color, size, fill, style, className, onClick }) => {
    return (
        <div style={style || {}} className={className || {}} onClick={() => onClick && onClick()}>
            <svg width={size || '32'} height={size || '32'} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.6667 16V24.3333H9.33337V16" stroke={color || '#223050'} strokeLinecap="round"
                      strokeLinejoin="round"/>
                <path d="M24.3333 11.8335H7.66663V16.0002H24.3333V11.8335Z" stroke={color || '#223050'} strokeLinecap="round"
                      strokeLinejoin="round"/>
                <path d="M16 24.3335V11.8335" stroke={color || '#223050'} strokeLinecap="round" strokeLinejoin="round"/>
                <path
                    d="M12.25 11.8332H16C16 11.8332 15.1666 7.6665 12.25 7.6665C11.6974 7.6665 11.1675 7.886 10.7768 8.2767C10.3861 8.6674 10.1666 9.1973 10.1666 9.74984C10.1666 10.3024 10.3861 10.8323 10.7768 11.223C11.1675 11.6137 11.6974 11.8332 12.25 11.8332Z"
                    stroke={color || '#223050'} strokeLinecap="round" strokeLinejoin="round"/>
                <path
                    d="M19.75 11.8332H16C16 11.8332 16.8333 7.6665 19.75 7.6665C20.3025 7.6665 20.8324 7.886 21.2231 8.2767C21.6138 8.6674 21.8333 9.1973 21.8333 9.74984C21.8333 10.3024 21.6138 10.8323 21.2231 11.223C20.8324 11.6137 20.3025 11.8332 19.75 11.8332Z"
                    stroke={color || '#223050'} strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        </div>
    )
}

export default SvgReward
