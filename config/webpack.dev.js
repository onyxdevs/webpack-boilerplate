// const webpack = require('webpack');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const paths = require('./paths');

module.exports = merge(common, {
    // Set the mode to development or production
    mode: 'development',

    // Control how source maps are generated
    devtool: 'inline-source-map',

    // Spin up a server for quick development
    devServer: {
        historyApiFallback: true,

        // This is where webpack-dev-server serves your static
        // pages. In this example configuration, put your shell
        // page index.html in './views' directory, and it becomes
        // accessible from:
        // http://localhost/index.html
        contentBase: paths.build,
        // Make webpack-dev-server live-reload when your
        // shell page changes
        // watchContentBase: true,

        /**
         * Only output when errors and warnings happen
         * @see {@link https://webpack.js.org/configuration/stats/}
         */
        stats: 'errors-only',

        open: true,
        compress: true,
        // hot: true,
        port: 8080
    },

    // Hide performance hints
    performance: { hints: false },

    module: {
        rules: [
            // Styles: Inject CSS into the head with source maps
            {
                test: [/\.(sa|sc|c)ss$/],
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true,
                            importLoaders: 1,
                            modules: false
                        }
                    },
                    { loader: 'postcss-loader', options: { sourceMap: true } },
                    { loader: 'sass-loader', options: { sourceMap: true } },
                    {
                        loader: 'sass-resources-loader',
                        options: {
                            resources: [
                                paths.src + '/assets/styles/abstracts/_variables.scss',
                                paths.src + '/assets/styles/abstracts/_mixins.scss'
                            ]
                        }
                    }
                ]
            }
        ]
    }
});
