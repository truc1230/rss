import { useCallback, useState } from 'react';
import useObservedRef from './useObservedRef';

const defaultSize = {
    width: 0,
    height: 0
}

// assumes the resize-observer-polyfill is loaded, this can be done through polyfill.io
function useElementSize() {
    const [size, setSize] = useState(defaultSize)
    const createObserver = useCallback(
        () => {
            return new window.ResizeObserver(([entry]) => {
                setSize({
                    width: Math.ceil(entry.contentRect.width),
                    height: Math.ceil(entry.contentRect.height)
                })
            })
        },
        []
    )

    const reset = useCallback(() => {
        setSize(defaultSize)
    }, [])
    const ref = useObservedRef({
        createObserver,
        reset,
        disabled: false
    })

    return {
        size,
        ref
    }
}

export default useElementSize
