export const pageview = (url) => {
    if (window && window.dataLayer) {
        window.dataLayer.push({
            event: 'pageview',
            page: url,
        });
    }
};
