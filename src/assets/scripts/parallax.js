import { logger } from './utils';

/* eslint-disable indent */
/* eslint-disable no-nested-ternary */
/**
 * demo.js
 * http://www.codrops.com
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Copyright 2019, Codrops
 * http://www.codrops.com
 */

{
    // helper functions
    const MathUtils = {
        // map number x from range [a, b] to [c, d]
        map: (x, a, b, c, d) => ((x - a) * (d - c)) / (b - a) + c,
        // linear interpolation
        lerp: (a, b, n) => (1 - n) * a + n * b,
        // Random float
        getRandomFloat: (min, max) => (Math.random() * (max - min) + min).toFixed(2)
    };

    // calculate the viewport size
    let winsize;
    const calcWinsize = () => {
        winsize = { width: window.innerWidth, height: window.innerHeight };
    };
    calcWinsize();
    // and recalculate on resize
    window.addEventListener('resize', calcWinsize);

    // scroll position
    let docScroll;
    // scroll position update function
    const getPageYScroll = () => {
        docScroll = window.pageYOffset || document.documentElement.scrollTop;
    };
    window.addEventListener('scroll', getPageYScroll);

    class Item {
        constructor(el) {
            // the .item element
            this.DOM = { el };

            // Define parallax type
            this.DOM.image = this.DOM.el.dataset.parallax === 'scale' ? this.DOM.el : '';
            this.DOM.title = this.DOM.el.dataset.parallax === 'positionY' ? this.DOM.el : '';

            const positionYLg = parseFloat(el.dataset.parallaxRatioLg);
            const positionYMd = parseFloat(el.dataset.parallaxRatioMd);
            const positionYSm = parseFloat(el.dataset.parallaxRatioSm);
            let positionY = parseFloat(el.dataset.parallaxRatio);
            if (winsize.width >= 1200) {
                positionY = !Number.isNaN(positionYLg)
                    ? positionYLg
                    : !Number.isNaN(positionYMd)
                    ? positionYMd
                    : !Number.isNaN(positionYSm)
                    ? positionYSm
                    : positionY;
            } else if (winsize.width >= 768) {
                positionY = !Number.isNaN(positionYMd)
                    ? positionYMd
                    : !Number.isNaN(positionYSm)
                    ? positionYSm
                    : positionY;
            } else if (winsize.width >= 568) {
                positionY = !Number.isNaN(positionYSm) ? positionYSm : positionY;
            }

            this.renderedStyles = {
                // here we define which property will change as we scroll the page and the item is inside the viewport
                // in this case we will be:
                // - scaling the inner image
                // - translating the item's title
                // we interpolate between the previous and current value to achieve a smooth effect
                scaleEffect: {
                    // interpolated value
                    previous: 0,
                    // current value
                    current: 0,
                    // amount to interpolate
                    ease: 0.1,
                    // current value setter
                    setValue: () => {
                        const toValue = 1 + parseFloat(el.dataset.parallaxRatio); // 1.5
                        const fromValue = 1; // 1
                        const val = MathUtils.map(
                            this.props.top - docScroll,
                            winsize.height,
                            -1 * this.props.height,
                            fromValue,
                            toValue
                        );
                        return Math.max(Math.min(val, toValue), fromValue);
                    }
                },

                translateEffect: {
                    previous: 0,
                    current: 0,
                    ease: 0.1,
                    fromValue: positionY,
                    setValue: () => {
                        const { fromValue } = this.renderedStyles.translateEffect;
                        const toValue = -1 * fromValue;
                        const val = MathUtils.map(
                            this.props.top - docScroll,
                            winsize.height,
                            -1 * this.props.height,
                            fromValue,
                            toValue
                        );
                        return fromValue < 0
                            ? Math.min(Math.max(val, fromValue), toValue)
                            : Math.max(Math.min(val, fromValue), toValue);
                    }
                }
            };

            // gets the item's height and top (relative to the document)
            this.getSize();

            // set the initial values
            this.update();

            // use the IntersectionObserver API to check when the element is inside the viewport
            // only then the element styles will be updated
            this.observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    this.isVisible = entry.intersectionRatio > 0;
                });
            });

            this.observer.observe(this.DOM.el);

            // init/bind events
            this.initEvents();
        }

        update() {
            // sets the initial value (no interpolation)
            const renderedStylesKeys = Object.keys(this.renderedStyles);
            const renderedStylesLength = renderedStylesKeys.length;
            for (let i = 0; i < renderedStylesLength; i += 1) {
                const key = renderedStylesKeys[i];
                const value = this.renderedStyles[key].setValue();
                this.renderedStyles[key].current = value;
                this.renderedStyles[key].previous = value;
            }

            // apply changes/styles
            this.layout();
        }

        getSize() {
            const rect = this.DOM.el.getBoundingClientRect();
            this.props = {
                // item's height
                height: rect.height,
                // offset top relative to the document
                top: docScroll + rect.top
            };
        }

        initEvents() {
            window.addEventListener('resize', () => this.resize());
        }

        resize() {
            // gets the item's height and top (relative to the document)
            this.getSize();

            // on resize reset sizes and update styles
            this.update();
        }

        render() {
            // update the current and interpolated values
            const renderedStylesKeys = Object.keys(this.renderedStyles);
            const renderedStylesLength = renderedStylesKeys.length;
            for (let i = 0; i < renderedStylesLength; i += 1) {
                const key = renderedStylesKeys[i];
                this.renderedStyles[key].current = this.renderedStyles[key].setValue();
                this.renderedStyles[key].previous = MathUtils.lerp(
                    this.renderedStyles[key].previous,
                    this.renderedStyles[key].current,
                    this.renderedStyles[key].ease
                );
            }

            // and apply changes
            this.layout();
        }

        layout() {
            // scale the image
            if (this.DOM.image !== '')
                this.DOM.image.style.transform = `scale3d(${this.renderedStyles.scaleEffect.previous},${this.renderedStyles.scaleEffect.previous},1)`;

            // translate the title
            if (this.DOM.title !== '')
                this.DOM.title.style.transform = `translate3d(0,${this.renderedStyles.translateEffect.previous}px,0)`;
        }
    }

    const Parallax = {
        DOM: { main: document.querySelector('main') },
        items: [],
        // here we define which property will change as we scroll the page
        // in this case we will be translating on the y-axis
        // we interpolate between the previous and current value to achieve the smooth scrolling effect
        renderedStyles: {
            translationY: {
                // interpolated value
                previous: 0,
                // current value
                current: 0,
                // amount to interpolate
                ease: 0.1,
                // current value setter
                // in this case the value of the translation will be the same like the document scroll
                setValue: () => docScroll
            }
        },

        init() {
            logger.debug('[Parallax.js]', 'init');

            // the scrollable element
            // we translate this element when scrolling (y-axis)
            // !! this.DOM.scrollable = this.DOM.main.querySelector('div[data-scroll]');
            // the items on the page
            [...this.DOM.main.querySelectorAll('[data-parallax]')].forEach((item) => this.items.push(new Item(item)));

            // start the render loop
            requestAnimationFrame(() => this.render());
        },

        render() {
            // update the current and interpolated values
            const renderedStylesKeys = Object.keys(this.renderedStyles);
            const renderedStylesLength = renderedStylesKeys.length;
            for (let i = 0; i < renderedStylesLength; i += 1) {
                const key = renderedStylesKeys[i];
                this.renderedStyles[key].current = this.renderedStyles[key].setValue();
                this.renderedStyles[key].previous = MathUtils.lerp(
                    this.renderedStyles[key].previous,
                    this.renderedStyles[key].current,
                    this.renderedStyles[key].ease
                );
            }

            // for every item
            const itemsKeys = Object.keys(this.items);
            const itemsLength = itemsKeys.length;
            for (let i = 0; i < itemsLength; i += 1) {
                const item = this.items[itemsKeys[i]];
                // if the item is inside the viewport call it's render function
                // this will update item's styles, based on the document scroll value and the item's position on the viewport
                if (item.isVisible) {
                    if (item.insideViewport) {
                        item.render();
                    } else {
                        item.insideViewport = true;
                        item.update();
                    }
                } else {
                    item.insideViewport = false;
                }
            }

            // loop..
            requestAnimationFrame(() => this.render());
        }
    };

    document.addEventListener('DOMContentLoaded', () => {
        getPageYScroll();
        Parallax.init();
    });
}
