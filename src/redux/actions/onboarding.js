import fetchAPI from 'utils/fetch-api';
import * as types from 'src/redux/actions/types';
import { ApiStatus } from './const';
import {
    API_ONBOARDING_OPEN_BOX,
    API_ONBOARDING_PROMOTION_STATUS,
    API_ONBOARDING_QUESTION,
    API_ONBOARDING_QUESTION_SUBMIT,
} from './apis';

export const getOnboardingQuestions = () => async (dispatch) => {
    try {
        dispatch({ type: types.GET_ONBOARDING_QUESTIONS_REQUEST });
        const opts = {
            url: API_ONBOARDING_QUESTION,
            options: {
                method: 'GET',
            },
        };
        const res = await fetchAPI(opts);
        const { status, data } = res;
        if (status === ApiStatus.SUCCESS) {
            dispatch({
                type: types.GET_ONBOARDING_QUESTIONS_SUCCESS,
                payload: data?.questions,
            });
            return data?.questions;
        }
        dispatch({
            type: types.GET_ONBOARDING_QUESTIONS_FAILURE,
        });
        return false;
    } catch (error) {
        dispatch({
            type: types.GET_ONBOARDING_QUESTIONS_FAILURE,
        });
        return false;
    }
};

export const submitOnboardingQuestions = ({ questionName, questionValue }) => async (dispatch) => {
    try {
        dispatch({ type: types.SUBMIT_ONBOARDING_QUESTIONS_REQUEST });
        const opts = {
            url: API_ONBOARDING_QUESTION_SUBMIT,
            options: {
                method: 'POST',
            },
            params: {
                questionName,
                questionValue,
            },
        };
        const res = await fetchAPI(opts);
        const { status } = res;
        if (status === ApiStatus.SUCCESS) {
            dispatch({
                type: types.SUBMIT_ONBOARDING_QUESTIONS_SUCCESS,
            });
            return true;
        }
        dispatch({
            type: types.SUBMIT_ONBOARDING_QUESTIONS_FAILURE,
        });
        return false;
    } catch (error) {
        dispatch({
            type: types.SUBMIT_ONBOARDING_QUESTIONS_FAILURE,
        });
        return false;
    }
};

export const openOnboardingCase = ({ boxIndex }) => async (dispatch) => {
    try {
        dispatch({ type: types.OPEN_ONBOARDING_CASE_REQUEST });
        const opts = {
            url: API_ONBOARDING_OPEN_BOX,
            options: {
                method: 'POST',
            },
            params: {
                boxIndex,
            },
        };
        const res = await fetchAPI(opts);
        const { status, data } = res;
        if (status === ApiStatus.SUCCESS) {
            dispatch({
                type: types.OPEN_ONBOARDING_CASE_SUCCESS,
            });
            return data;
        }
        dispatch({
            type: types.OPEN_ONBOARDING_CASE_FAILURE,
        });
        return false;
    } catch (error) {
        dispatch({
            type: types.OPEN_ONBOARDING_CASE_FAILURE,
        });
        return false;
    }
};

export const getOnboardingPromotionStatus = () => async (dispatch) => {
    try {
        dispatch({ type: types.GET_ONBOARDING_PROMOTION_STATUS_REQUEST });

        const opts = {
            url: API_ONBOARDING_PROMOTION_STATUS,
            options: {
                method: 'GET',
            },
        };
        const res = await fetchAPI(opts);
        const { status, data } = res;
        if (status === ApiStatus.SUCCESS) {
            dispatch({
                type: types.GET_ONBOARDING_PROMOTION_STATUS_SUCCESS,
                payload: data?.userStatus === 'received',
            });
            return (data?.userStatus === 'received');
        }
        dispatch({
            type: types.GET_ONBOARDING_PROMOTION_STATUS_FAILURE,
        });
        return false;
    } catch (error) {
        dispatch({
            type: types.GET_ONBOARDING_PROMOTION_STATUS_FAILURE,
        });
        return false;
    }
};
