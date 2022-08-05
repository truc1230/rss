export const pageview = () => {
    if (window && window.fbq) {
        window.fbq('track', 'PageView');
    }
};

// https://developers.facebook.com/docs/facebook-pixel/advanced/
export const event = (name, options = {}) => {
    if (window && window.fbq) {
        window.fbq('track', name, options);
    }
};
