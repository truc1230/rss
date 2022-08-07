import React, { ReactNode } from 'react';
import classNames from 'classnames';
type Props = {
    variants: 'outlined' | 'primary' | 'gradient';
    children: ReactNode;
    className?: string;
};

export default function Button({ variants, children, className }: Props) {
    return (
        <button
            className={classNames(
                'flex items-center justify-center rounded-[8px] font-medium py-auto px-auto ',
                variants === 'outlined' && 'bg-btnOutline text-redPrimary border border-redPrimary',
                variants === 'primary' && 'bg-redPrimary text-white',
                variants === 'gradient' && 'bg-gradient text-white',
                className
            )}
        >
            {children}
        </button>
    );
}
