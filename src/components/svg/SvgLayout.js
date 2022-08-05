const SvgLayout = ({ color, size, fill, style, className, onClick }) => {
    return (
        <div style={style || {}} className={className || ''} onClick={() => onClick && onClick()}>
            <svg xmlns="http://www.w3.org/2000/svg" width={size || '32'} height={size || '32'} viewBox="0 0 32 32" fill="none">
                <path
                    d="M19.8333 6.5H8.16667C7.24619 6.5 6.5 7.24619 6.5 8.16667V19.8333C6.5 20.7538 7.24619 21.5 8.16667 21.5H19.8333C20.7538 21.5 21.5 20.7538 21.5 19.8333V8.16667C21.5 7.24619 20.7538 6.5 19.8333 6.5Z"
                    stroke={color || '#223050'} strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M6.5 11.5H21.5" stroke={color || '#223050'} strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M11.5 21.5V11.5" stroke={color || '#223050'} strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        </div>
    )
}

export default SvgLayout
