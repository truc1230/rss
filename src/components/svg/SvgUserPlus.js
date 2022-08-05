const SvgUserPlus = ({ color, size, fill, style, className, onClick }) => {
    return (
        <div style={style || {}} className={className || {}} onClick={() => onClick && onClick()}>
            <svg width={size || '32'} height={size || '32'} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.6666 12.6665V17.6665" stroke={color || '#223050'} strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M25.1666 15.1665H20.1666" stroke={color || '#223050'} strokeLinecap="round" strokeLinejoin="round"/>
                <path
                    d="M20.1667 23.5V21.8333C20.1667 20.9493 19.8155 20.1014 19.1904 19.4763C18.5653 18.8512 17.7174 18.5 16.8334 18.5H10.1667C9.28265 18.5 8.43481 18.8512 7.80968 19.4763C7.18456 20.1014 6.83337 20.9493 6.83337 21.8333V23.5"
                    stroke={color || '#223050'} strokeLinecap="round" strokeLinejoin="round"/>
                <path
                    d="M13.5 15.1667C15.3409 15.1667 16.8333 13.6743 16.8333 11.8333C16.8333 9.99238 15.3409 8.5 13.5 8.5C11.659 8.5 10.1666 9.99238 10.1666 11.8333C10.1666 13.6743 11.659 15.1667 13.5 15.1667Z"
                    stroke={color || '#223050'} strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        </div>
    )
}

export default SvgUserPlus
