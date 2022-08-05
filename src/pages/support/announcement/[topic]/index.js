import { useRouter } from 'next/router';
import TopicsLayout from 'components/screens/Support/TopicsLayout';
import { PATHS } from 'constants/paths';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Link from 'next/link';
import { getLastedArticles, } from 'utils';
import { formatTime } from 'redux/actions/utils';
import useApp from 'hooks/useApp';
import { ChevronLeft } from 'react-feather';
import { useTranslation } from 'next-i18next';

const AnnouncementTopics = (props) => {
    const router = useRouter()
    const isApp = useApp()

    const { t } = useTranslation()

    const renderTopics = () => {
        if (!props?.data?.articles || !props?.data?.articles?.length) {
            return <div>{t('support-center:no_articles')}</div>
        }

        return props?.data?.articles?.map((item) => (
            <Link
                href={
                    PATHS.SUPPORT.ANNOUNCEMENT +
                    `/${router?.query?.topic}/${item.slug}${
                        isApp ? '?source=app' : ''
                    }`
                }
                key={item.uuid}
            >
                <a className='block text-sm font-medium mb-[18px] lg:text-[16px] lg:mb-8 hover:!text-dominant'>
                    {item?.title}{' '}
                    <span className='text-[10px] lg:text-xs text-txtSecondary dark:text-txtSecondary-dark'>
                        {formatTime(item.created_at, 'dd-MM-yyyy')}
                    </span>
                </a>
            </Link>
        ))
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

    return (
        <>
            {renderAppHeader()}
            <TopicsLayout
                useTopicTitle={!!props?.data?.articles?.length}
                mode='announcement'
            >
                {renderTopics()}
            </TopicsLayout>
        </>
    )
}

export async function getServerSideProps({ locale, query }) {
    const articles = await getLastedArticles(
        `noti-${locale}-${query?.topic}`,
        25,
        locale
    )
    return {
        props: {
            data: {
                articles: articles,
            },
            ...(await serverSideTranslations(locale, [
                'common',
                'navbar',
                'support-center',
            ])),
        },
    }
}

export default AnnouncementTopics
