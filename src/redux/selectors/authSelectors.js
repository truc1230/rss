import { createSelector } from 'reselect';

const selectAuth = (state) => state?.auth;

const isAuthSelector = createSelector(selectAuth, (state) => {
    return !!state?.user;
});

const userSelector = createSelector(selectAuth, (state) => {
    return state?.user;
});

const userKycStatusSelector = createSelector(selectAuth, (state) => {
    return state?.user?.kycStatus || 0;
});

const AuthSelector = {
    userKycStatusSelector,
    isAuthSelector,
    userSelector,
};

export default AuthSelector;
