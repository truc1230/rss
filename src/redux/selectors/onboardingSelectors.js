import { createSelector } from 'reselect';

const selectUserOnboarding = state => state?.user?.onboarding;

const isOnboarded = createSelector(selectUserOnboarding, (state) => {
    return (state.questions.length === 0);
});

const isReceivedOnboardingPromotion = createSelector(selectUserOnboarding, (state) => {
    return state.status;
});

const onBoardedData = createSelector(selectUserOnboarding, (state) => {
    return state.questions;
});

const OnboardingSelector = {
    isOnboarded,
    onBoardedData,
    isReceivedOnboardingPromotion,
};

export default OnboardingSelector;
