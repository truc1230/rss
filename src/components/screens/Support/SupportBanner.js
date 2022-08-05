import { useTranslation } from 'next-i18next';
import SupportSearchBar from 'components/screens/Support/SupportSearchBar';
import classNames from 'classnames';
import Link from 'next/link';
import useApp from 'hooks/useApp';

const SupportBanner = ({ title, href = '#', containerClassNames = '', innerClassNames = '', resetPage = undefined }) => {
    const { t } = useTranslation()
    const isApp = useApp()

    return (
        <div className={classNames('support-search-bg', containerClassNames)}>
            <div
                className={classNames('flex flex-col items-center justify-center py-5 px-14 sm:py-8 md:py-12 lg:flex-row lg:items-center lg:justify-between', innerClassNames)}>
                < Link href={`${href}${isApp ? '?source=app' : ''}`}>
                    <a className="font-bold text-center text-[16px] md:text-[24px] mb-4 lg:mb-0 lg:text-[36px] lg:leading-[56px] hover:text-dominant">
                        {title || 'No title'}
                    </a>
                </Link>
                <SupportSearchBar
                    placeholder={t('common:search_articles')}
                    containerClassNames={classNames('rounded-lg bg-white dark:bg-darkBlue-2')}
                    resetPage={resetPage}
                />
            </div>
        </div>
    )
}

export default SupportBanner
