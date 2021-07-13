import { logger } from '@scripts/utils';
import Alert from '../alert';

const Forms = {
    DOM: {
        formsEls: document.querySelectorAll('.form')
    },
    alertTimeout: null,

    /**
     * @returns {void}
     */
    init() {
        if (!this.DOM.formsEls.length) {
            return;
        }

        logger.debug(__filename, `👷🏼‍♀️ forms are being initialized!`);
        this.DOM.formsEls.forEach(this.initForm.bind(Forms));
    },

    /**
     * @param {HTMLElement}
     * @returns {void}
     */
    initForm(el) {
        el.addEventListener('submit', this.submitHandler.bind(Forms));
    },

    /**
     * @param {Event}
     * @returns {void}
     */
    submitHandler(e) {
        e.preventDefault();

        const formEl = e.target;
        const url = formEl.getAttribute('action');

        formEl.classList.add('loading');
        if (this.alertTimeout) {
            clearTimeout(this.alertTimeout);
        }

        // Select just the appended alert
        const alert = formEl.querySelector('input + .alert');
        if (alert) {
            alert.remove();
        }

        fetch(url, {
            method: 'POST',
            body: new FormData(formEl)
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return Promise.reject(response);
            })
            .then((response) => {
                if (response.success) {
                    this.handleFormSuccess(formEl, response.msg);
                } else {
                    this.handleFormErrors(formEl, response.data);
                }
            })
            .catch(() => {
                console.warn('Could not submit the form!', Alert);
            })
            .finally(() => {
                formEl.classList.remove('loading');
            });
    },

    /**
     * @param {HTMLElement} formEl
     * @param {Object[]}
     * @returns {void}
     */
    handleFormErrors(formEl, errors) {
        const keys = Object.keys(errors);
        const len = keys.length;
        const errorsStrings = [];
        for (let i = 0; i < len; i += 1) {
            const error = errors[keys[i]];
            errorsStrings.push(error);
        }
        const alert = Alert('danger', errorsStrings.join('\n'));
        formEl.append(alert);
        this.alertTimeout = setTimeout(() => {
            alert.remove();
        }, 10000);
    },

    /**
     * @param {HTMLElement} formEl
     * @param {String} msg
     * @returns {void}
     */
    handleFormSuccess(formEl, msg) {
        const alert = Alert('success', msg);
        formEl.append(alert);
        this.alertTimeout = setTimeout(() => {
            alert.remove();
        }, 10000);
        this.resetForm(formEl);
    },

    /**
     * Reset form
     * @returns {void}
     */
    resetForm(formEl) {
        const fieldsEls = formEl.querySelectorAll(
            'input:not([type="radio"]):not([type="checkbox"]):not([type="hidden"]), select, textarea'
        );
        const checkEls = formEl.querySelectorAll('[type="radio"], [type="checkbox"]');
        for (let i = 0; i < fieldsEls.length; i += 1) {
            fieldsEls[i].value = '';
        }
        for (let i = 0; i < checkEls.length; i += 1) {
            checkEls[i].checked = false;
        }
    }
};

document.addEventListener('DOMContentLoaded', Forms.init.bind(Forms));
