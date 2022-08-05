const SvgProgress= ({ color, size, fill, style, className, onClick }) => {
    return (
        <svg
            width={size || "24"}
            height={size || "24"}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <path
                d="M12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20Z"
                fill="#49E8D5"
            />
            <path
                d="M12 24C5.38373 24 0 18.6172 0 12C0 5.38373 5.38373 0 12 0C18.6172 0 24 5.38373 24 12C24 18.6172 18.6172 24 12 24ZM12 1.85902C6.40805 1.85902 1.85902 6.40805 1.85902 12C1.85902 17.592 6.40805 22.141 12 22.141C17.592 22.141 22.141 17.591 22.141 12C22.141 6.40805 17.592 1.85902 12 1.85902Z"
                fill="#49E8D5"
            />
        </svg>
    );
}

export default SvgProgress;
