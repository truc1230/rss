import { useRouter } from 'next/router';
import { PATHS } from 'constants/paths';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { ChevronLeft } from 'react-feather';

import TopicsLayout from 'components/screens/Support/TopicsLayout';
import Link from 'next/link';
import useApp from 'hooks/useApp';
import { appUrlHandler, SupportCategories } from 'constants/faqHelper';
import { useTranslation } from 'next-i18next';
import { useCallback, useEffect, useState } from 'react';
import { ghost } from 'utils';
import { formatTime } from 'redux/actions/utils';
import classNames from 'classnames';

const FaqTopics = (props) => {
    const [currentGroup, setCurrentGroup] = useState(null)
    const { articles } = props?.data || []

    const router = useRouter()
    const isApp = useApp()
    const {
        t,
        i18n: { language },
    } = useTranslation()
    const cats =
        SupportCategories.faq[language]?.find(
            (o) => o.displaySlug === router?.query?.topic
        )?.subCats || false

    const renderGroup = () => {
        return (
            cats &&
            cats.map((item) => (
                <div
                    key={item.id}
                    title={item.title}
                    className='mb-[18px] h-full w-full sm:w-1/2 lg:w-1/3 sm:pr-3'
                >
                    <Link
                        href={{
                            pathname:
                                PATHS.SUPPORT.FAQ + `/${router?.query?.topic}`,
                            query: appUrlHandler(
                                { group: item.displaySlug },
                                isApp
                            ),
                        }}
                        key={item.uuid}
                    >
                        <a className='truncate block bg-gray-4 dark:bg-darkBlue-4 rounded-sm hover:opacity-80 px-4 py-3 text-sm font-medium lg:text-[16px]'>
                            {item?.title}
                        </a>
                    </Link>
                </div>
            ))
        )
    }

    const renderAppHeader = () => {
        if (!isApp) return null
        const topic = props?.data?.tags?.find(
            (o) => o?.displaySlug === router?.query?.topic
        )?.name
        return (
            <div
                onClick={router?.back}
                className='active:text-dominant flex items-center px-4 pt-4 pb-2 text-sm font-medium'
            >
                <ChevronLeft size={16} className='mr-2.5' />
                {topic}
                {topic && ' | '}
                Nami FAQ
            </div>
        )
    }

    const renderGroupArticles = useCallback(() => {
        if (!currentGroup || !articles || !articles.length) return null

        const data = articles?.filter((e) => {
            const isBelongThisGroup = e?.tags?.find(
                (o) => o.slug === `faq-${language}-${currentGroup}`
            )
            return !!isBelongThisGroup
        })

        // console.log('namidev filtered => ', data)

        if (!data.length) {
            return <div>{t('support-center:no_articles')}</div>
        }

        return data?.map((article) => (
            <a
                href={
                    PATHS.SUPPORT.FAQ +
                    `/${router?.query?.topic}/${article.slug}${
                        isApp ? '?source=app' : ''
                    }`
                }
                key={article.uuid}
                className='block text-sm font-medium mb-[18px] lg:text-[16px] lg:mb-8 hover:!text-dominant'
            >
                {article?.title}{' '}
                <span className='text-[10px] lg:text-xs text-txtSecondary dark:text-txtSecondary-dark'>
                    {formatTime(article.created_at, 'dd-MM-yyyy')}
                </span>
            </a>
        ))
    }, [currentGroup, articles, language])

    const renderLastedArticles = useCallback(() => {
        if (!!currentGroup) return null

        if (!cats.length && (!articles || !articles.length)) {
            return <div>{t('support-center:no_articles')}</div>
        }

        const data = articles.slice(0, !!cats?.length ? 5 : 25)

        return data.map((article) => (
            <Link
                href={
                    PATHS.SUPPORT.FAQ +
                    `/${router?.query?.topic}/${article.slug.toString()}${
                        isApp ? '?source=app' : ''
                    }`
                }
                key={article.uuid}
            >
                <a className='!block !w-full text-sm font-medium mb-[18px] lg:text-[16px] lg:mb-8 hover:!text-dominant'>
                    {article?.title}{' '}
                    <span className='text-[10px] lg:text-xs text-txtSecondary dark:text-txtSecondary-dark'>
                        {formatTime(article.created_at, 'dd-MM-yyyy')}
                    </span>
                </a>
            </Link>
        ))
    }, [articles, currentGroup])

    useEffect(() => {
        if (router?.query?.group) {
            setCurrentGroup(router?.query?.group)
        } else {
            setCurrentGroup(null)
        }
    }, [router?.query])

    return (
        <>
            {renderAppHeader()}
            <TopicsLayout
                useTopicTitle
                mode='faq'
                faqCurrentGroup={currentGroup}
            >
                <div
                    className={classNames('flex flex-wrap', {
                        'mb-4 md:mb-6': !!cats.length && !!!currentGroup,
                    })}
                >
                    {!currentGroup && renderGroup()}
                </div>
                <div className=''>{renderGroupArticles()}</div>
                {!!cats.length && !!articles?.length && !!!currentGroup && (
                    <div className='text-[16px] font-bold md:text-[20px] lg:text-[28px] mb-6'>
                        {t('support-center:lasted_articles')}
                    </div>
                )}
                <div className=''>{renderLastedArticles()}</div>
            </TopicsLayout>
        </>
    )
}

export async function getServerSideProps({ locale, query }) {
    const articles = await ghost.posts.browse({
        filter: `tags:faq-${locale || 'en'}-${query?.topic}`,
        include: `tags`,
    })

    return {
        props: {
            data: {
                articles,
            },
            ...(await serverSideTranslations(locale, [
                'common',
                'navbar',
                'support-center',
            ])),
        },
    }
}

export default FaqTopics
