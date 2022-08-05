import classNames from 'classnames';
import MaldivesLayout from 'components/common/layouts/MaldivesLayout';
import SupportBanner from 'components/screens/Support/SupportBanner';
import SupportSearchBar from 'components/screens/Support/SupportSearchBar';
import { appUrlHandler, getSupportCategoryIcons, SupportCategories } from 'constants/faqHelper';
import { PATHS } from 'constants/paths';
import useApp from 'hooks/useApp';
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp } from 'react-feather';
import useHideScrollbar from 'hooks/useHideScrollbar';
import { handleHideScrollBar } from 'utils/helpers';

const COL_WIDTH = 304;

const TopicsLayout = ({
    children,
    lastedArticles,
    useTopicTitle = true,
    mode = 'announcement',
    faqCurrentGroup
}) => {
    const [showDropdown, setShowDropdown] = useState({});

    const router = useRouter();
    const [theme] = useDarkMode();
    const {
        t,
        i18n: { language }
    } = useTranslation();
    const isApp = useApp();
    const baseHref = mode === 'announcement' ? PATHS.SUPPORT.ANNOUNCEMENT : PATHS.SUPPORT.FAQ;
    const queryMode = mode === 'announcement' ? 'noti' : 'faq';
    const topics =
        mode === 'announcement'
            ? SupportCategories.announcements[language]
            : SupportCategories.faq[language];
    const isFaq = mode === 'faq';

    const mainTopic = topics.find((o) => o?.displaySlug === router?.query?.topic);
    const subTopics = mainTopic?.subCats?.find((o) => o?.displaySlug === faqCurrentGroup) || false;

    useEffect(handleHideScrollBar, []);
    useEffect(() => {
        if (isFaq && router?.query?.topic) {
            setShowDropdown({ [router.query.topic]: true });
        }
    }, [isFaq, router]);

    return (
        <MaldivesLayout>
            <div className="bg-[#F2F4F6] pt-8 lg:pt-0">
                <SupportBanner
                    title={
                        mode === 'announcement'
                            ? t('support-center:announcement')
                            : t('support-center:faq')
                    }
                    href={baseHref}
                    containerClassNames="hidden lg:block"
                />
                <div
                    style={
                        theme === THEME_MODE.LIGHT
                            ? { boxShadow: '0px -4px 30px rgba(0, 0, 0, 0.08)' }
                            : undefined
                    }
                    className="bg-bgPrimary dark:bg-darkBlue-2 rounded-t-[20px] lg:mt-0"
                >
                    <div className="flex min-h-[500px]">
                        <div
                            style={{ width: COL_WIDTH, minWidth: COL_WIDTH }}
                            className="hidden lg:block py-5 lg:py-[40px] border-r border-divider dark:border-divider-dark"
                        >
                            {topics?.map((item) => (
                                <div key={item.id}>
                                    <div
                                        className={classNames(
                                            'flex items-center px-5 lg:py-2.5 2xl:py-4 hover:bg-teal-lightTeal dark:hover:bg-teal-opacity',
                                            {
                                                'bg-teal-lightTeal dark:bg-teal-opacity':
                                                    !isFaq &&
                                                    router?.query?.topic === item.displaySlug
                                            }
                                        )}
                                    >
                                        <Link
                                            href={{
                                                pathname:
                                                    PATHS.SUPPORT.DEFAULT + `/${mode}/[topic]`,
                                                query: appUrlHandler(
                                                    { topic: item.displaySlug },
                                                    isApp
                                                )
                                            }}
                                        >
                                            <a
                                                className={classNames(
                                                    'flex flex-grow items-center text-[16px] font-medium cursor-pointer'
                                                )}
                                            >
                                                <div className="w-[32px] h-[32px] mr-4">
                                                    {
                                                        <Image
                                                            src={getSupportCategoryIcons(item.id)}
                                                            layout="responsive"
                                                            width={32}
                                                            height={32}
                                                        />
                                                    }
                                                </div>
                                                <span className="flex-grow"> {item?.title}</span>
                                            </a>
                                        </Link>
                                        {isFaq && !!item.subCats?.length && (
                                            <span
                                                className="hover:text-dominant cursor-pointer"
                                                onClick={() =>
                                                    setShowDropdown((prevState) => ({
                                                        ...prevState,
                                                        [item.displaySlug]:
                                                            !showDropdown?.[item.displaySlug]
                                                    }))
                                                }
                                            >
                                                {!!showDropdown?.[item.displaySlug] ? (
                                                    <ChevronUp size={14} strokeWidth={1.2} />
                                                ) : (
                                                    <ChevronDown size={14} strokeWidth={1.2} />
                                                )}
                                            </span>
                                        )}
                                    </div>
                                    {isFaq && !!item.subCats?.length && (
                                        <div
                                            className={classNames('hidden', {
                                                '!block': !!showDropdown?.[item.displaySlug]
                                            })}
                                        >
                                            {item.subCats?.map((subCats, index) => (
                                                <Link
                                                    key={index}
                                                    href={{
                                                        pathname:
                                                            PATHS.SUPPORT.FAQ +
                                                            `/${item.displaySlug}`,
                                                        query: appUrlHandler(
                                                            {
                                                                group: subCats.displaySlug
                                                            },
                                                            isApp
                                                        )
                                                    }}
                                                >
                                                    <a
                                                        className={classNames(
                                                            'block pl-[68px] text-[16px] cursor-pointer lg:py-2.5 2xl:py-4 font-medium hover:bg-teal-lightTeal dark:hover:bg-teal-opacity',
                                                            {
                                                                'bg-teal-lightTeal dark:bg-teal-opacity':
                                                                    subCats.displaySlug ===
                                                                    faqCurrentGroup
                                                            }
                                                        )}
                                                    >
                                                        {subCats.title}
                                                    </a>
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="flex-grow w-full px-4 pb-8 md:px-6 lg:p-[40px]">
                            <SupportSearchBar
                                simpleMode
                                containerClassNames="!mt-4 lg:!mt-0 lg:hidden"
                            />
                            {useTopicTitle && (
                                <div
                                    className={classNames(
                                        'text-[16px] md:text-[20px] lg:text-[28px] font-bold mt-4 mb-6 lg:mt-0 lg:mb-10',
                                        {
                                            'lg:!m-0': !useTopicTitle
                                        }
                                    )}
                                >
                                    {!faqCurrentGroup ? mainTopic?.title : subTopics?.title}
                                </div>
                            )}
                            {children}
                        </div>

                        {lastedArticles && Array.isArray(lastedArticles) && lastedArticles.length && (
                            <div
                                style={{
                                    width: COL_WIDTH,
                                    minWidth: COL_WIDTH
                                }}
                                className="hidden lg:block py-5 lg:py-[40px] pr-4 lg:pr-6 xl:pr-8 lg:pl-2"
                            >
                                <div className="px-3 text-[16px] font-bold mb-2.5">
                                    {t('support-center:lasted_articles')}
                                </div>
                                {lastedArticles.map((article) => {
                                    let topic;
                                    const ownedTags = article.tags
                                        .filter((f) => f.slug !== queryMode)
                                        ?.map((o) =>
                                            o?.slug
                                                ?.replace(`${queryMode}-vi-`, '')
                                                ?.replace(`${queryMode}-en-`, '')
                                        );
                                    const _tagsLib = topics.map((o) => o.displaySlug);

                                    ownedTags.forEach((e) => {
                                        if (_tagsLib.includes(e)) topic = e;
                                    });

                                    return (
                                        <Link
                                            key={article.id}
                                            href={{
                                                pathname: baseHref + '/[topic]/[articles]',
                                                query: appUrlHandler(
                                                    {
                                                        topic,
                                                        articles: article.slug?.toString()
                                                    },
                                                    isApp
                                                )
                                            }}
                                        >
                                            <a
                                                className={classNames(
                                                    'block mb-2.5 font-medium px-3 py-2.5 rounded-[8px]',
                                                    {
                                                        'bg-gray-4 dark:bg-darkBlue-4':
                                                            article.id === router?.query?.articles
                                                    }
                                                )}
                                            >
                                                {article?.title}
                                            </a>
                                        </Link>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </MaldivesLayout>
    );
};

export default TopicsLayout;
