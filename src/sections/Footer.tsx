import React from 'react';
import ReceiveEmail from './ReceiveEmail';

type Props = {};

export default function Footer({}: Props) {
    // const renderItemsFooter = () => {

    // }
    return (
        <footer>
            <div className="md:my-[120px]">
                <ReceiveEmail />
            </div>

            <div className="bg_footer flex items-center justify-center gap-8 h-[134px]">
                <div className="text-[1.25rem] font-medium text-white">
                    Sản phẩm được bảo trợ bởi
                </div>
                <div className="flex">
                    <img className="!h-[68px]" src="/images/logo_foundation.png" alt="logo" />
                </div>
            </div>
            <div className="py-12 bg-white2 px-3 sm:px-10 flex flex-col gap-6">
                <div className="block justify-between items-center md:flex">
                    <img src="/images/logo_insurance.png" alt="logo" />
                    <div className="block md:flex items-center gap-8">
                        {itemFooter.map((menu, index) => (
                            <div key={index}>
                                <p>{menu.title}</p>
                                <div className="flex items-center gap-4">
                                    {menu.items.map((submenu, subIndex) => (
                                        <a
                                            key={subIndex}
                                            href={submenu.url}
                                            className="text-txtSecondary"
                                        >
                                            {submenu.title}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="border border-divider"></div>
                <div className="text-xs leading-3 text-txtSecondary">
                    Copyright © 2021 UI8 LLC. All rights reserved
                </div>
            </div>
        </footer>
    );
}
const itemFooter = [
    {
        title: 'tinhnang',
        items: [
            {
                title: 'muabaohiem',
                url: '#'
            },
            {
                title: 'muanain',
                url: '#'
            }
        ]
    },
    {
        title: 'tailieu',
        items: [
            {
                title: 'whitepaper',
                url: '#'
            },
            {
                title: 'dieukhoansudung',
                url: '#'
            }
        ]
    }
];
