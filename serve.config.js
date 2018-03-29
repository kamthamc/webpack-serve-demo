/* eslint-disable import/no-extraneous-dependencies */
const serve = require('webpack-serve');
const config = require('./webpack.config.js');

serve({
    config,
    host: '0.0.0.0',
    port: 9090,
    hot: {
        host: '0.0.0.0',
        port: 9091,
    },
    clipboard: false,
    http2: true,
    logLevel: 'info',
    logTime: true,
});