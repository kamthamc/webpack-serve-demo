/* eslint-disable import/no-extraneous-dependencies */
// const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const appVersion = require('./package.json').version;

const stages = {
    dev: 'dev',
    staging: 'stg',
    production: 'prod',
};

// Webpack 4 Modes
const modes = {
    dev: 'development',
    production: 'production',
};

const sourceMaps = {
    dev: 'source-map',
    stg: 'none',
    prod: 'none',
};
const { env } = process;
const { stage = stages.dev, NODE_ENV: mode = modes.dev, out } = env;
const rootDir = path.resolve(__dirname);
const src = `${rootDir}/src`;
const buildDir = out || `${rootDir}/build`;
const publicPath = './build/static/public';
const plugins = [
    new HtmlWebpackPlugin({
        filename: 'index.html',
        title: 'Webpack Serve Demo',
        template: `${src}/index.html`,
        appVersion,
    }),
];
module.exports = {
    mode,
    bail: true,
    context: rootDir,
    devtool: sourceMaps[stage],
    entry: {
        app: `${src}/index.js`,
    },
    optimization: {
        minimize: true,
        minimizer: [
            new UglifyJsPlugin({
                sourceMap: true,
                uglifyOptions: {
                    exclude: module => /node_modules/.test(module.resource),
                    compress: {
                        warnings: true,
                    },
                    mangle: false,
                    output: {
                        beautify: true,
                        comments: false,
                    },
                    warnings: true,
                },
            }),
        ],
        nodeEnv: mode,
        splitChunks: {
            name: 'vendor',
            minChunks: 3,
        },
        mergeDuplicateChunks: true,
    },
    target: 'web',
    output: {
        path: `${buildDir}`,
        filename: `${publicPath}/js/[name].[hash].js`,
        chunkFilename: `${publicPath}/js/[name].[chunckhash].js`,
        crossOriginLoading: false,
        publicPath: '/',
    },
    resolve: {
        modules: [src, `${rootDir}/node_modules/`],
        extensions: ['.js', '.jsx'],
    },
    module: {
        strictExportPresence: true,
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                },
            },
            {
                test: /\.css/,
                use: [
                    'style-loader',
                    'css-loader'
                ],
            },
        ],
    },
    plugins,
    devServer: {
        hot: mode === modes.dev,
        port: 9090,
        historyApiFallback: true,
        inline: true,
        lazy: true,
        watchContentBase: mode === modes.dev,
        compress: mode !== modes.dev,
        host: '0.0.0.0',
        contentBase: src,
    },
};