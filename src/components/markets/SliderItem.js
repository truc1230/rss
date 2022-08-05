import Image from 'next/image';
import {
    formatPrice,
    formatWalletWithoutDecimal,
    getExchange24hPercentageChange,
    getSparkLine,
    render24hChange,
} from 'src/redux/actions/utils';
import Link from 'next/link';
import ContentLoader from 'react-content-loader';
import { useTranslation } from 'next-i18next';
import AssetLogo from '../wallet/AssetLogo';

const SliderItem = (props) => {
    const { data } = props;
    const { i18n } = useTranslation();

    if (!data) {
        return (

            <div className="card bg-white rounded-xl px-5 py-6 slider-item mx-auto slider-shadow my-10 cursor-pointer">
                <ContentLoader height={100} width="100%">
                    <circle cx="16" cy="16" r="16" />
                    <rect x="50" y="10" rx="0" ry="0" width="80%" height="12" />
                    <rect x="0" y="42" rx="5" ry="5" width="100%" height="50" />
                </ContentLoader>
            </div>
        );
    }
    const change24h = getExchange24hPercentageChange(data);
    return (
        <Link href={`/trade/${data?.b}-${data?.q}`} prefetch={false}>
            <div
                className="card bg-white rounded-xl px-5 py-6 slider-item mx-auto slider-shadow my-10 cursor-pointer"
            >
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                        <span className="mr-2 w-8">
                            {data?.b ? <AssetLogo assetCode={data?.b} /> : null}
                        </span>
                        <span className="text-bold text-lg">{data?.b} </span>
                        <span className="text-sm text-black-500">/{data?.q}</span>
                    </div>
                    <div>
                        {render24hChange(data)}
                    </div>
                </div>
                <div className="flex item-center justify-between">
                    <div>
                        <div
                            className={`font-semibold mb-1 ${!data?.u ? 'text-red' : 'text-teal'}`}
                        >{formatPrice(data?.p)}
                        </div>
                        <div className="text-xs text-black-500 truncate">
                            24h - {i18n.language === 'vi' ? 'KL' : 'Vol'} {formatWalletWithoutDecimal(+data?.vb)} {data?.b}
                        </div>
                    </div>
                    {/* <Image src="/images/chart.svg" height={30.75} width={90} /> */}
                    <Image
                        src={getSparkLine(`${data?.b}${data?.q}`, change24h >= 0 ? '#00C8BC' : '#E5544B')}
                        height={30.75}
                        width={90}
                        unoptimized
                    />
                </div>
            </div>
        </Link>

    );
};

export default SliderItem;
