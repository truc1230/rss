const SvgExit = ({ color, size, fill, style, className, onClick }) => {
    return (
        <div style={style || {}} className={className || ''} onClick={() => onClick && onClick()}>
            <svg xmlns="http://www.w3.org/2000/svg" width={size || '32'} height={size || '32'} viewBox="0 0 32 32" fill="none">
                <path
                    d="M11.5 21.5H8.16667C7.72464 21.5 7.30072 21.3244 6.98816 21.0118C6.67559 20.6993 6.5 20.2754 6.5 19.8333V8.16667C6.5 7.72464 6.67559 7.30072 6.98816 6.98816C7.30072 6.67559 7.72464 6.5 8.16667 6.5H11.5"
                    stroke={color || '#223050'} strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M17.3334 18.1668L21.5 14.0002L17.3334 9.8335" stroke={color || '#223050'} strokeLinecap="round"
                      strokeLinejoin="round"/>
                <path d="M21.5 14H11.5" stroke={color || '#223050'} strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        </div>
    )
}

export default SvgExit
