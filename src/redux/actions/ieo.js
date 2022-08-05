import fetchAPI from 'utils/fetch-api';
import * as types from 'src/redux/actions/types';
import { ApiStatus } from './const';
import { API_IEO_PROJECTS, } from './apis';

export const getIEOProjects = ({ page, lastId }) => async (dispatch) => {
    try {
        dispatch({ type: types.GET_IEO_PROJECTS_REQUEST });
        const opts = {
            url: API_IEO_PROJECTS,
            options: {
                method: 'GET',
            },
            params: {
                page,
            },
        };
        if (lastId) {
            opts.params.lastId = lastId;
        }
        const res = await fetchAPI(opts);
        const { status, data, time } = res;
        if (status === ApiStatus.SUCCESS) {
            dispatch({
                type: types.GET_IEO_PROJECTS_SUCCESS,
                // payload: data?.questions,
            });
            return { data, time };
        }
        dispatch({
            type: types.GET_IEO_PROJECTS_FAILURE,
        });
        return false;
    } catch (error) {
        dispatch({
            type: types.GET_IEO_PROJECTS_FAILURE,
        });
        return false;
    }
};

export const getIEOProjectDetail = (projectId) => async (dispatch) => {
    try {
        dispatch({ type: types.GET_IEO_PROJECTS_REQUEST });
        const opts = {
            url: `${API_IEO_PROJECTS}/${projectId}`,
            options: {
                method: 'GET',
            },
        };
        const res = await fetchAPI(opts);
        const { status, data } = res;
        if (status === ApiStatus.SUCCESS) {
            dispatch({
                type: types.GET_IEO_PROJECTS_SUCCESS,
                // payload: data?.questions,
            });
            return data;
        }
        dispatch({
            type: types.GET_IEO_PROJECTS_FAILURE,
        });
        return false;
    } catch (error) {
        dispatch({
            type: types.GET_IEO_PROJECTS_FAILURE,
        });
        return false;
    }
};
