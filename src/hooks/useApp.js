import { useEffect, useState } from 'react';
import useDarkMode from 'hooks/useDarkMode';

const useApp = () => {
    const [isApp, setApp] = useState(false)
    const [currentTheme, , setTheme] = useDarkMode()

    useEffect(() => {
        const search = new URLSearchParams(window.location.search)
        search.get('source') === 'app' && setApp(true)
    }, [])

    useEffect(() => {
        const queryTheme = new URLSearchParams(window.location.search)
        const theme = queryTheme.get('theme')
        theme && setTheme(theme)
    }, [currentTheme])

    return isApp
}

export default useApp
