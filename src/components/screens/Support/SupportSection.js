import classNames from 'classnames';
import { PATHS } from 'constants/paths';
import Link from 'next/link';
import useApp from 'hooks/useApp';

const SupportSection = ({
                            mode,
                            title,
                            children,
                            containerClassNames = '',
                            contentContainerClassName = ''
                        }) => {

    let href
    if (mode !== undefined) {
        href = mode === 'announcement' ? PATHS.SUPPORT.ANNOUNCEMENT : PATHS.SUPPORT.FAQ
    }

    const isApp = useApp()
    href = isApp ? href + '?source=app' : href

    return (
        <div className={classNames('lg:bg-bgPrimary dark:bg-bgPrimary-dark lg:rounded-xl', containerClassNames)}>
            {title && <div
                className="font-bold text-[16px] lg:text-[18px] lg:px-[28px] lg:pb-3 pt-5 lg:border-b lg:border-divider lg:dark:border-divider-dark">
                {href ? <Link href={href}>
                        <a className={classNames({ 'hover:text-dominant hover:!underline': !!href })}>
                            {title}
                        </a>
                    </Link>
                    : <div className="">
                        {title}
                    </div>}
            </div>}
            {children && <div
                className={'mt-4 lg:mt-0 lg:pt-[10px] lg:px-[28px] md:flex md:start md:flex-wrap lg:-mx-1.5 ' + contentContainerClassName}>
                {children}
            </div>}
        </div>
    )
}

export default SupportSection
