import PropTypes from 'prop-types';
const SuccessfulCircle = ({ className , size }) => {

    return (
        <svg
            width={size || "24"}
            height={size || "24"}
            viewBox="0 0 80 80"
            fill="none"
            className={className}
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M57 26L37.1667 52L23 41.0526"
                stroke="#00C8BC"
                stroke-width="5"
                stroke-linecap="round"
                stroke-linejoin="round"
            />
            <path
                d="M77 40C77 60.4345 60.4345 77 40 77C19.5655 77 3 60.4345 3 40C3 19.5655 19.5655 3 40 3C60.4345 3 77 19.5655 77 40Z"
                stroke="#00C8BC"
                stroke-width="6"
                stroke-linecap="round"
                stroke-linejoin="round"
            />
        </svg>
    );
};


export default SuccessfulCircle;
