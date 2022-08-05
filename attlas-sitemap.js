module.exports = {
    siteUrl: process.env.SITE_URL || 'https://nami.exchange',
    generateRobotsTxt: true, // (optional)
    exclude: ['/server-sitemap.xml'], // <= exclude here
    robotsTxtOptions: {
        additionalSitemaps: [
            'https://nami.exchange/server-sitemap.xml',
        ],
    },
    alternateRefs: [
        {
            href: 'https://nami.exchange',
            hreflang: 'vi',
        },
        {
            href: 'https://nami.exchange/en',
            hreflang: 'en',
        },
    ],
};
