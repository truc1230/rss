import { createSelector } from 'reselect';

const selectUser = (state) => state.user;

const selectUserKyc = state => state?.user?.kyc;
const SelectFormik = state => state?.user?.kyc?.country;

const userQuoteAssetSelector = createSelector(selectUser, (state) => {
    return state.quoteAsset;
});

const userKycSelector = createSelector(selectUserKyc, (state) => {
    return state.kycInfo;
});

const userKycIsLoadingSelector = createSelector(selectUserKyc, (state) => {
    return state.kycInfo.loading;
});

const userKycErrorSelector = createSelector(selectUserKyc, (state) => {
    return state.kycInfo.error;
});

const userKycDataSelector = createSelector(selectUserKyc, (state) => {
    return state.kycInfo.data;
});

const userKycInformationDataSelector = createSelector(selectUserKyc, (state) => {
    return state.kycInfo.data?.kycInformationData?.metadata;
});

const userKycBankDataSelector = createSelector(selectUserKyc, (state) => {
    return state.kycInfo.data?.kycBankData?.metadata;
});

const userKycDocumentDataSelector = createSelector(selectUserKyc, (state) => {
    return state.kycInfo.data?.kycDocumentData?.metadata;
});

const countrySelector = createSelector(SelectFormik, (state) => {
    return state.data;
});

const countryLoadingSelector = createSelector(SelectFormik, (state) => {
    return state.loading;
});

const countryErrorSelector = createSelector(SelectFormik, (state) => {
    return state.error;
});

const isSuccessfullyKyc = createSelector(selectUserKyc, (state) => {
    return state.kycInfo.data?.kycAllStatus === 'APPROVED';
});

const VerificationSelector = {
    userQuoteAssetSelector,
    userKycSelector,
    userKycIsLoadingSelector,
    userKycErrorSelector,
    userKycDataSelector,
    userKycInformationDataSelector,
    userKycBankDataSelector,
    userKycDocumentDataSelector,
    countrySelector,
    countryLoadingSelector,
    countryErrorSelector,
    isSuccessfullyKyc,
};

export default VerificationSelector;
