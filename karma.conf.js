// Karma configuration
// Generated on Thu Feb 18 2016 22:00:23 GMT+0100 (CET)
var path = require('path');
module.exports = function (config) {
    config.set({
        basePath: '',

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: !!process.env.CI,

        browsers: process.env.CI ? ['ChromeHeadlessCustom', 'Firefox'] : ['ChromeHeadlessCustom'],
        customLaunchers: {
            ChromeHeadlessCustom: {
                base: 'ChromeHeadless',
                flags: ['--window-size=800,600']
            }
        },
        mime: {
            'text/x-typescript': ['ts', 'tsx']
        },

        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['mocha', 'chai', 'karma-typescript'],


        // list of files / patterns to load in the browser
        files: [
            // {pattern: 'src/**/*.ts', included: false, watched: true},
            'src/**/*.ts',
            'test/**/*.spec.ts'
        ],
        exclude: [
        ],
        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            "**/*.ts": ['karma-typescript']
        },

        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        // reporters: ['progress', 'nyan', 'coverage-istanbul', 'karma-typescript'],
        reporters: process.env.CI
        ? ['nyan', 'coverage-istanbul','karma-typescript', 'coveralls']
        : ['nyan', 'coverage-istanbul','karma-typescript'],

        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN
        // config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,

        // Concurrency level
        // how many browser should be started simultaneous
        concurrency: Infinity,

        karmaTypescriptConfig: {
            compilerOptions: {
                module: "commonjs"
            },
            tsconfig: "./tsconfig.json",
        },

        coverageReporter: {
            type: 'lcovonly',
            dir: 'coverage/'
        },
        nyanReporter: {
            renderOnRunCompleteOnly: process.env.CI
        },
        coverageIstanbulReporter: process.env.CI
            ? {
                reports: ['lcovonly', 'text-summary'],
                dir: path.join(__dirname, 'coverage'),
                combineBrowserReports: true,
                fixWebpackSourcePaths: true
            }
            : {
                reports: ['html', 'lcovonly', 'text-summary'],
                dir: path.join(__dirname, 'coverage/%browser%/'),
                fixWebpackSourcePaths: true,
                'report-config': {
                    html: { outdir: 'html' }
                }
            }
        // client: {
        //     jasmine: {
        //         random: false
        //     }
        // }
    });
};
