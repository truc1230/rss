import React from 'react';

type Props = {};

export default function Footer({}: Props) {
    return (
        <div className="bg_footer flex items-center justify-center gap-8 mt-8 h-[134px]">
            <div className="text-[1.25rem] font-medium text-white">Sản phẩm được bảo trợ bởi</div>
            <div className="flex">
                <img className="!h-[68px]" src="/images/logo_footer.png" alt="logo" />
            </div>
        </div>
    );
}
