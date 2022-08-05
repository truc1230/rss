import { createSelector } from 'reselect';

const selectWallet = (state) => state?.wallet;

const membershipSelector = createSelector(selectWallet, (state) => {
    return state?.MEMBERSHIP || {};
});

const spotSelector = createSelector(selectWallet, (state) => {
    return state?.SPOT || {};
});

const WalletSelector = {
    membershipSelector,
    spotSelector,
};

export default WalletSelector;
