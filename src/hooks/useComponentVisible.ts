import { useEffect, useRef, useState } from 'react';

export function useComponentVisible(initialIsVisible, callback) {
    const [isComponentVisible, setIsComponentVisible] = useState(initialIsVisible)
    const ref = useRef(null)

    const handleClickOutside = (event) => {
        if (ref.current && !ref.current.contains(event.target)) {
            setIsComponentVisible(false)
            if (callback && typeof callback === 'function') return callback()
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleClickOutside, true)
        return () => {
            document.removeEventListener('click', handleClickOutside, true)
        };
    });

    return { ref, isComponentVisible, setIsComponentVisible }
}

export default useComponentVisible
