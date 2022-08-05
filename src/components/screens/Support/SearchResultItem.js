import Link from 'next/link';
import { PATHS } from 'constants/paths';
import useWindowSize from 'hooks/useWindowSize';
import { memo, useMemo } from 'react';
import { BREAK_POINTS } from 'constants/constants';
import Skeletor from 'components/common/Skeletor';
import { useTranslation } from 'next-i18next';
import { formatTime } from 'redux/actions/utils';
import Parse from 'html-react-parser';

const SearchResultItem = memo(({ article, loading = false }) => {
    const { width } = useWindowSize()
    const { t, i18n: { language } } = useTranslation()

    // ? Memmoized
    const iconSize = useMemo(() => width >= BREAK_POINTS.lg ? 20 : 16, [width])

    const getTopics = (topic) => {
        if (!topic) return null
        // console.log('namidev ', topic);
        let url
        if (topic?.slug?.includes('noti')) {
            url = PATHS.SUPPORT.ANNOUNCEMENT
        } else {
            url = PATHS.SUPPORT.FAQ
        }
        return (
            <>
                <Link href={url}>
                    <a className="!underline">{topic?.name}</a>
                </Link>
                {/* <ChevronRight strokeWidth={1.5} size={iconSize} className="mx-2"/> */}
            </>
        )
        // switch (topic?.slug) {
        //     case 'noti':

        //     case 'faq':
        //         return (
        //             <>
        //                 <Link href={PATHS.SUPPORT.FAQ}>
        //                     <a className="!underline">{t('support-center:faq')}</a>
        //                 </Link>
        //                 <ChevronRight strokeWidth={1.5} size={iconSize} className="mx-2"/>
        //             </>
        //         )
        // }
    }

    const getCategory = (topic, tags) => {
        const isFaq = !!tags.filter(o => o.slug === 'faq')?.length
        // console.log('namidev ', topic, isFaq);
        return null
        const slugCollect = tags?.filter(o => o?.slug !== topic?.slug)
        return (
            <Link href={{
                pathname: `${topic?.slug === 'noti' ? PATHS.SUPPORT.ANNOUNCEMENT : PATHS.SUPPORT.FAQ}/[topic]`,
                query: { topic: slugCollect?.[0]?.slug?.replace(`${topic?.slug}-${language}-`, '') }
            }}>
                <a className="!underline">{slugCollect?.[0]?.name}</a>
            </Link>
        )
    }

    const buildArticleUrl = () => {
        const isFaq = !!article?.tags.filter(o => o.slug === 'faq' || o.slug.includes('faq-'))?.length

        if (isFaq) {
            const cats = article?.tags?.filter(o => o.slug !== 'faq')?.[0]
            return PATHS.SUPPORT.FAQ + `/${cats?.slug?.replace(`faq-${language}-`, '')}/${article?.slug}`
        } else {
            const cats = article?.tags?.filter(o => o.slug.includes('noti'))
            // console.log('namidev noti ', article, cats);
            if (!cats?.length) return article?.url
            return PATHS.SUPPORT.ANNOUNCEMENT + `/${cats?.[0]?.slug?.replace(`noti-${language}-`, '')}/${article?.slug}`
        }
    }

    return (
        <div className="mb-6 lg:mb-9">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <Link href={buildArticleUrl()}>
                    <a target='_blank' className="font-bold text-sm lg:text-[18px] hover:text-dominant hover:!underline cursor-pointer">
                        {loading ?
                            <div className="!min-w-[200px] lg:!w-[500px] xl:!w-[800px]"><Skeletor className="!w-full"/>
                            </div> : article?.title}
                    </a>
                </Link>
                <div className="font-bold text-[10px] text-txtSecondary dark:text-txtSecondary-dark">
                    {loading ?
                        <div className="hidden md:block md:!w-[100px]"><Skeletor className="!w-full" height={15}/>
                        </div> : formatTime(article?.raw_data?.created_at, 'dd-MM-yyyy')}
                </div>
            </div>
            <div
                className="mt-2.5 overflow-hidden font-medium text-xs lg:text-sm lg:mt-4 md:text-txtSecondary md:dark:text-txtSecondary-dark">
                {loading ?
                    <>
                        <div className="w-full"><Skeletor className="!w-full" height={15}/></div>
                        <div className="w-full"><Skeletor className="!w-full" height={15}/></div>
                        <div className="w-full"><Skeletor className="!w-full" height={15}/></div>
                    </>
                    : Parse(article?.html?.substring(0, 220)?.trim() + '...')}
            </div>
            <div className="mt-2.5 flex items-center text-[10px] lg:text-sm font-medium">
                {loading ?
                    <div className="!min-w-[80px] lg:!w-[120px] xl:!w-[200px]"><Skeletor className="!w-full" height={15}/></div>
                    : <>
                        {getTopics(article?.raw_data?.primary_tag)}
                        {/* {getCategory(article?.raw_data?.primary_tag, article?.raw_data?.tags)} */}
                    </>
                }
            </div>
        </div>
    )
})

export default SearchResultItem
