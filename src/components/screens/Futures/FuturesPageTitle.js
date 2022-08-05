import { PRODUCT } from 'constants/constants';
import Head from 'next/head';
import { formatNumber } from 'redux/actions/utils';
import { roundTo } from 'round-to';

const FuturesPageTitle = ({ pair, price, pricePrecision }) => {
    return (
        <Head>
            {
                price && <title>
                    {`${formatNumber(
                        roundTo(price || 0, pricePrecision || 0),
                        pricePrecision
                    )} | ${pair} | ${PRODUCT.FUTURES}`}
                </title>
            }
        </Head>
    )
}

export default FuturesPageTitle
