# Weboack Boilerplate 🚀

## Todos

-   [ ] Remove file-loader and raw-loader in favor of asset modules.
-   [ ] JavaScript Form validation.

## Features

-   [Webpack](https://webpack.js.org/)
-   [Babel](https://babeljs.io/)
-   [Sass](https://sass-lang.com/)
-   [PostCSS](https://postcss.org/)
-   [EJS](https://github.com/rorkflash/ejs-webpack-loader)
-   [Bootstrap](https://getbootstrap.com/)
-   Vanilla JS (plain JavaScript)
-   Lazyloading
-   Parallax

## Pages

New pages are added in "config/templates", then an EJS file should be created accordingly in "src/pages". Now there is only one page as a demo.

## Components

-   alert
    -   alert--danger
    -   alert--success
    -   alert--info
    -   alert--warning
-   banner
    -   banner--none
-   button
    -   btn-bordered
    -   btn
        -   btn--primary
        -   btn--none
        -   btn--danger
        -   btn--success
        -   btn--grey
        -   btn--fullwidth
        -   btn--has-icon
-   footer
-   form
    -   form--limited-width
        -   Checkbox
        -   File
        -   Select
        -   Switch
        -   Text
-   header
    -   main-nav
-   langs
-   news
-   pagination
-   socials
-   text-block

## Scripts

### Utility functions

Located in "src/assets/scripts/utils.js"

-   resetForm();
-   Logger
    -   .debug();
    -   .silly();
    -   .error();
-   preloadImage();
-   waitForTransition();
-   isTouch();
-   debounce();
-   makeRequest(); // Promisified XHR
-   delay(); // Promisified timeout

### Main scripts

Located in "src/assets/scripts/main.js"

-   checkJs(); // Checks JS disabling
-   createGlobalWarning(message); // Creates a global warning message in the body element
-   detectBrowser();
-   setActiveNav();
-   setCurrentYear();
-   hasScrollbar(); // Detects horizontal scrollbar
-   setTargetBlank(); // Add target="\_blank" and rel="noopener noreferrer" for external links

### Parallax

Located in "src/assets/scripts/parallax.js"

Define the parallax type as an HTML attribute for the element (data-parallax=""), it takes scale and positionY as a value.
Set the parallax strength as an HTML attribute for the element (data-parallax-ratio=".5")
Parallax ratio can be specified for each breakpoint like the following:
data-parallax-ratio-lg
data-parallax-ratio-md
data-parallax-ratio-sm

### Lazyloading

Located in "src/assets/scripts/lazyloading.js"
Styles are in "src/assets/styles/lazyloading.scss"

Each lazy-loaded image should have width and height, and on the wrapping "figure" tag we add its aspect ratio as a "padding-bottom" style rule.
Bottom padding is calculated this way:

**(height / width) \* 100**

The HTML markup of a lazy-loaded image is:

```html
<figure class="lazy-loading" style="padding-bottom: 75%;">
    <img
        class=""
        alt=""
        width="800"
        height="600"
        src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
        data-src="./link-to-image"
    />
    <span class="lazy-loading__loader"></span>
    <noscript><img src="./link-to-image" alt="" /></noscript>
</figure>
```

> (600 / 800) \* 100 = 75

## Styles

We're using BEM methodology for naming.

### Helper CSS classes

#### Spaces

-   .mb-xs
-   .mb-sm
-   .mb-md
-   .mb-lg
-   .mb-xl
-   .mb-subsection
-   .mb-section

#### Hide elements

-   .hide-md
-   .hide-lg

#### Alignment

-   .text-left
-   .text-center
-   .text-right

### SCSS Variables

You can view/edit the available SCSS variables in "src/assets/styles/abstracts/\_variables.scss".

```css
// Colors
$primary-accent: #1c6ef7;
$secondary-accent: rgb(119, 223, 255);
$main-bg-color: #f4f6f8;
$dark-bg-color: #0f1547;
$dark-bg-color-shaded: #171e5a;
$font-dark-color: #00315c;
$font-light-color: rgba($font-dark-color, 0.5);
$border-color: rgba($font-dark-color, 0.1);

$success-color: #35c636;
$danger-color: #ed2554;
$warning-color: #de9c3e;

// Border radius
$box-corner: 1rem;

// Spaces
$container-spacing: 4vw;
```

### SCSS Mixins

You can view/edit the available SCSS mixins in "src/assets/styles/abstracts/\_mixins.scss".

-   sm
-   md
-   lg
-   xl
-   xxl
-   abs-center
-   absolute
-   fixed
-   relative

## Dependencies

### Development

#### webpack

-   [`webpack`](https://github.com/webpack/webpack) - Module and asset bundler.
-   [`webpack-cli`](https://github.com/webpack/webpack-cli) - Command line interface for webpack
-   [`webpack-dev-server`](https://github.com/webpack/webpack-dev-server) - Development server for webpack
-   [`webpack-merge`](https://github.com/survivejs/webpack-merge) - Simplify development/production configuration
-   [`cross-env`](https://github.com/kentcdodds/cross-env) - Cross platform configuration

#### Babel

-   [`@babel/core`](https://www.npmjs.com/package/@babel/core) - Transpile ES6+ to backwards compatible JavaScript
-   [`@babel/plugin-proposal-class-properties`](https://babeljs.io/docs/en/babel-plugin-proposal-class-properties) - Use properties directly on a class (an example Babel config)
-   [`@babel/preset-env`](https://babeljs.io/docs/en/babel-preset-env) - Smart defaults for Babel

#### Loaders

-   [`babel-loader`](https://webpack.js.org/loaders/babel-loader/) - Transpile files with Babel and webpack
-   [`ejs-webpack-loader`](https://github.com/rorkflash/ejs-webpack-loader) - EJS loader for webpack. Uses [ejs](https://github.com/mde/ejs) function to compile templates.
-   [`sass-loader`](https://webpack.js.org/loaders/sass-loader/) - Load SCSS and compile to CSS
    -   [`node-sass`](https://github.com/sass/node-sass) - Node Sass
    -   [`sass-resources-loader`](https://github.com/shakacode/sass-resources-loader) - This loader will load your SASS resources into every required SASS module.
-   [`postcss-loader`](https://webpack.js.org/loaders/postcss-loader/) - Process CSS with PostCSS
    -   [`postcss-preset-env`](https://www.npmjs.com/package/postcss-preset-env) - Sensible defaults for PostCSS
-   [`css-loader`](https://webpack.js.org/loaders/css-loader/) - Resolve CSS imports
-   [`style-loader`](https://webpack.js.org/loaders/style-loader/) - Inject CSS into the DOM
-   [`file-loader`](https://v4.webpack.js.org/loaders/file-loader/) - The file-loader resolves import/require() on a file into a url and emits the file into the output directory.
-   [`html-loader`](https://webpack.js.org/loaders/html-loader/) - Exports HTML as string. HTML is minimized when the compiler demands.
-   [`raw-loader`](https://v4.webpack.js.org/loaders/raw-loader/) - A loader for webpack that allows importing files as a String.

#### Plugins

-   [`clean-webpack-plugin`](https://github.com/johnagan/clean-webpack-plugin) - Remove/clean build folders
-   [`copy-webpack-plugin`](https://github.com/webpack-contrib/copy-webpack-plugin) - Copy files to build directory
-   [`html-webpack-plugin`](https://github.com/jantimon/html-webpack-plugin) - Generate HTML files from template
-   [`mini-css-extract-plugin`](https://github.com/webpack-contrib/mini-css-extract-plugin) - Extract CSS into separate files
-   [`css-minimizer-webpack-plugin`](https://webpack.js.org/plugins/css-minimizer-webpack-plugin/) - Optimize and minimize CSS assets
-   [`image-minimizer-webpack-plugin`](https://github.com/webpack-contrib/image-minimizer-webpack-plugin/) - Optimize images
    -   [`imagemin-jpegtran`](https://github.com/imagemin/imagemin-jpegtran)
    -   [`imagemin-optipng`](https://github.com/imagemin/imagemin-optipng)
    -   [`imagemin-svgo`](https://github.com/imagemin/imagemin-svgo)

#### Linters

-   [`eslint`](https://github.com/eslint/eslint) - Enforce styleguide across application
-   [`eslint-config-airbnb-base`](https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb-base) - Base styleguide to enforce rules
-   [`eslint-config-prettier`](https://github.com/prettier/eslint-config-prettier) - Implment prettier rules
-   [`eslint-plugin-import`](https://github.com/benmosher/eslint-plugin-import) - Implment import rules
-   [`eslint-plugin-prettier`](https://github.com/prettier/eslint-plugin-prettier) - Dependency for prettier usage with ESLint
-   [`eslint-import-resolver-webpack`](https://github.com/benmosher/eslint-plugin-import/tree/master/resolvers/webpack) - Throw exceptions for import/export in webpack
-   [`eslint-webpack-plugin`](https://github.com/webpack-contrib/eslint-webpack-plugin) - ESLint configuration for webpack
-   [`prettier`](https://github.com/prettier/prettier) - Dependency for `prettier-webpack-plugin` plugin
-   [`prettier-webpack-plugin`](https://github.com/hawkins/prettier-webpack-plugin) - Prettier configuration for webpack
-   [`stylelint`](https://github.com/stylelint/stylelint) - A mighty, modern linter that helps you avoid errors and enforce conventions in your styles.
    -   [`stylelint-webpack-plugin`](https://github.com/webpack-contrib/stylelint-webpack-plugin/) - Lint CSS/SCSS files
    -   [`stylelint-config-standard`](https://github.com/stylelint/stylelint-config-standard) Turns on additional rules to enforce the common stylistic conventions found within a handful of CSS styleguides
    -   [`stylelint-csstree-validator`](https://github.com/csstree/stylelint-validator) CSS syntax validator based on csstree as plugin for stylelint.
    -   [`stylelint-scss`](https://github.com/kristerkari/stylelint-scss) A collection of SCSS specific linting rules for stylelint (in a form of a plugin).

### Production

[`bootstrap`](https://getbootstrap.com/) Bootstrap is a free and open-source CSS framework directed at responsive, mobile-first front-end web development. It contains CSS- and JavaScript-based design templates for typography, forms, buttons, navigation, and other interface components.

## Open Graph Protocol

### Change Open Graph Protocol data before production to be dynamic for the current page:

Located in the head tag:

```html
<meta property="og:locale" content="tr-TR" />
<meta property="og:type" content="website" />
<meta property="og:title" content="Weboack Boilerplate" />
<meta property="og:description" content="" />
<meta property="og:url" content="https://onyxdev.net/" />
<meta property="og:site_name" content="Weboack Boilerplate" />
<meta property="og:image" content="LINK_TO_IMAGE" />
<meta property="og:image:type" content="image/jpeg" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta name="twitter:title" content="Weboack Boilerplate" />
<meta name="twitter:description" content="" />
<meta name="twitter:image" content="LINK_TO_IMAGE" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:image:alt" content="onyxdev.net" />
```

## General

## How to launch the project

Install [Node.js](https://nodejs.org/) and then open the Terminal/CMD and navigate to the project's folder.
Run the following command:

```bash
npm insatll
```

### Development evnironment

```bash
npm start
```

You can view the development server at `localhost:8080`.

### Production build

```bash
npm run build
```

# Author

[**Obada Qawwas**](https://onyxdev.net/)

## `Stay safe 😷`
