const path = require('path');

module.exports = {
    // Source files
    src: path.resolve(__dirname, '../src'),

    // Production build files
    build: path.resolve(__dirname, '../dist'),

    // Static files that get copied to build folder
    public: path.resolve(__dirname, '../public'),

    // Partial HTML files that get injected into HTML template
    partials: path.resolve(__dirname, '../src/partials')
};
