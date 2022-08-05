import PropTypes from 'prop-types';

const CancelCircle = ({
    className,
    size
}) => {
    return (
        <svg
            width={size || "24"}
            height={size || "24"}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            // onClick={onClick}
        >
            <path
                d="M12 0C5.37257 0 0 5.37257 0 12C0 18.6274 5.37257 24 12 24C18.6274 24 24 18.6274 24 12C23.9929 5.37554 18.6245 0.00708147 12 0ZM5.33491 4.15537C7.19613 2.5758 9.55888 1.71045 12 1.71432C14.4311 1.71356 16.7831 2.57801 18.6351 4.1529L4.14944 18.6386C0.477372 14.3117 1.00813 7.82743 5.33491 4.15537ZM18.6651 19.8446C16.8039 21.4242 14.4411 22.2895 12 22.2857C9.56892 22.2864 7.21692 21.422 5.36489 19.8471L19.8506 5.36137C23.5226 9.6882 22.9919 16.1726 18.6651 19.8446Z"
                fill="#7686B1"
            />
        </svg>
    );
};

// CancelCircle.PropsType = {
//     className?:PropTypes.string, 
// }
export default CancelCircle;
