import { logger, preloadImage } from '@scripts/utils';

import '../styles/lazyload.scss';

const Lazyload = {
    imagesEls: document.querySelectorAll('.lazy-loading'),

    init() {
        logger.debug(__filename, `👷🏼‍♀️ lazyload is being initialized!`);

        if (window.IntersectionObserver) {
            this.observer();
        } else {
            this.fallback();
        }
    },

    observer() {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const image = entry.target.querySelector('img');
                    const dataSrcset = image.dataset.srcset;
                    const dataSrc = image.dataset.src;
                    const src = image.getAttribute('src');
                    const srcset = image.getAttribute('srcset');

                    if (dataSrcset === srcset && dataSrc === src) {
                        return;
                    }

                    if (entry.isIntersecting) {
                        // And then..
                        preloadImage(image)
                            .then(() => {
                                entry.target.classList.add('lazy-loaded');
                            })
                            .catch((error) => console.error(error));

                        observer.unobserve(entry.target);
                    }
                });
            },
            { rootMargin: '100px 0px 100px 0px' }
        );

        this.imagesEls.forEach((item) => {
            observer.observe(item);
        });
    },

    fallback() {
        this.imagesEls.forEach((item) => {
            const image = item.querySelector('img');
            preloadImage(image)
                .then(() => {
                    item.classList.add('lazy-loaded');
                })
                .catch((error) => console.error(error));
        });
    }
};

document.addEventListener('DOMContentLoaded', Lazyload.init.bind(Lazyload));
