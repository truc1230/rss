import { useCallback, useEffect, useRef } from 'react';

function useObservedRef({ createObserver, reset, disabled }) {
    const currentNodeRef = useRef(null)
    const observerRef = useRef(null)

    useEffect(
        () => {
            if (disabled) return

            const observer = createObserver()
            const node = currentNodeRef.current
            if (node) observer.observe(node)
            observerRef.current = observer

            return () => {
                observer.disconnect()
                observerRef.current = null
            }
        },
        [createObserver, disabled]
    )

    return useCallback(
        node => {
            const previous = currentNodeRef.current
            const observer = observerRef.current

            if (previous && observer) observer.unobserve(previous)
            if (node && observer) observer.observe(node)
            if (previous && !node) reset()

            currentNodeRef.current = node
        },
        [reset]
    )
}

export default useObservedRef
