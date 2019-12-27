const path = require('path');
const webpackConfig = require('./webpack.config.js');

webpackConfig.resolve.alias.SRC = path.resolve(__dirname, 'src');

module.exports = function(config) {
    config.set({
        basePath: __dirname,
        context: __dirname,
        node: {
            __filename: true
        },
        frameworks: ['jasmine'],
        files: [
            'bower_components/jquery/dist/jquery.js',
            'bower_components/jasmine-jquery/lib/jasmine-jquery.js',
            'tests/Bridge/ComponentsBundle/Resources/**/*.js'
        ],
        preprocessors: {
            'tests/Bridge/ComponentsBundle/Resources/**/*.js': ['webpack', 'sourcemap']
        },
        reporters: ['progress', 'coverage'],
        coverageReporter: {
            dir: 'coverage',
            reporters: [
                // reporters not supporting the `file` property
                { type: 'html', subdir: 'js' },
                { type: 'clover', subdir: '.', file: 'js-coverage.xml' }
            ]
        },
        plugins: ['karma-coverage', 'karma-webpack', 'karma-jasmine', 'karma-phantomjs-launcher', 'karma-sourcemap-loader'],
        exclude: [],
        port: 8080,
        logLevel: config.LOG_INFO,
        browsers: ['PhantomJS'],
        browserNoActivityTimeout: 15000,
        browserDisconnectTolerance: 3,
        webpack: webpackConfig,

        webpackMiddleware: {
            stats: 'errors-only'
        }
    });
};
