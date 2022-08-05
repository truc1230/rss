import { Search } from 'react-feather';
import classNames from 'classnames';
import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';
import { PATHS } from 'constants/paths';
import useApp from 'hooks/useApp';
import { useRouter } from 'next/router';
import { appUrlHandler } from 'constants/faqHelper';

const SupportSearchBar = ({ containerClassNames = '', simpleMode = false, resetPage }) => {
    const [type, setType] = useState(0);
    const [query, setQuery] = useState('');
    const [searchKey, setSearchKey] = useState();
    const [focus, setFocus] = useState(false);
    const { t } = useTranslation();
    const isApp = useApp();
    const router = useRouter();

    const onSearch = (type, searchKey) => {
        resetPage && resetPage();
        router.push({
            pathname: PATHS.SUPPORT.SEARCH,
            query: appUrlHandler(
                {
                    type,
                    query: searchKey
                },
                isApp
            )
        });
    };

    useEffect(() => {
        if (
            router?.query &&
            Object.keys(router.query).length &&
            router.query?.query &&
            router.query?.type
        ) {
            setType(+router.query?.type);
            setQuery(router.query.query);
            if (router.query.query?.length) {
                setSearchKey(router.query.query);
            }
        }
    }, [router]);

    return (
        <div
            className={classNames(
                'mt-2 lg:mt-3 flex items-center bg-gray-4 lg:bg-white dark:bg-darkBlue-4 px-2 py-[9px] lg:pl-[18px] lg:py-3.5 rounded-md lg:rounded-xl lg:max-w-[600px] lg:max-h-[56px]',
                {
                    'min-w-[280px] max-w-[310px] md:min-w-[450px] md:rounded-xl xl:min-w-[600px] xl:max-w-[600px]':
                        !simpleMode
                },
                containerClassNames
            )}
            style={{ letterSpacing: '0.005em;' }}
        >
            <Search
                strokeWidth={2}
                className="text-txtSecondary dark:text-txtSecondary-dark w-4 h-4 lg:w-[24px] lg:h-[24px] lg:!text-dominant"
            />
            <input
                id="my-custom-input"
                className="px-2 lg:px-4 flex-grow font-medium text-sm leading-5 md:text-sm lg:text-[16px]"
                placeholder={t('support-center:search_articles')}
                value={searchKey}
                onChange={({ target: { value } }) => setSearchKey(value)}
                onFocus={() => setFocus(true)}
                onBlur={() => setFocus(false)}
                onKeyPress={(e) =>
                    focus && e.nativeEvent.code === 'Enter' && onSearch(type, searchKey)
                }
            />
            {!simpleMode && (
                <button
                    style={{
                        background:
                            'linear-gradient(138.83deg, rgba(0, 220, 194, 0.9) 2.54%, #00BEB3 50.84%)'
                    }}
                    onClick={() => onSearch(type, searchKey)}
                    className="w-[86px] lg:w-[160px] h-[24px] sm:h-[35px] lg:h-[42px] rounded-[8px] lg:rounded-xl text-[10px] md:text-sm lg:text-[16px] font-medium text-white hover:opacity-80"
                >
                    {t('common:search')}
                </button>
            )}
        </div>
    );
};

export default SupportSearchBar;
