const SvgSun = ({ color, size, fill, style, className, onClick }) => {
    return (
        <div style={style || {}} className={className || {}} onClick={() => onClick && onClick()}>
            <svg xmlns="http://www.w3.org/2000/svg" width={size || '32'} height={size || '32'} viewBox="0 0 32 32" fill="none">
                <path
                    d="M21.8333 15.1665H10.1667C9.24619 15.1665 8.5 15.9127 8.5 16.8332V22.6665C8.5 23.587 9.24619 24.3332 10.1667 24.3332H21.8333C22.7538 24.3332 23.5 23.587 23.5 22.6665V16.8332C23.5 15.9127 22.7538 15.1665 21.8333 15.1665Z"
                    stroke={color || '#223050'} strokeLinecap="round" strokeLinejoin="round"/>
                <path
                    d="M11.8334 15.1665V11.8332C11.8334 10.7281 12.2724 9.66829 13.0538 8.88689C13.8352 8.10549 14.895 7.6665 16 7.6665C17.1051 7.6665 18.1649 8.10549 18.9463 8.88689C19.7277 9.66829 20.1667 10.7281 20.1667 11.8332V15.1665"
                    stroke={color || '#223050'} strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        </div>
    )
}

export default SvgSun
