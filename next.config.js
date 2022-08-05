/* eslint-disable import/no-extraneous-dependencies,import/no-unresolved */
const withFonts = require('next-fonts');
const withPlugins = require('next-compose-plugins');
const { parsed: env } = require('dotenv')
    .config();
const path = require('path');
const { withSentryConfig } = require('@sentry/nextjs');

const {
    NEXT_PUBLIC_SENTRY_DSN: SENTRY_DSN,
    NEXT_PUBLIC_API_URL,
    SENTRY_ORG,
    SENTRY_PROJECT,
    SENTRY_AUTH_TOKEN,
    NODE_ENV,
    SENTRY_VERSION,
    ANALYZE,
    BUILD_NUMBER,
} = process.env;
const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: ANALYZE === 'true',
});

process.env.SENTRY_DSN = SENTRY_DSN;

const basePath = '';

const { i18n } = require('./next-i18next.config');

const sentryWebpackPluginOptions = {
    authToken: SENTRY_AUTH_TOKEN,
    // Additional config options for the Sentry Webpack plugin. Keep in mind that
    // the following options are set automatically, and overriding them is not
    // recommended:
    //   release, url, org, project, authToken, configFile, stripPrefix,
    //   urlPrefix, include, ignore

    silent: true, // Suppresses all logs
    // For all available options, see:
    // https://github.com/getsentry/sentry-webpack-plugin#options.
};
const moduleExports = withPlugins([
        [withBundleAnalyzer],
        [withFonts],
    ],
    {
        async headers() {
            return [
                {
                    source: '/.well-known/apple-app-site-association',
                    headers: [
                        {
                            key: 'Content-Type',
                            value: 'application/json; charset=utf-8',
                        },
                    ],
                },
                {
                    source: '/.well-known/assetlinks.json',
                    headers: [
                        {
                            key: 'Content-Type',
                            value: 'application/json; charset=utf-8',
                        },
                    ],
                },
            ];
        },
        eslint: {
            // Warning: This allows production builds to successfully complete even if
            // your project has ESLint errors.
            ignoreDuringBuilds: true,
        },
        env: {
            // Make the COMMIT_SHA available to the client so that Sentry events can be
            // marked for the release they belong to. It may be undefined if running
            // outside of Vercel
            NEXT_PUBLIC_COMMIT_SHA: SENTRY_VERSION,
        },
        i18n,
        sassOptions: {
            includePaths: [path.join(__dirname, 'styles')],
        },
        images: {
            domains: [
                'test.nami.exchange',
                'static.namifutures.com',
                'sgp1.digitaloceanspaces.com',
                'nami.io',
                'datav2.nami.exchange',
            ],
        },
        distDir: process.env.BUILD_DIR || 'build',
    });

module.exports = withSentryConfig(moduleExports, sentryWebpackPluginOptions);
