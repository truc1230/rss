

const SvgUser = ({ type = 1, color, size, fill, style, className, onClick }) => {
    return (
        <div style={style || {}} className={className || ""} onClick={() => onClick && onClick()}>
            {type === 1 && <svg xmlns="http://www.w3.org/2000/svg" width={size || '24'} height={size || '24'} viewBox="0 0 24 24"
                  fill={fill || 'none'}>
                <circle cx="12" cy="12" r="10" stroke={color || '#718096'}/>
                <path
                    d="M16.4443 17.0001V15.889C16.4443 15.2996 16.2102 14.7344 15.7934 14.3176C15.3767 13.9009 14.8115 13.6667 14.2221 13.6667H9.77764C9.18827 13.6667 8.62304 13.9009 8.20629 14.3176C7.78955 14.7344 7.55542 15.2996 7.55542 15.889V17.0001"
                    stroke={color || '#718096'} strokeLinecap="round" strokeLinejoin="round"/>
                <path
                    d="M12.0002 11.4444C13.2275 11.4444 14.2224 10.4495 14.2224 9.22222C14.2224 7.99492 13.2275 7 12.0002 7C10.7729 7 9.77795 7.99492 9.77795 9.22222C9.77795 10.4495 10.7729 11.4444 12.0002 11.4444Z"
                    stroke={color || '#718096'} strokeLinecap="round" strokeLinejoin="round"/>
            </svg>}
            {type === 2 &&
            <svg width={size || '33'} height={size || '32'} viewBox="0 0 33 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M23.1667 23.5V21.8333C23.1667 20.9493 22.8155 20.1014 22.1904 19.4763C21.5653 18.8512 20.7174 18.5 19.8334 18.5H13.1667C12.2827 18.5 11.4348 18.8512 10.8097 19.4763C10.1846 20.1014 9.83337 20.9493 9.83337 21.8333V23.5"
                    stroke={color || '#223050'} strokeLinecap="round" strokeLinejoin="round"/>
                <path
                    d="M16.5 15.1667C18.3409 15.1667 19.8333 13.6743 19.8333 11.8333C19.8333 9.99238 18.3409 8.5 16.5 8.5C14.659 8.5 13.1666 9.99238 13.1666 11.8333C13.1666 13.6743 14.659 15.1667 16.5 15.1667Z"
                    stroke={color || '#223050'} strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            }
        </div>
    );
};

export default SvgUser
