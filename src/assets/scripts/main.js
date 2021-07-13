import { logger } from '@scripts/utils';

/**
 * Check JS disabling
 * @returns {void}
 */
function checkJs() {
    const html = document.querySelector('html');
    if (html.classList.contains('no-js')) {
        html.classList.remove('no-js');
    }
}

/**
 * Creates a global warning message in the body element
 * @param {String} message
 * @returns {void}
 */
function createGlobalWarning(message) {
    const warning = document.createElement('div');
    warning.classList.add('global-warning');

    warning.innerHTML = message;

    // Prepend to body
    const body = document.querySelector('body');
    body.style.overflow = 'hidden';
    if (body.firstChild) {
        body.insertBefore(warning, body.firstChild);
    } else {
        body.appendChild(warning);
    }
}

/**
 * Detect browser
 * @returns {void}
 */
function detectBrowser() {
    const container = document.querySelector('html');

    // Detect touch devices
    if (!('ontouchstart' in document.documentElement)) {
        container.classList.add('no-touch');
    } else {
        container.classList.add('touch');
    }

    // Disable everything for IE
    const ua = window.navigator.userAgent;
    const msie = ua.indexOf('MSIE '); // IE 10 or older
    const trident = ua.indexOf('Trident/'); // IE 11

    if (msie > 0 || trident > 0) {
        createGlobalWarning(
            '<span>⊘</span>Internet Explorer desteklenmiyor!<br />Lütfen bu web sitesini modern bir tarayıcıdan açın.'
        );
    }
}

/**
 * Highlight the current menu item
 * @returns {void}
 */
function setActiveNav() {
    // Get current page URL
    let url = window.location.href;

    // remove # from URL
    url = url.substring(0, url.indexOf('#') === -1 ? url.length : url.indexOf('#'));

    // remove parameters from URL
    url = url.substring(0, url.indexOf('?') === -1 ? url.length : url.indexOf('?'));

    // select file name
    url = url.substr(url.lastIndexOf('/') + 1);

    // If file name not avilable
    if (url === '') {
        url = '/';
    }

    // Loop all menu items
    const links = document.querySelectorAll('nav ul a');
    links.forEach((link) => {
        // select href
        const href = link.getAttribute('href');

        // Check filename
        if ((href.includes(url) && url !== '/') || (href === '/' && url === '/')) {
            // Add active class
            link.parentElement.classList.add('active');

            // Add active class to parent item if in submenu
            const submenu = link.closest('.side-nav__sub');
            if (submenu) {
                submenu.parentElement.classList.add('active');
            }
        }
    });
}

/**
 * Sets the current year
 * @returns {void}
 */
function setCurrentYear() {
    const fullDate = new Date();
    const fullYear = fullDate.getFullYear();
    const els = document.querySelectorAll('[data-current-year]');

    // Even if there was a year in the container it will overwrite it
    for (let i = 0; i < els.length; i += 1) {
        els[i].innerHTML = fullYear;
    }
}

/**
 * Detect horizontal scrollbar
 */
function hasScrollbar() {
    // The Modern solution
    if (typeof window.innerWidth === 'number') return window.innerWidth > document.documentElement.clientWidth;

    // rootElem for quirksmode
    const rootElem = document.documentElement || document.body;

    // Check overflow style property on body for fauxscrollbars
    let overflowStyle;

    if (typeof rootElem.currentStyle !== 'undefined') overflowStyle = rootElem.currentStyle.overflow;

    overflowStyle = overflowStyle || window.getComputedStyle(rootElem, '').overflow;

    // Also need to check the Y axis overflow
    let overflowYStyle;

    if (typeof rootElem.currentStyle !== 'undefined') overflowYStyle = rootElem.currentStyle.overflowY;

    overflowYStyle = overflowYStyle || window.getComputedStyle(rootElem, '').overflowY;

    const contentOverflows = rootElem.scrollHeight > rootElem.offsetHeight;
    const overflowShown = /^(visible|auto)$/.test(overflowStyle) || /^(visible|auto)$/.test(overflowYStyle);
    const alwaysShowScroll = overflowStyle === 'scroll' || overflowYStyle === 'scroll';

    return (contentOverflows && overflowShown) || alwaysShowScroll;
}

/**
 * Add target="_blank" and rel="noopener noreferrer" for external links
 * @returns {void}
 */
function setTargetBlank() {
    // Remove subdomain of current site's url and setup regex
    const { host } = window.location;
    let internal = host.replace('www.', '');
    internal = new RegExp(internal, 'i');

    // Grab every link on the page
    const linksEls = document.querySelectorAll('a');

    linksEls.forEach((el) => {
        const currentLinkEl = el;

        // Fix links that doesn't have protocol
        const currentHref = currentLinkEl.getAttribute('href');
        if (currentHref.startsWith('www.')) {
            currentLinkEl.href = '//' + currentHref;
        }

        const href = currentLinkEl.host; // set the host of each link

        // Make sure the href doesn't contain current site's host
        if (!internal.test(href) && href) {
            const target = currentLinkEl.getAttribute('target');
            const rel = currentLinkEl.getAttribute('rel');

            // Check if it's previously had target
            if (!target) {
                currentLinkEl.setAttribute('target', '_blank');
            }

            // Check rel attr
            if (!rel) {
                currentLinkEl.setAttribute('rel', 'noopener noreferrer');
            }
        }
    });
}

checkJs();
detectBrowser();

/**
 * Fires when DOM content is loaded
 */
document.addEventListener('DOMContentLoaded', () => {
    setCurrentYear();
    setActiveNav();
    setTargetBlank();

    if (hasScrollbar()) {
        logger.error('🚫 the window has horizontal scrollbar!');
    }
});
