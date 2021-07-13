const { merge } = require('webpack-merge');

const StylelintPlugin = require('stylelint-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const PrettierPlugin = require('prettier-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');

const paths = require('./paths');
const common = require('./webpack.common');

module.exports = merge(common, {
    mode: 'production',
    devtool: false,
    output: {
        path: paths.build,
        publicPath: '',
        filename: '[name].bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.(scss|css)$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 2,
                            sourceMap: false,
                            modules: false
                        }
                    },
                    'postcss-loader',
                    'sass-loader',
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
    },
    plugins: [
        // StyleLint configuration
        new StylelintPlugin({
            emitError: true,
            emitWarning: true,
            failOnError: false,
            failOnWarning: false,
            quiet: false
        }),

        // ESLint configuration
        new ESLintPlugin({
            files: ['.', 'src', 'config'],
            exclude: [],
            formatter: 'table'
        }),

        // Prettier configuration
        new PrettierPlugin(),

        // Extracts CSS into separate files
        // Note: style-loader is for development, MiniCssExtractPlugin is for production
        new MiniCssExtractPlugin({
            filename: 'app.[name].css',
            chunkFilename: '[id].css'
        }),

        /**
         * @todo Extract media queries
         * {
                sm: '(min-width: 568px)',
                md: '(min-width: 768px)',
                lg: '(min-width: 992px)',
                xl: '(min-width: 1200px)',
                xxl: '(min-width: 1600px)'
            }
         */

        /**
         * Optimize images
         * @see {@link https://webpack.js.org/plugins/image-minimizer-webpack-plugin/}
         * @see {@link https://www.npmjs.com/package/image-minimizer-webpack-plugin/}
         */
        new ImageMinimizerPlugin({
            minimizerOptions: {
                // Lossless optimization with custom option
                // Feel free to experiment with options for better result for you
                plugins: [
                    ['jpegtran', { progressive: true }],
                    ['optipng', { optimizationLevel: 5 }],
                    [
                        'svgo',
                        {
                            plugins: [
                                {
                                    removeViewBox: false
                                },
                                {
                                    cleanupIDs: false
                                }
                            ]
                        }
                    ]
                ]
            }
        })
    ],
    optimization: {
        minimize: true,
        minimizer: [new CssMinimizerPlugin(), '...'],
        // Once your build outputs multiple chunks, this option will ensure they share the webpack runtime
        // instead of having their own. This also helps with long-term caching, since the chunks will only
        // change when actual code changes, not the webpack runtime.
        runtimeChunk: {
            name: 'runtime'
        }
    },
    performance: {
        hints: false,
        maxEntrypointSize: 512000,
        maxAssetSize: 512000
    }
});
