import React, { memo } from 'react';
import { getS3Url } from 'redux/actions/utils';
import { useTranslation } from 'next-i18next';

const NaoFooter = memo(() => {
    const { t } = useTranslation();
    const onRedirect = (key) => {
        let url = '';
        switch (key) {
            case 'term':
                url = 'https://nao.namifutures.com/terms-of-service';
                break;
            case 'privacy':
                url = 'https://nao.namifutures.com/privacy';
                break;
            case 'facebook':
                url = 'https://www.facebook.com/groups/nami.exchange';
                break;
            case 'telegram':
                url = 'https://t.me/namitradevn';
                break;
            case 'twitter':
                url = 'https://twitter.com/NamiTrade';
                break;
            case 'reddit':
                url = 'https://www.reddit.com/r/NAMIcoin';
                break;
            default:
                break;
        }
        window.open(url, '_blank');
    }

    return (
        <div className="nao_footer min-h-[6.25rem] bg-nao-bg3 flex items-center mt-[100px] sm:mt-20 py-9 px-4 nao:p-0">
            <div className="text-sm sm:text-[1rem] max-w-[72.5rem] w-full m-auto h-full flex flex-col lg:flex-row  items-center justify-between text-center flex-wrap sm:gap-5">
                <div className="nao_footer_left text-nao-text font-medium gap-0 sm:gap-5 flex items-center sm:flex-row flex-col sm:w-auto w-full">
                    <div onClick={() => onRedirect('term')} className="pb-3 border-b border-nao-line w-full sm:border-none whitespace-nowrap sm:p-0 cursor-pointer">{t('nao:term')}</div>
                    <div className="hidden sm:flex">|</div>
                    <div onClick={() => onRedirect('privacy')} className="py-3 border-b border-nao-line w-full sm:border-none whitespace-nowrap sm:p-0 cursor-pointer">{t('nao:privacy_policy')}</div>
                </div>
                
                
                <div className='nao_footer_center text-nao-text font-medium pt-6 pb-4 sm:p-0 mx-11 sm:mx-0'>Copyright © 2022 Nami Foundation. All rights reserved.</div>
                <div className='nao_footer_right items-center gap-5 flex'>
                    <img className="cursor-pointer" onClick={() => onRedirect('facebook')} src={getS3Url("/images/nao/ic_facebook.png")} alt="" height={24} width={24} />
                    <img className="cursor-pointer" onClick={() => onRedirect('telegram')} src={getS3Url("/images/nao/ic_telegram.png")} alt="" height={24} width={24} />
                    <img className="cursor-pointer" onClick={() => onRedirect('twitter')} src={getS3Url("/images/nao/ic_twitter.png")} alt="" height={24} width={24} />
                    <img className="cursor-pointer" onClick={() => onRedirect('reddit')} src={getS3Url("/images/nao/ic_reddit.png")} alt="" height={24} width={24} />
                </div>
            </div>
        </div>
    );
});

export default NaoFooter;