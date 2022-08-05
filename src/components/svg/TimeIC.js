import PropTypes from 'prop-types';

const TimeCircle = ({
    className,
}) => {
    return (
        <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            className={className}
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M1 1L11 11"
                stroke="#DC1F4E"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
            />
            <path
                d="M1 11L11 1"
                stroke="#DC1F4E"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
            />
        </svg>
    );
};

export default TimeCircle;
