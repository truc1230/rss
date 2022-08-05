import { useEffect } from 'react'; 

function useHideScrollbar() {
    const handleHideScrollBar = () => {
        const malLayout = document.querySelector('.mal-layouts');
        if (window.innerWidth < 650) {
            document.body.classList.add('overflow-hidden');
            malLayout.classList.add('!h-screen');
        }
        return () => {
            document.body.classList.remove('overflow-hidden');
            malLayout.classList.remove('!h-screen');
        };
    };
    useEffect(handleHideScrollBar, []);
}

export default useHideScrollbar;
