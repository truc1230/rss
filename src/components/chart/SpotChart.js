import dynamic from 'next/dynamic';
import useDarkMode from 'hooks/useDarkMode';
import { ChartMode } from 'redux/actions/const';

const SpotChart = dynamic(
    () => import('src/components/TVChartContainer/').then(mod => mod.TVChartContainer),
    { ssr: false },
);

export default (props) => {
    const [currentTheme, ] = useDarkMode()
    return <SpotChart {...props} theme={currentTheme} mode={ChartMode.SPOT}/>
};
