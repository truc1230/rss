import React from 'react';
import { ButtonNao, CardNao } from 'components/screens/Nao/NaoStyle';
import { useTranslation } from 'next-i18next';

import { getS3Url } from 'redux/actions/utils';
import Countdown from 'react-countdown';
import { useMemo } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

const ContesRules = ({ inHome = false, previous, season, start, end, seasons, title, rules }) => {
    const { t } = useTranslation();
    const router = useRouter();
    const renderCountDown = () => {
        const CONTEST_TIME = {
            START: new Date(start).getTime(),
            END: new Date(end).getTime()
        }
        const now = Date.now()
        if (now < CONTEST_TIME.START) {
            return <>
                <div className='font-light text-sm sm:text-[1rem] text-nao-text'>{t('nao:contest:start_in')}</div>
                <Countdown
                    date={CONTEST_TIME.START} // countdown 60s
                    renderer={({ formatted: {
                        days,
                        hours,
                        minutes,
                        seconds,
                    } }) => <div className="text-lg sm:text-2xl flex" dangerouslySetInnerHTML={{ __html: t('nao:contest:date', { days, hours, minutes }) }} ></div>}
                    onComplete={() => setIsLoadingEmail(false)}
                />
            </>
        } else if (now >= CONTEST_TIME.START && now < CONTEST_TIME.END) {
            return <>
                <div className='font-light text-sm sm:text-[1rem] text-nao-text'>{t('nao:contest:end_in')}</div>
                <Countdown
                    date={CONTEST_TIME.END} // countdown 60s
                    renderer={({ formatted: {
                        days,
                        hours,
                        minutes,
                        seconds,
                    } }) => <div className="text-lg sm:text-2xl flex" dangerouslySetInnerHTML={{ __html: t('nao:contest:date', { days, hours, minutes }) }} ></div>}
                    onComplete={() => setIsLoadingEmail(false)}
                />
            </>
        } else {
            return <>
                <div className='text-lg sm:text-2xl flex'>{t('nao:contest:ended')}</div>
            </>
        }
    }

    const current = seasons[seasons.length - 1]
    const seasonsFilter = seasons?.filter(e => e.season !== season && e?.season !== current?.season)
    const subTitle = seasons?.find(e => e.season === season)?.title ?? title
    return (
        <section className='contest_rules pt-[3.375rem] flex justify-center md:justify-between flex-wrap relative text-center sm:text-left'>
            <div>
                <label className='text-[1.75rem] sm:text-[2.125rem] text-nao-white font-semibold leading-10'>{t('nao:contest:title', { value: t(`nao:contest:${subTitle}`) })}</label>
                <div className='text-nao-text text-sm sm:text-lg pt-3 sm:pt-[6px] leading-6'>{t('nao:contest:description')} <span className='text-nao-green font-semibold'>300,000,000 VNDC</span></div>
                <div className='gap-4 flex items-center pt-9 sm:pt-6 flex-wrap justify-center sm:justify-start'>
                    {
                        inHome
                            ? <ButtonNao onClick={() => router.push('/contest')} className='px-[18px] text-sm font-semibold w-max !rounded-md'>{t('nao:contest:ranking')}</ButtonNao>
                            :
                            <ButtonNao onClick={() => router.push(rules)} className='px-[18px] text-sm font-semibold w-max !rounded-md'>{t('nao:contest:detail_rules')}</ButtonNao>
                    }
                    {seasonsFilter.map((item, index) => (
                        <ButtonNao key={index} onClick={() => router.push(`/contest/${item.season}`)} border className='px-[18px] text-sm font-semibold w-max !rounded-md'>{t(item?.button)}</ButtonNao>
                    ))}
                    <CardNao customHeight={'sm:min-h-[40px] lg:min-h-[40] min-h-[50px]'} noBg className="flex !flex-row !justify-center md:!justify-start !py-3 items-center gap-3 sm:!bg-none flex-wrap">
                        {renderCountDown()}
                    </CardNao>
                </div>
            </div>
            <div className='relative xl:-top-10 sm:m-auto md:m-auto mt-4'>
                <img src={getS3Url("/images/nao/contest/ic_contest_info.png")} alt="" width={300} height={292} />
            </div>
        </section>
    );
};

export default ContesRules;
