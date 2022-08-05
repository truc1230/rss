import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { ChevronRight, Slash } from 'react-feather';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { PATHS } from '../../constants/paths';
import MaldivesLayout from 'components/common/layouts/MaldivesLayout';
import SupportBanner from 'components/screens/Support/SupportBanner';
import classNames from 'classnames';
import Link from 'next/link';
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';
import useApp from 'hooks/useApp';
import SearchResultItem from 'components/screens/Support/SearchResultItem';
import useWindowSize from 'hooks/useWindowSize';
import { BREAK_POINTS } from 'constants/constants';
import { algoliaIndex } from 'utils';
import { useAsync } from 'react-use';
import { useTranslation } from 'next-i18next';
import { LANGUAGE_TAG } from 'hooks/useLanguage';
import RePagination from 'components/common/ReTable/RePagination';
import { appUrlHandler } from 'constants/faqHelper';

const PAGE_SIZE = 15

const INITIAL_STATE = {
    tab: 0,
    query: null,
    loading: false,
    searchResult: [],
    currentPage: 1,
    totalArticle: null,
}

const SupportSearchResult = () => {
    const [state, set] = useState(INITIAL_STATE)
    const setState = (_state) => set(prevState => ({ ...prevState, ..._state }))

    const [theme] = useDarkMode()
    const router = useRouter()
    const isApp = useApp()
    const { t, i18n: { language } } = useTranslation()
    const { width } = useWindowSize()

    // ? helper
    const onQuery = (tab, query) => router.push(
        {
            pathname: PATHS.SUPPORT.SEARCH,
            query: appUrlHandler({ type: tab, query }, isApp)
        })

    // ? render
    const renderTab = useCallback(() => TAB_SERIES.map(item => (
        <div key={item.key} className="mr-8 cursor-pointer min-h-[33px]"
            onClick={() => onQuery(item.key, state.query)}>
            <div className={classNames(
                'mb-2 truncate text-sm text-center',
                { 'font-bold': item.key === state.tab },
                { 'text-txtSecondary dark:text-txtSecondary-dark font-medium': item.key !== state.tab }
            )}>
                {item.localizedPath ? t(item.localizedPath) : item.title}
            </div>
            {state.tab === item.key && <div className="m-auto w-[32px] h-[4px] bg-dominant" />}
        </div>
    )), [state.tab, state.query])

    const renderSearchResult = useCallback(() => {
        if (state.loading) {
            return (
                <>
                    <SearchResultItem loading={true} />
                    <SearchResultItem loading={true} />
                    <SearchResultItem loading={true} />
                    <SearchResultItem loading={true} />
                    <SearchResultItem loading={true} />
                    <SearchResultItem loading={true} />
                    <SearchResultItem loading={true} />
                    <SearchResultItem loading={true} />
                    <SearchResultItem loading={true} />
                    <SearchResultItem loading={true} />
                    <SearchResultItem loading={true} />
                    <SearchResultItem loading={true} />
                </>
            )
        }

        const data = state.searchResult
        return data?.map(search => <SearchResultItem key={search?.id} article={search} />)
    }, [state.searchResult, state.currentPage, state.loading])

    useEffect(() => {
        if (router?.query && Object.keys(router.query).length && router.query?.query && router.query?.type) {
            setState({
                tab: +router.query?.type,
                query: router.query.query
            })
            if (router.query.query?.length) {
                setState({ searchKey: router.query.query })
            }
        }
    }, [router])

    useAsync(async () => {
        const tagFilters = [language === 'en' ? language : `-en`]
        const tab = {
            0: "faq",
            1: "noti",
        }[state.tab]
        if (tab) {
            tagFilters.push(tab)
        }
        const algoSearch = await algoliaIndex.search(state.query, {
            page: state.currentPage - 1,
            hitsPerPage: 15,
            facetFilters: tagFilters.map(t => `tags.slug:${t}`)
        })
        setState({ totalArticle: algoSearch?.nbHits, searchResult: algoSearch?.hits })
    }, [state.query, state.currentPage, language, state.tab])

    return (
        <MaldivesLayout>
            <SupportBanner
                href={PATHS.SUPPORT.DEFAULT}
                resetPage={() => setState({ currentPage: 1 })}
                title={language === LANGUAGE_TAG.VI ?
                    <>
                        Chúng tôi có thể <br className="hidden lg:block" /> giúp gì cho bạn?
                    </> :
                    <>
                        How can we help you?
                    </>
                } innerClassNames="container" />
            <div className="block md:hidden bg-bgPrimary dark:bg-bgPrimary-dark drop-shadow-onlyLight dark:shadow-none">
                <div
                    className="container px-4 py-2 flex items-center text-xs font-medium text-txtSecondary dark:text-txtSecondary-dark">
                    <Link href={PATHS.SUPPORT.DEFAULT}>
                        <a className="hover:!underline">{t('support-center:title')}</a>
                    </Link>
                    <ChevronRight strokeWidth={1.5} size={16} className="mx-2" />
                    <div>{t('support-center:search_result')}</div>
                </div>
            </div>
            <div
                className="container md:mt-4 md:px-5 md:pt-2 md:pb-[100px] md:bg-bgPrimary md:dark:bg-bgPrimary-dark md:rounded-t-[20px]"
                style={theme === THEME_MODE.LIGHT && width >= BREAK_POINTS.md ? { boxShadow: '0px -4px 30px rgba(0, 0, 0, 0.08)' } : undefined}>
                <div className="mt-4 px-4 flex items-center select-none overflow-x-auto no-scrollbar">
                    {renderTab()}
                </div>
                <div id="my-custom-results"
                    style={theme === THEME_MODE.LIGHT ? { boxShadow: '0px -4px 30px rgba(0, 0, 0, 0.08)' } : undefined}
                    className="px-4 py-5 bg-[#FCFCFC] dark:bg-darkBlue-2 rounded-[20px] lg:p-8">
                    {state.searchResult?.length ?
                        renderSearchResult()
                        : <div
                            className="min-h-[200px] flex-center text-center text-xs md:text-sm xl:text-[16px] font-medium text-txtSecondary dark:text-txtSecondary-dark">
                            <Slash size={45} color="currentColor" />
                            <br />
                            <span className="px-16">{t('support-center:search_no_result')}</span>
                        </div>}
                </div>
                <div className="mt-10 mb-20 flex items-center justify-center">
                    <RePagination total={state.totalArticle || 0}
                        current={state.currentPage}
                        pageSize={PAGE_SIZE}
                        onChange={(currentPage) => setState({ currentPage })}
                    />
                </div>
            </div>
        </MaldivesLayout>
    )
}

const TAB_SERIES = [
    {
        key: 0,
        title: 'Câu hỏi thường gặp',
        localizedPath: 'support-center:faq'
    },
    {
        key: 1,
        title: 'Thông báo',
        localizedPath: 'support-center:announcement'
    },
    {
        key: 2,
        title: 'Tất cả',
        localizedPath: 'common:all'
    }
]

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...await serverSideTranslations(locale, ['common', 'navbar', 'support-center'])
    }
})

export default SupportSearchResult
