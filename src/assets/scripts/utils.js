/**
 * @param {HTMLElement} form
 * @returns {void}
 */
export const resetForm = (form) => {
    const fields = form.querySelectorAll('input, textarea');
    for (let i = 0; i < fields.length; i += 1) {
        fields[i].value = '';
    }
};

class Logger {
    constructor() {
        this.logs = [];

        // Markis console note
        if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1) {
            const t = [
                '\n %c Made with ♥ by Markis Creative %c %c %c http://markis.com.tr/ \n\n',
                'color: #fff; background: #b21766; padding:5px 0;',
                'background: #494949; padding:5px 0;',
                'background: #494949; padding:5px 0;',
                'color: #fff; background: #1c1c1c; padding:5px 0;'
            ];
            window.console.log.apply(console, t);
        } else if (window.console) {
            window.console.log('Made with love ♥ Markis Creative - http://markis.com.tr/');
        }
    }

    /**
     * Runs only on development environment
     * @returns {void}
     */
    debug(...args) {
        if (process.env.NODE_ENV !== 'development') return;

        // Convert arguments to cleaned array
        const newArgs = [...args];

        const filePath = newArgs[0];
        const fileName = filePath.replace(/^.*[\\/]/, '');

        newArgs[0] = '%c' + fileName;
        newArgs.splice(1, 0, 'color: #1c6ef7; font-weight: bold;');

        this.logs.push({
            type: 'DEBUG',
            date: new Date(Date.now()).toISOString(),
            log: newArgs
        });

        console.log(...newArgs);
    }

    /**
     * Runs only on production environment
     * @returns {void}
     */
    silly(...args) {
        if (process.env.NODE_ENV !== 'production') return;

        // Convert arguments to cleaned array
        const newArgs = [...args];

        const filePath = newArgs[0];
        const fileName = filePath.replace(/^.*[\\/]/, '');

        newArgs[0] = '%c' + fileName;
        newArgs.splice(1, 0, 'color: #1c6ef7; font-weight: bold;');

        this.logs.push({
            type: 'DEBUG',
            date: new Date(Date.now()).toISOString(),
            log: newArgs
        });

        console.log(...newArgs);
    }

    /**
     * Runs anywhere
     * @returns {void}
     */
    error(...args) {
        // Convert arguments to cleaned array
        const newArgs = [...args];

        newArgs[0] = '%c' + newArgs[0];
        newArgs.splice(1, 0, 'color: red; font-weight: bold;');

        this.logs.push({
            type: 'ERROR',
            date: new Date(Date.now()).toISOString(),
            log: newArgs
        });

        console.error(...newArgs);
    }
}

// Export logger instance
export const logger = new Logger();

/**
 * @param {HTMLElement} image
 * @returns {Promise}
 */
export const preloadImage = (image) => {
    const newImage = image;

    return new Promise((resolve, reject) => {
        newImage.onload = () => resolve(newImage);
        newImage.onerror = () => reject(new Error(`Failed to load image's URL: ${newImage.dataset.src}`));
        if (newImage.dataset.srcset !== undefined) newImage.srcset = newImage.dataset.srcset;
        if (newImage.dataset.src !== undefined) newImage.src = newImage.dataset.src;
    });
};

/**
 * @param {HTMLElement} el
 * @returns {Promise}
 */
export const waitForTransition = (el) => {
    return new Promise((resolve) => el.addEventListener('transitionend', () => resolve(el), false));
};

/**
 * @returns {Boolean}
 */
export const isTouch = () => {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
};

/**
 * Debounce so filtering doesn't happen every millisecond
 * Originally inspired by  David Walsh (https://davidwalsh.name/javascript-debounce-function)
 * Returns a function, that, as long as it continues to be invoked, will not
 * be triggered. The function will be called after it stops being called for
 * `wait` milliseconds.
 *
 * @param {Function} fn
 * @param {Number} threshold
 * @returns {Function}
 */
export const debounce = (func, wait) => {
    let timeout;

    // This is the function that is returned and will be executed many times
    // We spread (...args) to capture any number of parameters we want to pass
    return function executedFunction(...args) {
        // The callback function to be executed after
        // the debounce time has elapsed
        const later = () => {
            // null timeout to indicate the debounce ended
            timeout = null;

            // Execute the callback
            func(...args);
        };
        // This will reset the waiting every function execution.
        // This is the step that prevents the function from
        // being executed because it will never reach the
        // inside of the previous setTimeout
        clearTimeout(timeout);

        // Restart the debounce waiting period.
        // setTimeout returns a truthy value (it differs in web vs Node)
        timeout = setTimeout(later, wait);
    };
};

/**
 * Promisified XHR
 *
 * @param {Object} opts
 * @returns {Promise}
 */
export const makeRequest = (opts) => {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        const errorWithData = new Error('Error fetching data.');
        errorWithData.status = '';
        errorWithData.statusText = '';

        xhr.open(opts.method, opts.url);

        // eslint-disable-next-line func-names
        xhr.onload = function () {
            if (this.status >= 200 && this.status < 300) {
                resolve(xhr.response);
            } else {
                errorWithData.status = this.status;
                errorWithData.statusText = xhr.statusText;
                reject(errorWithData);
            }
        };

        // eslint-disable-next-line func-names
        xhr.onerror = function () {
            errorWithData.status = this.status;
            errorWithData.statusText = xhr.statusText;
            reject(errorWithData);
        };

        if (opts.headers) {
            Object.keys(opts.headers).forEach((key) => {
                xhr.setRequestHeader(key, opts.headers[key]);
            });
        }

        if (typeof opts.withCredentials !== 'undefined') {
            xhr.withCredentials = opts.withCredentials;
        }

        let { params } = opts;
        // We'll need to stringify if we've been given an object
        // If we have a string, this is skipped.
        if (params && typeof params === 'object') {
            params = Object.keys(params)
                .map((key) => {
                    return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
                })
                .join('&');
        }
        xhr.send(params);
    });
};

/**
 * Promisified timeout
 *
 * @param {Number} delay
 * @returns {Promise}
 */
export const delay = (time = 100) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, time);
    });
};
