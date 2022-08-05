import { memo, useCallback, useMemo } from 'react';
import classNames from 'classnames';
import Link from 'next/link';

const Buttonz = memo(({ children, title, as, href, className = '', onClick, ...restProps }) => {
                         // ? Memmoized classNames
                         const cN = useMemo(
                             () =>
                                 classNames(
                                     'px-12 py-6 font-medium text-sm rounded-md select-none',
                                     // {
                                     //     'active:bg-dominantOpa': as === 'link',
                                     //     'border dark:text-dominant border-dominant bg-dominant': as === 'button'
                                     // },
                                     className
                                 ),
                             [as, className]
                         )

                         const renderComponent = useCallback(() => {
                             switch (as) {
                                 case 'link':
                                     return (
                                         <Link href={href} prefetch={false} {...restProps}>
                                             <a className={cN}>{children || title || 'Need title'}</a>
                                         </Link>
                                     )
                                 case 'button':
                                 default:
                                     return (
                                         <button className={cN} onClick={(e) => onClick && onClick(e)} {...restProps}>
                                             {children || title || 'Need title'}
                                         </button>
                                     )
                             }
                         }, [as, cN, title, restProps])

                         return renderComponent()
                     }
)
export default Buttonz
