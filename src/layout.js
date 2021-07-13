/**
 * Template Layout Wrapper
 * Read more how this works here: @see {@link https://webpack.js.org/guides/dependency-management/}
 * Github issue: @see {@link https://github.com/jantimon/html-webpack-plugin/issues/1330}
 * SandBox: @see {@link https://codesandbox.io/s/html-webpack-plugin--layout-6lz5f?file=/src/layout.js:0-393}
 */
module.exports = (templateData) => {
    const { page } = templateData.htmlWebpackPlugin.options;
    return (
        require('!!ejs-webpack-loader!./partials/head.ejs')(templateData) +
        require(`!!ejs-webpack-loader!./pages/${page}.ejs`)(templateData) +
        require('!!ejs-webpack-loader!./partials/foot.ejs')(templateData)
    );
};
