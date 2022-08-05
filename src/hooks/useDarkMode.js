import { LOCAL_STORAGE_KEY } from 'redux/actions/const';
import { useDispatch, useSelector } from 'react-redux';
import { SET_THEME } from 'redux/actions/types';

export const THEME_MODE = {
    LIGHT: 'light',
    DARK: 'dark'
}

const useDarkMode = () => {
    const currentTheme = useSelector((state) => state.user.theme);
    const user = useSelector((state) => state.user);

    const dispatch = useDispatch()
    const setTheme = (nextTheme) => {
        const root = window.document.documentElement
        root.classList.remove(nextTheme === THEME_MODE.LIGHT ? THEME_MODE.DARK : THEME_MODE.LIGHT)
        root.classList.add(nextTheme)
        localStorage.setItem(LOCAL_STORAGE_KEY.THEME, nextTheme)
        dispatch({
            type: SET_THEME,
            payload: nextTheme
        })
    }

    const onThemeSwitch = () => {
        const nextTheme = currentTheme === THEME_MODE.LIGHT ? THEME_MODE.DARK : THEME_MODE.LIGHT
        setTheme(nextTheme)
    }

    return [currentTheme, onThemeSwitch, setTheme]
}

export default useDarkMode


// import { useState, useEffect } from 'react'
// import { LOCAL_STORAGE_KEY } from 'redux/actions/const'
// import { useSelector, useDispatch } from 'react-redux'
//
//
// export const THEME_MODE = {
//     LIGHT: 'light',
//     DARK: 'dark'
// }
//
// const useDarkMode = () => {
//     const currentTheme = useSelector(state => state.user.theme)
//     const dispatch = useDispatch()
//
//     const onThemeSwitch = (currentTheme) => {
//         const nextTheme = currentTheme === THEME_MODE.LIGHT ? THEME_MODE.DARK : THEME_MODE.LIGHT
//         const payload
//     }
//
//     useEffect(() => {
//         const root = window.document.documentElement
//         root.classList.remove(nextTheme)
//         root.classList.add(theme)
//         console.log('namidev-DEBUG: ')
//         localStorage.setItem(LOCAL_STORAGE_KEY.THEME, nextTheme)
//     }, [theme, nextTheme])
//
//     useEffect(() => console.log('namidev-DEBUG: get theme from hook: ', currentTheme), [currentTheme])
//
//     return [nextTheme, setTheme]
// }
//
// export default useDarkMode
