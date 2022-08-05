export const pageview = (url) => {
    if (window && window.gtag) {
        window.gtag('config', 'G-RGS9ZWC4NW', {
            page_path: url,
        });
    }
};

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({ action, category, label, value }) => {
    if (window && window.gtag) {
        window.gtag('event', action, {
            event_category: category,
            event_label: label,
            value,
        });
    }
};
