import React, { ReactNode } from 'react';
import classNames from 'classnames';
type Props = {
    variants: 'outlined' | 'primary';
    children: ReactNode;
    className?: string;
};

export default function Button({ variants, children, className }: Props) {
    console.log(variants);
    return (
        <button
            className={classNames(
                'flex items-center text-sm rounded-[8px] font-medium py-3 px-6 leading-[14px]',
                variants === 'outlined' && 'bg-btnOutline text-redPrimary border border-redPrimary',
                variants === 'primary' && 'bg-redPrimary text-white',
                className
            )}
        >
            {children}
        </button>
    );
}
