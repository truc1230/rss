import { createSelector } from 'reselect';

const selectExchangeConfig = (state) => state?.utils;

const assetConfigSelector = createSelector(selectExchangeConfig, (state) => {
    return state?.assetConfig;
});

const exchangeConfigSelector = createSelector(selectExchangeConfig, (state) => {
    return state?.exchangeConfig;
});

const UtilsSelector = {
    assetConfigSelector,
    exchangeConfigSelector,
};

export default UtilsSelector;
