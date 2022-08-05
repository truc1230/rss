import Storage from './storage';

class AuthStorage extends Storage {
    get loggedIn() {
        return !!this.value?.accessToken;
    }

    get accessToken() {
        return this.value?.accessToken;
    }

    get refreshToken() {
        return this.value?.refreshToken;
    }

    get clientId() {
        return this.value?.clientId;
    }

    get token() {
        return this.value?.token;
    }

    get userId() {
        return this.value?.userId;
    }

    get role() {
        return this.value?.role;
    }
}

export default new AuthStorage('AUTH');
