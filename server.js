const express = require('express');
const next = require('next');
const { createProxyMiddleware } = require('http-proxy-middleware');

const port = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const isDevelopment = process.env.NODE_ENV !== 'production';
app.prepare().then(() => {
    const server = express();

    if (isDevelopment) {
        server.use([
            '/authenticated/',
            '/api/',
            '/login/',
            '/register/',
            '/logout/',
            '/referral/',
        ], createProxyMiddleware({
            target: process.env.NEXT_PUBLIC_API_URL,
            changeOrigin: true,
            headers: { nami_product: 'exchange' },
            'secure': false,
            logLevel: 'debug',
        }));
    }

    server.all('*', (req, res) => {
        return handle(req, res);
    });

    server.listen(port, (err) => {
        if (err) throw err;
        console.log(`> Ready on http://localhost:${port}`);
    });
}).catch(err => {
    console.log('Error:::::', err);
});
