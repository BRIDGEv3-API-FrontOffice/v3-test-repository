
// Node Modules
const path = require('path');
const glob = require('glob');
const autoPrefixerPlugin = require('autoprefixer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const WebpackNotifierPlugin = require('webpack-notifier');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ImageMinPlugin = require('imagemin-webpack-plugin').default;

// Constants
const OUT_PATH = path.resolve(__dirname, 'web/build/');
const PUBLIC_PATH = './';
const IS_DEV = process.env.MDC_ENV === 'development';
const IS_PROD = process.env.MDC_ENV === 'production';
const APP_NAME = `[name]${(IS_PROD ? '.min' : '')}`;
const SOURCE_MAP = IS_DEV ? 'source-map' : false;
const FRONT_THEME = 'Essential';

// Plugins
const PLUGINS = [
    new ExtractTextPlugin(`${APP_NAME}.css`),
    new WebpackNotifierPlugin({
        title: 'Oh... here they come!',
        alwaysNotify: true,
        contentImage: path.join(__dirname, 'web/webpack-notifier-icon.png')
    }),
    new CopyWebpackPlugin([
        {from: `${PUBLIC_PATH}/web/assets/images`, to: 'assets/images'}
    ]),
    new ImageMinPlugin(
        {test: /\.(jpe?g|png|gif|svg)$/i}
    )
];

// Debug stats
const STATS = {
    assets: false,
    children: false,
    chunks: false,
    hash: false,
    modules: false,
    timings: true,
    source: false
};

const CSS_LOADER_CONFIG = [
    {
        loader: 'css-loader',
        options: {
            sourceMap: false
        }
    },
    {
        loader: 'postcss-loader',
        options: {
            sourceMap: SOURCE_MAP,
            plugins: () => {
                return [
                    autoPrefixerPlugin({
                        grid: false,
                        browsers: ['last 2 versions', 'ie 10', 'android >= 4', 'iOS >= 8']
                    })
                ];
            }
        }
    },
    {
        loader: 'sass-loader',
        options: {
            sourceMap: false,
            includePaths: glob.sync('**/node_modules/').map((d) => {
                return path.join(__dirname, d);
            })
        }
    }
];

// Configuration
module.exports = {
    entry: {
        exceptions: [
            'babel-polyfill',
            `./src/Bridge/Theme/${FRONT_THEME}Bundle/Resources/views/pages/exceptions/index.js`
        ],
        gdpr: [
            'babel-polyfill',
            `./src/Bridge/Theme/${FRONT_THEME}Bundle/Resources/views/pages/gdpr/index.js`
        ],
        'geo-divisions': [
            'babel-polyfill',
            `./src/Bridge/Theme/${FRONT_THEME}Bundle/Resources/views/pages/geo-divisions/index.js`
        ],
        home: [
            'babel-polyfill',
            `./src/Bridge/Theme/${FRONT_THEME}Bundle/Resources/views/pages/home/index.js`
        ],
        location: [
            'babel-polyfill',
            `./src/Bridge/Theme/${FRONT_THEME}Bundle/Resources/views/pages/location/index.js`
        ],
        results: [
            'babel-polyfill',
            `./src/Bridge/Theme/${FRONT_THEME}Bundle/Resources/views/pages/results/index.js`
        ]
    },
    output: {
        path: OUT_PATH,
        publicPath: PUBLIC_PATH,
        filename: `${APP_NAME}.js`
    },
    devtool: SOURCE_MAP,
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: [
                    /node_modules(?!(\/|\\)micromodal)/,
                    path.resolve(__dirname, 'bower_components')
                ],
                use: {
                    loader: 'babel-loader',
                    options: {
                        cacheDirectory: true,
                        presets: ['es2015']
                    }
                }
            },
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: CSS_LOADER_CONFIG
                })
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: CSS_LOADER_CONFIG
                })
            },
            {
                test: /\.(otf|eot|ttf|woff(2)?)$/i,
                loader: 'file-loader',
                options: {
                    name: 'assets/fonts/[name].[ext]'
                }
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                loader: 'file-loader',
                options: {
                    name: 'assets/bg/[name].[ext]'
                }
            }
        ]
    },
    resolveLoader: {
        modules: [
            'node_modules'
        ]
    },
    resolve: {
        modules: [
            'node_modules',
            'bower_components'
        ],
        alias: {
            // Use these aliases in JS (ie: @alias/...) and SCSS (ie: ~@alias/...) files
            web: path.resolve(__dirname, 'web'),
            '@components': path.resolve(__dirname, './src/Bridge/ComponentsBundle/Resources'),
            '@theme': path.resolve(__dirname, `./src/Bridge/Theme/${FRONT_THEME}Bundle/Resources`)
        },
        extensions: ['.js', '.scss', '.css']
    },
    plugins: PLUGINS,
    stats: STATS
};
