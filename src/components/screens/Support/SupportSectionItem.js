import Buttonz from 'components/common/Buttonz';
import cN from 'classnames';
import useWindowSize from 'hooks/useWindowSize';

const SupportSectionItem = ({ title, icon, containerClassNames = '', classNames = '', titleClassNames = '', href = "/" }) => {
    const { width } = useWindowSize()
    return (
        <div
            className={'w-full md:w-1/3 xl:w-1/4 md:pr-1 lg:pr-3 ' + containerClassNames}>
            <Buttonz as="link" href={href}
                     className={cN('!mt-3 !-mx-1.5 !px-1.5 lg:!px-2.5 !py-2 lg:!py-3 !flex items-center !p-0 !block !text-left ' +
                                       'rounded-md cursor-pointer md:-mx-0 lg:mt-0 w-full',
                                   { 'active:bg-gray-4 dark:active:bg-darkBlue-4': !!title },
                                   { 'w-fit': width >= 768 }, classNames)}>
                {icon || null}
                <div className={cN('font-medium text-sm lg:text-[16px]', {
                    'pl-2 md:pl-4': !!icon
                }, titleClassNames)}>
                    {title}
                </div>
            </Buttonz>
        </div>
    )
}

export default SupportSectionItem
