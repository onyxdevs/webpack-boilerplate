import { logger, debounce } from '@scripts/utils';

const Header = {
    DOM: {
        bodyEl: document.querySelector('body'),
        headerEl: document.querySelector('.header'),
        burgerEl: document.querySelector('.header__burger'),
        mainEl: document.querySelector('main'),
        navLinksEls: document.querySelectorAll('.main-nav__link')
    },

    /**
     * @returns {void}
     */
    init() {
        if (!this.DOM.headerEl) return;

        logger.debug(__filename, `👷🏼‍♀️ header is gonna stick!`);
        window.addEventListener('scroll', this.stickyHeader(this.DOM.headerEl));

        setTimeout(this.setPagePadding.bind(Header), 100);
        window.addEventListener('resize', debounce(this.setPagePadding.bind(Header), 200));

        this.initBurger();
        this.cleanNavEmptyHrefs();
    },

    /**
     * @returns {Function} debounce
     */
    setPagePadding() {
        const headerHeight = parseInt(this.DOM.headerEl.offsetHeight, 10);
        logger.debug(__filename, `📏 header height is ${headerHeight}`);
        this.DOM.mainEl.style.paddingTop = headerHeight + 'px';
    },

    /**
     * @param {HTMLElement} el
     * @returns {Function} debounce
     */
    stickyHeader(el) {
        return () => {
            if (window.pageYOffset > 0 && !el.classList.contains('scrolled')) {
                el.classList.add('scrolled');
            }
            if (window.pageYOffset <= 0 && el.classList.contains('scrolled')) {
                el.classList.remove('scrolled');
            }
        };
    },

    /**
     * @returns {void}
     */
    initBurger() {
        const delay = 150;

        this.DOM.burgerEl.addEventListener('click', () => {
            if (this.DOM.bodyEl.classList.contains('menu-opened')) {
                this.DOM.bodyEl.classList.add('menu-triggered');
                this.DOM.bodyEl.classList.remove('menu-opened');
                setTimeout(() => {
                    this.DOM.bodyEl.classList.remove('menu-triggered');
                }, delay);
            } else {
                this.DOM.bodyEl.classList.add('menu-triggered');
                setTimeout(() => {
                    this.DOM.bodyEl.classList.add('menu-opened');
                    this.DOM.bodyEl.classList.remove('menu-triggered');
                }, delay);
            }
        });
    },

    /**
     * @returns {void}
     */
    cleanNavEmptyHrefs() {
        this.DOM.navLinksEls.forEach((el) => {
            const href = el.getAttribute('href');
            if (!href || href === '#') {
                const newEl = document.createElement('span');
                newEl.classList = el.classList;
                newEl.innerHTML = el.innerHTML;
                el.parentNode.insertBefore(newEl, el.nextSibling);
                el.remove();
            }
        });
    }
};

window.addEventListener('DOMContentLoaded', Header.init.bind(Header));
