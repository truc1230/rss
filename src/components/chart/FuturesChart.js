import dynamic from 'next/dynamic';
import useDarkMode from 'hooks/useDarkMode';
import {ChartMode} from 'redux/actions/const';
import {API_GET_FUTURES_ORDER} from 'redux/actions/apis';
import {ApiStatus, UserSocketEvent} from 'redux/actions/const';
import fetchApi from 'utils/fetch-api';
import {useSelector} from 'react-redux';
import {useEffect, useState} from 'react'
import {TVChartContainer} from "components/TVChartContainer";

const FuturesChart = dynamic(
    () => import('src/components/TVChartContainer/').then(mod => mod.TVChartContainer),
    { ssr: false },
);

export default (props) => {
    const [currentTheme,] = useDarkMode();
    return <FuturesChart {...props} theme={currentTheme} mode={ChartMode.FUTURES}/>;
};
