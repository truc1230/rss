import { createSelector } from 'reselect';

const selectUserReferral = state => state?.user?.referral;

const isEditable = createSelector(selectUserReferral, (state) => {
    return !!state?.editable;
});

const refOfName = createSelector(selectUserReferral, (state) => {
    return state?.refOfName;
});

const refOfId = createSelector(selectUserReferral, (state) => {
    return state?.refOfId;
});

const ReferralSelector = {
    isEditable,
    refOfName,
    refOfId,
};

export default ReferralSelector;
