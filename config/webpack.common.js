const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const paths = require('./paths');
const templates = require('./templates.json');

/**
 * Get the file name from path
 */
function getFilename(path) {
    return path ? path.substring(path.lastIndexOf('/') + 1, path.lastIndexOf('.')) : null;
}

/**
 * Generates multiple HTML plugin
 * Generates an HTML file for each template
 * Generates deprecation warning: @see {@link https://github.com/jantimon/html-webpack-plugin/issues/1501}
 * @see {@link https://extri.co/2017/07/11/generating-multiple-html-pages-with-htmlwebpackplugin/}
 * @see {@link https://stackoverflow.com/questions/42193689/is-there-a-way-to-include-partial-using-html-webpack-plugin}
 */
function generateHtmlPlugin() {
    return Object.keys(templates).map((templateName) => {
        // Create new HtmlWebpackPlugin with options
        return new HtmlWebpackPlugin({
            /**
             * @see {@link https://github.com/rorkflash/ejs-webpack-loader}
             */
            // template: templates[templateName].template,
            // template: `!!ejs-webpack-loader!${templates[templateName].template}`,
            template: `${paths.src}/layout.js`,
            title: templates[templateName].title,
            name: templates[templateName].name,
            type: templates[templateName].type,
            page: getFilename(templates[templateName].template),
            filename: `${templateName}.html`,
            inject: true,
            chunks: ['main'],
            minify: {
                removeComments: false,
                collapseWhitespace: false,
                removeRedundantAttributes: false,
                removeScriptTypeAttributes: false,
                removeStyleLinkTypeAttributes: false,
                useShortDoctype: false
            }
        });
    });
}

module.exports = {
    // Where webpack looks to start building the bundle
    entry: {
        main: paths.src + '/index.js'
    },

    // Where webpack outputs the assets and bundles
    output: {
        path: paths.build,
        filename: '[name].bundle.js',
        publicPath: '/'
    },

    // Force Webpack to target web not node.js
    // This was set becasue Webpack server wasn't reloading the browser on change while using browserslist
    target: 'web', // <=== although default is 'web' but it can't be omitted

    // Get the current file name for logger
    // This one is preventing ESLint errors from showing on the console
    // context: __dirname,
    node: {
        __filename: true
    },

    resolve: {
        alias: {
            '@scripts': paths.src + '/assets/scripts',
            '@styles': paths.src + '/assets/styles',
            '@components': paths.src + '/components'
        }
    },

    // Customize the webpack build process
    plugins: [
        // Removes/cleans build folders and unused assets when rebuilding
        new CleanWebpackPlugin(),

        // Copies files from target to destination folder
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: paths.public,
                    to: '',
                    globOptions: {
                        ignore: ['*.DS_Store']
                    },
                    noErrorOnMissing: true
                }
            ]
        })
    ]

        // Join our HTML plugin array at the end
        .concat(generateHtmlPlugin()),

    // Determine how modules within the project are treated
    module: {
        rules: [
            // JavaScript: Use Babel to transpile JavaScript files
            { test: /\.js$/, exclude: /(node_modules)/, use: ['babel-loader'] },

            // Solve assets URL's
            {
                test: [/\.(ico|gif|png|jpg|jpeg|webmanifest|xml|woff(2)?|eot|ttf|otf|svg)$/],
                use: {
                    loader: 'file-loader',
                    options: {
                        // If we wish to not write .default on each require
                        // esModule: false,
                        outputPath: (url, resourcePath) => {
                            // `resourcePath` is original absolute path to asset

                            if (/favicons/.test(resourcePath)) {
                                return `assets/media/favicons/${url}`;
                            }

                            if (/flags/.test(resourcePath)) {
                                return `assets/media/flags/${url}`;
                            }

                            if (/media/.test(resourcePath)) {
                                return `assets/media/${url}`;
                            }

                            if (/fonts/.test(resourcePath)) {
                                return `assets/fonts/${url}`;
                            }

                            return `assets/media/${url}`; // It's added for PhotoSwipe images
                        },
                        name: '[name].[ext]'
                    }
                }
            }
        ]
    }
};
