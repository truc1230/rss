import { useRouter } from 'next/router';

export const LANGUAGE_TAG = {
    VI: "vi",
    EN: "en",
};

const useLanguage = () => {
    const router = useRouter();
    const { locale: currentLocale } = router
    // Language toggle
    const onChangeLang = () => {
        const nextLang =
            currentLocale === LANGUAGE_TAG.VI
                ? LANGUAGE_TAG.EN
                : LANGUAGE_TAG.VI;
        const isSupportScreen = router.pathname.includes('support')
        localStorage.setItem('local_lang', nextLang)
        if (isSupportScreen) {
            if (router.pathname.includes('/support/faq')) {
                router.push({
                    pathname: `/${nextLang}/support/faq`
                })
            } else if (router.pathname.includes('support/announcement')) {
                router.push({
                    pathname: `/${nextLang}/support/announcement`
                })
            } else {
                router.push(router.asPath, router.asPath, { locale: nextLang });
            }
        } else {
            router.push(router.asPath, router.asPath, { locale: nextLang });
        }
    };

    return [currentLocale, onChangeLang];
};

export default useLanguage;
