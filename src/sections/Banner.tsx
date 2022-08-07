import React from 'react';
import Button from '../components/Button';

type Props = {};

export default function Banner({}: Props) {
    return (
        <section className="text-center flex flex-col items-center h-[18.75rem] justify-center bg_section1">
            {/* tailwind error */}
            <div className="text-[3rem] leading-[3.875rem] font-bold">Daylaslogan</div>
            <div className="text-[3rem] leading-[3.875rem] font-bold text-redPrimary mb-4">
                Cuanamiinsurant
            </div>
            <Button variants="gradient" className="!w-[223px] !h-[56px]">
                ketnoivi
            </Button>
        </section>
    );
}
