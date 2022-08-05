import DOMPurify from 'dompurify';
import { DOWNLOAD_APP_LINK } from 'redux/actions/const';

export const truncate = (fullStr, strLen, separator) => {
    if (fullStr.length <= strLen) return fullStr;

    // eslint-disable-next-line no-param-reassign
    separator = separator || '...';

    const sepLen = separator.length;
    const charsToShow = strLen - sepLen;
    const frontChars = Math.ceil(charsToShow / 2);
    const backChars = Math.floor(charsToShow / 2);

    return fullStr.substr(0, frontChars) +
        separator +
        fullStr.substr(fullStr.length - backChars);
};

export const sanitize = (content) => {
    return typeof window === 'undefined' ? content : DOMPurify.sanitize(content);
};

// Correct for webview only
export const getDownloadAppLinkForWebView = () => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    const ios = /iphone|ipod|ipad/.test(userAgent);
    return ios ? DOWNLOAD_APP_LINK.IOS : DOWNLOAD_APP_LINK.ANDROID;
};

export const handleHideScrollBar = () => {
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
