const SvgIdentityCard = ({ color, size, fill, style, className, onClick }) => {
    return (
        <div style={style || {}} className={className || ''} onClick={() => onClick && onClick()}>
            <svg xmlns="http://www.w3.org/2000/svg" width={size || '32'} height={size || '32'} viewBox="0 0 32 32" fill="none">
                <rect x="6.83337" y="9.3335" width="18.3333" height="13.3333" rx="2" stroke={color || '#223050'}
                      strokeLinecap="round" strokeLinejoin="round"/>
                <path
                    d="M15.2593 19.3331V18.5923C15.2593 18.1994 15.1032 17.8226 14.8254 17.5448C14.5476 17.2669 14.1707 17.1108 13.7778 17.1108H10.8149C10.4219 17.1108 10.0451 17.2669 9.76729 17.5448C9.48946 17.8226 9.33337 18.1994 9.33337 18.5923V19.3331"
                    stroke={color || '#223050'} strokeLinecap="round" strokeLinejoin="round"/>
                <path
                    d="M12.2963 15.6295C13.1145 15.6295 13.7778 14.9662 13.7778 14.148C13.7778 13.3298 13.1145 12.6665 12.2963 12.6665C11.4781 12.6665 10.8148 13.3298 10.8148 14.148C10.8148 14.9662 11.4781 15.6295 12.2963 15.6295Z"
                    stroke="#223050" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M18.0834 16H22.25" stroke={color || '#223050'} strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M18.0834 13.5H22.25" stroke={color || '#223050'} strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M18.0834 18.5H22.25" stroke={color || '#223050'} strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        </div>
    )
}

export default SvgIdentityCard
