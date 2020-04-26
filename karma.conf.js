// Karma configuration
// Generated on Thu Feb 18 2016 22:00:23 GMT+0100 (CET)
var path = require('path');
module.exports = function (config) {
    let watch = true;
    if (process.env.watch === "false") {
        watch = false;
    }
    config.set({
        client: {
            mocha: {
                timeout: process.env.isDebug ? false : 2000
            }
        },
        basePath: '',

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: !!process.env.CI || !watch,

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: watch,

        browsers: process.env.CI ? ['ChromeHeadlessCustom', 'FirefoxHeadless'] : ['ChromeHeadlessCustom'],
        customLaunchers: {
            ChromeHeadlessCustom: {
                base: 'ChromeHeadless',
                flags: process.env.CI ? ['--window-size=1600,900'] : ['--window-size=1600,900', '--remote-debugging-port=9333']
            },
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
            'test/**/*.spec.ts',
            './node_modules/bootstrap/dist/css/bootstrap.min.css'
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
        // reporters: ['progress', 'nyan', 'coverage-istanbul', 'karma-typescript', 'spec', 'coveralls'],
        reporters: process.env.CI
            ? ['karma-typescript', 'spec', 'coverage-istanbul', 'coveralls']
            : ['karma-typescript', 'spec', 'coverage-istanbul'],

        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN
        // config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,

        // Concurrency level
        // how many browser should be started simultaneous
        concurrency: Infinity,

        karmaTypescriptConfig: {
            compilerOptions: {
                module: "commonjs",
                sourceMap: true
            },
            coverageOptions: {
                instrumentation: !process.env.isDebug
            },
            tsconfig: "./tsconfig.json",
        },

        coverageReporter: {
            type: 'lcovonly',
            dir: 'coverage/'
        },
        coverageIstanbulReporter: process.env.CI
            ? {
                reports: ['lcovonly', 'text-summary'],
                dir: path.join(__dirname, 'coverage'),
                combineBrowserReports: true,
                fixWebpackSourcePaths: true
            }
            : {
                reports: process.env.isDebug ? ['html', 'lcovonly'] : ['html', 'lcovonly', 'text-summary'],
                dir: path.join(__dirname, 'coverage/%browser%/'),
                fixWebpackSourcePaths: true,
                'report-config': {
                    html: { outdir: 'html' }
                }
            },
        specReporter: {
            maxLogLines: 5,         // limit number of lines logged per test
            suppressErrorSummary: true,  // do not print error summary
            suppressFailed: false,  // do not print information about failed tests
            suppressPassed: false,  // do not print information about passed tests
            suppressSkipped: true,  // do not print information about skipped tests
            showSpecTiming: true // print the time elapsed for each spec
        }

    });
};
