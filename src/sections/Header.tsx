// @ts-nocheck
import classNames from 'classnames';
import React, { memo, useEffect } from 'react';
import Button from '../components/Button';
import { CarretDown } from '../components/Svg';
import useLanguage from '../hooks/useLanguage';
import useWallet from '../hooks/useWallet';
import { LANGUAGE_TAG } from '../utils/constants';

const Header = () => {
    const [currentLocale, onChangeLang] = useLanguage();
    const wallet = useWallet();
    const {
        account,
        switchNetwork,
        chain,
        activate,
        deactivate,
        isActive,
        error,
        connector,
        provider,
        balance,
        contractCaller,
        getBalance,
        getBalanceNain
    } = wallet;
    console.log(wallet);
    function handleConnectWallet() {
        activate('metaMask');
    }

    const renderLanguageBtn = (language) => {
        if (currentLocale === language)
            return (
                <div className="text-sm font-medium p-[6px] leading-4 rounded uppercase bg-gradient text-white">
                    {language}
                </div>
            );
        else return <div className="text-sm font-medium mx-[6px] uppercase">{language}</div>;
    };

    function renderBtnLogin() {
        if (account)
            return (
                <div className="flex items-center gap-2 bg-white3 px-1 py-2 rounded-[5px]">
                    <img src="/images/cryptocurrency.png" className="w-6 h-6" />
                    <div className="text-sm leading-[14px] font-semibold">{connector?.name}</div>
                    <div className="text-sm leading-[14px] font-semibold px-4 py-1 bg-white rounded-[5px]">
                        {account.slice(0, 8)}
                    </div>
                </div>
            );
        else
            return (
                <Button
                    variants="gradient"
                    className="text-sm leading-[14px] w-[107px] h-[38px]"
                    onClick={handleConnectWallet}
                >
                    ketnoivi
                </Button>
            );
    }
    return (
        <header className="flex items-center justify-between px-3 lg:px-10 h-[70px]">
            <div className="flex items-center">
                <img src="/images/logo_insurance.png" className="w-[75px] h-[36px]" alt="logo" />
                <div className="items-center font-medium gap-6 ml-12 hidden md:flex">
                    <div className="text-sm leading-[14px]">Trangchu</div>
                    <div>
                        <div className="flex items-center text-sm leading-[14px]">
                            muabaohiem
                            <CarretDown className="ml-[14px]" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-6 h-full">
                {/* en-vi */}
                <div
                    className="flex items-center border border-redPrimary p-1 rounded-[3px] gap-1 cursor-pointer"
                    onClick={onChangeLang}
                >
                    {renderLanguageBtn(LANGUAGE_TAG.VI)}
                    {renderLanguageBtn(LANGUAGE_TAG.EN)}
                </div>
                {renderBtnLogin()}
            </div>
        </header>
    );
};

export default Header;
