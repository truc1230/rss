const SvgDocument = ({ color, size, fill, style, className, onClick }) => {
    return (
        <div style={style || {}} className={className || ''} onClick={() => onClick && onClick()}>
            <svg width={size || '32'} height={size || '32'} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M11 7.6665H17.6667L22.6667 12.6665V22.6665C22.6667 23.1085 22.4911 23.5325 22.1786 23.845C21.866 24.1576 21.4421 24.3332 21 24.3332H11C10.558 24.3332 10.1341 24.1576 9.82153 23.845C9.50897 23.5325 9.33337 23.1085 9.33337 22.6665V9.33317C9.33337 8.89114 9.50897 8.46722 9.82153 8.15466C10.1341 7.8421 10.558 7.6665 11 7.6665Z"
                    stroke={color || '#223050'} strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M17.6666 7.6665V12.6665H22.6666" stroke="#223050" strokeLinecap="round"
                      strokeLinejoin="round"/>
                <path d="M19.3333 16.8335H12.6666" stroke={color || '#223050'} strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M19.3333 20.1665H12.6666" stroke={color || '#223050'} strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M14.3333 13.5H13.5H12.6666" stroke={color || '#223050'} strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        </div>
    )
}

export default SvgDocument
