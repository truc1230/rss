/* eslint-disable no-mixed-spaces-and-tabs */
// @ts-nocheck
import cookie from 'react-cookies';

const mandatory = () => {
    throw new Error('Storage Missing parameter!');
};

export default class Storage {
    #name;

    #options = {};

    constructor(name = mandatory(), value = {}, options = {}) {
        this.#name = name;
        this.#options = options;

        if (!this.value) {
            this.value = value;
        }
    }

    get value() {
        return cookie.load(this.#name);
    }

    set value(value) {
        cookie.save(this.#name, value, {
            path: '/',
            maxAge: 365 * 24 * 60 * 60,
            ...this.#options
        });
    }

    // eslint-disable-next-line class-methods-use-this
    get allCookies() {
        return cookie.loadAll();
    }

    destroy = (next = (f) => f) => {
        cookie.remove(this.#name, {
            path: '/',
            maxAge: 365 * 24 * 60 * 60,
            ...this.#options
        });
        next();
    };
}