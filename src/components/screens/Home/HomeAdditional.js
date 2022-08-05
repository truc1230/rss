import HomeCurrentActivity from 'src/components/screens/Home/HomeCurrentActivity';
import Button from 'src/components/common/Button';
import Link from 'next/link';
import colors from '../../../styles/colors';

import { Eye, Lock, Mail } from 'react-feather';
import { useWindowSize } from 'utils/customHooks';
import { useSelector } from 'react-redux';
import { THEME_MODE } from 'hooks/useDarkMode';
import { Trans, useTranslation } from 'next-i18next';
import { LANGUAGE_TAG } from 'hooks/useLanguage';
import { useEffect, useState } from 'react';
import { getLoginUrl, getS3Url, getV1Url } from 'redux/actions/utils';

const HomeAdditional = ({ parentState }) => {
    // * Initial State
    const [stepCount, setStepCount] = useState(0)
    const [state, set] = useState({
        focus: null,
    })
    const setState = (state) => set((prevState) => ({ ...prevState, ...state }))

    // * Use Hooks
    const { width } = useWindowSize()
    const {
        t,
        i18n: { language },
    } = useTranslation(['home', 'input', 'common', 'navbar'])

    const theme = useSelector((state) => state.user.theme)

    useEffect(() => {
        let interval = setInterval(() => {
            setStepCount((lastTimerCount) => {
                if (lastTimerCount >= 2) {
                    setStepCount(0)
                }
                return lastTimerCount + 1
            })
        }, 2800)
        return () => clearInterval(interval)
    }, [])

    // useEffect(() => {
    //     console.log('namidev-DEBUG: ', stepCount)
    // }, [stepCount])

    return (
        <>
            <section className='homepage-first_award'>
                <div className='homepage-first_award__wrapper mal-container'>
                    <div className='homepage-first_award___step'>
                        <div className='homepage-first_award__title'>
                            {t('home:first_award.title')}
                        </div>
                        <div className='homepage-first_award__manual'>
                            <div className='homepage-first_award__manual__item'>
                                <Trans>{t('home:first_award.rule_1')}</Trans>
                            </div>
                            <div className='homepage-first_award__manual__item'>
                                <Trans i18nKey='home:first_award.rule_2'>
                                    <span className='text-teal'>40,000+</span>
                                </Trans>
                            </div>
                            <div className='homepage-first_award__manual__item'>
                                <Trans i18nKey='home:first_award.rule_3'>
                                    <span className='text-teal'>400+</span>
                                </Trans>
                            </div>
                            <div className='homepage-first_award__manual__item'>
                                <Trans i18nKey='home:first_award.rule_4'>
                                    <span className='text-teal'>125x</span>
                                </Trans>
                            </div>
                            <div className='homepage-first_award__manual__item'>
                                <Trans i18nKey='home:first_award.rule_5'>
                                    <span className='text-teal'>0,06%</span>
                                </Trans>
                            </div>
                            <div className='homepage-first_award__manual__item'>
                                <Trans i18nKey='home:first_award.rule_6'>
                                    <span className='text-teal'>24/7</span>
                                </Trans>
                            </div>
                            <div className='homepage-first_award__manual__item'>
                                {t('home:first_award.following_at')}
                                <div className='flex flex-row items-center'>
                                    <Link href='https://www.facebook.com/namifutures'>
                                        <a target='_blank'>
                                            <img
                                                src={getS3Url(
                                                    '/images/icon/ic_facebook.png'
                                                )}
                                                width={
                                                    width >= 768 ? '52' : '32'
                                                }
                                                height={
                                                    width >= 768 ? '52' : '32'
                                                }
                                            />
                                        </a>
                                    </Link>
                                    <Link href='https://twitter.com/NamiTrade'>
                                        <a target='_blank'>
                                            <img
                                                src={getS3Url(
                                                    '/images/icon/ic_twitter.png'
                                                )}
                                                width={
                                                    width >= 768 ? '52' : '32'
                                                }
                                                height={
                                                    width >= 768 ? '52' : '32'
                                                }
                                            />
                                        </a>
                                    </Link>
                                    <Link href='https://t.me/namitradevn'>
                                        <a target='_blank' title='Telegram VN'>
                                            <img
                                                src={getS3Url(
                                                    '/images/icon/ic_telegram.png'
                                                )}
                                                width={
                                                    width >= 768 ? '52' : '32'
                                                }
                                                height={
                                                    width >= 768 ? '52' : '32'
                                                }
                                            />
                                        </a>
                                    </Link>
                                    <Link href='https://t.me/namitrade'>
                                        <a
                                            target='_blank'
                                            title='Telegram Global'
                                        >
                                            <img
                                                src={getS3Url(
                                                    '/images/icon/ic_telegram.png'
                                                )}
                                                width={
                                                    width >= 768 ? '52' : '32'
                                                }
                                                height={
                                                    width >= 768 ? '52' : '32'
                                                }
                                            />
                                        </a>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='homepage-first_award___form'>
                        <div className='homepage-first_award___form___title'>
                            {t('home:first_award.join_nami_by')}
                        </div>
                        <div className='homepage-first_award___form___platform'>
                            <a href={getLoginUrl('sso', 'register')}>
                                <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    width='52'
                                    height='52'
                                    viewBox='0 0 75 75'
                                    fill='none'
                                >
                                    <rect
                                        x='0.5'
                                        y='0.5'
                                        width='74'
                                        height='74'
                                        rx='14.5'
                                        stroke={
                                            theme === THEME_MODE.LIGHT
                                                ? '#E2E8F0'
                                                : colors.darkBlue3
                                        }
                                    />
                                    <path
                                        d='M50.4164 37.4999C50.4164 30.3699 44.6297 24.5833 37.4997 24.5833C30.3697 24.5833 24.5831 30.3699 24.5831 37.4999C24.5831 43.7516 29.0264 48.957 34.9164 50.1583V41.3749H32.3331V37.4999H34.9164V34.2708C34.9164 31.7778 36.9443 29.7499 39.4372 29.7499H42.6664V33.6249H40.0831C39.3727 33.6249 38.7914 34.2062 38.7914 34.9166V37.4999H42.6664V41.3749H38.7914V50.352C45.3143 49.7062 50.4164 44.2037 50.4164 37.4999Z'
                                        fill={
                                            theme === THEME_MODE.LIGHT
                                                ? '#223050'
                                                : colors.grey4
                                        }
                                    />
                                </svg>
                            </a>
                            <a href={getLoginUrl('sso', 'register')}>
                                <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    width='52'
                                    height='52'
                                    viewBox='0 0 75 75'
                                    fill='none'
                                >
                                    <rect
                                        x='0.5'
                                        y='0.5'
                                        width='74'
                                        height='74'
                                        rx='14.5'
                                        stroke={
                                            theme === THEME_MODE.LIGHT
                                                ? '#E2E8F0'
                                                : colors.darkBlue3
                                        }
                                    />
                                    <path
                                        d='M43.1382 30.2847C40.697 30.2847 39.6653 31.4496 37.9651 31.4496C36.222 31.4496 34.8923 30.2931 32.7768 30.2931C30.7061 30.2931 28.498 31.5574 27.0957 33.711C25.1267 36.748 25.461 42.4679 28.65 47.3407C29.7907 49.0851 31.314 51.0413 33.3121 51.0625H33.3484C35.0849 51.0625 35.6007 49.9255 37.9905 49.9121H38.0269C40.3809 49.9121 40.8532 51.0559 42.5824 51.0559H42.6187C44.6168 51.0347 46.2219 48.8671 47.3626 47.1294C48.1836 45.8797 48.4888 45.2525 49.1184 43.8387C44.5054 42.0877 43.7643 35.548 48.3265 33.0408C46.9339 31.297 44.977 30.2871 43.1322 30.2871L43.1382 30.2847Z'
                                        fill={
                                            theme === THEME_MODE.LIGHT
                                                ? '#223050'
                                                : colors.grey4
                                        }
                                    />
                                    <path
                                        d='M42.6009 23.939C41.1478 24.0377 39.4525 24.9628 38.4595 26.1707C37.5586 27.2654 36.8175 28.8893 37.1081 30.4641H37.2243C38.7719 30.4641 40.3558 29.5323 41.281 28.3383C42.1722 27.2018 42.8479 25.5913 42.6009 23.939Z'
                                        fill={
                                            theme === THEME_MODE.LIGHT
                                                ? '#223050'
                                                : colors.grey4
                                        }
                                    />
                                </svg>
                            </a>
                            <a href={getLoginUrl('sso', 'register')}>
                                <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    width='52'
                                    height='52'
                                    viewBox='0 0 75 75'
                                    fill='none'
                                >
                                    <rect
                                        x='0.5'
                                        y='0.5'
                                        width='74'
                                        height='74'
                                        rx='14.5'
                                        stroke={
                                            theme === THEME_MODE.LIGHT
                                                ? '#E2E8F0'
                                                : colors.darkBlue3
                                        }
                                    />
                                    <path
                                        d='M48.8759 36.1121L48.7523 35.5876H37.3533V40.4121H44.1641C43.4569 43.7699 40.1757 45.5374 37.4955 45.5374C35.5453 45.5374 33.4896 44.7171 32.129 43.3986C31.4111 42.6919 30.8397 41.8504 30.4474 40.9225C30.0552 39.9946 29.8498 38.9985 29.843 37.9911C29.843 35.9589 30.7563 33.9262 32.0852 32.5891C33.4141 31.252 35.4212 30.5039 37.4167 30.5039C39.7021 30.5039 41.34 31.7174 41.9525 32.2708L45.3809 28.8605C44.3751 27.9768 41.6123 25.7499 37.3062 25.7499C33.984 25.7499 30.7984 27.0225 28.4698 29.3434C26.1719 31.6288 24.9824 34.9335 24.9824 37.9999C24.9824 41.0662 26.1079 44.2058 28.3348 46.5092C30.7142 48.9658 34.0841 50.2499 37.554 50.2499C40.7111 50.2499 43.7036 49.0128 45.8364 46.7685C47.9331 44.5591 49.0176 41.5021 49.0176 38.2974C49.0176 36.9482 48.8819 36.1471 48.8759 36.1121Z'
                                        fill={
                                            theme === THEME_MODE.LIGHT
                                                ? '#223050'
                                                : colors.grey4
                                        }
                                    />
                                </svg>
                            </a>
                        </div>
                        <div className='homepage-first_award___form___or'>
                            {language === LANGUAGE_TAG.VI ? 'hoặc' : 'or'}
                        </div>
                        <div className='homepage-first_award___form___input_group'>
                            <div
                                className={`homepage-first_award___form___input__wrapper
                                             ${
                                                 state.focus === 'email'
                                                     ? 'homepage-first_award___form___focus'
                                                     : ''
                                             }`}
                            >
                                <Mail size={16} />
                                <input
                                    className='homepage-first_award___form___input'
                                    onFocus={() => setState({ focus: 'email' })}
                                    onBlur={() => setState({ focus: null })}
                                    placeholder={t('input:email_placeholder')}
                                />
                            </div>
                            <div
                                style={{ marginTop: 12 }}
                                className={`homepage-first_award___form___input__wrapper
                                             ${
                                                 state.focus === 'pwd'
                                                     ? 'homepage-first_award___form___focus'
                                                     : ''
                                             }`}
                            >
                                <Lock size={20} />
                                <input
                                    className='homepage-first_award___form___input'
                                    onFocus={() => setState({ focus: 'pwd' })}
                                    onBlur={() => setState({ focus: null })}
                                    placeholder={t(
                                        'input:password_placeholder'
                                    )}
                                />
                                <Eye size={16} />
                            </div>
                            <div>
                                <Button
                                    style={{
                                        marginTop: 28,
                                        borderRadius: 12,
                                        fontSize: 14,
                                        height: 48,
                                        lineHeight: '35px',
                                    }}
                                    href={getLoginUrl('sso', 'register')}
                                    title={t('common:sign_up')}
                                    type='primary'
                                />
                            </div>
                            <div className='text-sm text-center text-txtSecondary dark:text-txtSecondary-dark font-medium mt-3'>
                                {t('common:already_have_account')}
                                <a
                                    href={getLoginUrl('sso', 'login')}
                                    className='text-dominant'
                                >
                                    {t('common:sign_in')}
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className='homepage-journey'>
                <div className='homepage-journey__wrapper mal-container'>
                    <div className='homepage-journey__title'>
                        {t('home:journey.title')}
                    </div>
                    <div className='homepage-journey__description'>
                        {width >= 992 ? (
                            <>
                                {t('home:journey.description_desktop1')}
                                <br />
                                {t('home:journey.description_desktop2')}
                            </>
                        ) : (
                            <>{t('home:journey.description_mobile')}</>
                        )}
                    </div>
                    <div className='homepage-journey__group_content'>
                        <div className='homepage-journey__group_content___left'>
                            <div className='homepage-journey__group_content___left__item'>
                                <div className='homepage-journey__group_content___left__item___icon'>
                                    <img
                                        src={getS3Url(
                                            '/images/screen/homepage/maxium_performance.png'
                                        )}
                                        width={width >= 1366 ? '52' : '44'}
                                        height={width >= 1366 ? '52' : '44'}
                                    />
                                </div>
                                <div className='homepage-journey__group_content___left__item___content'>
                                    <div className='homepage-journey__group_content___left__item___content__title'>
                                        {t('home:journey.reason_1')}
                                    </div>
                                    <div className='homepage-journey__group_content___left__item___content__description'>
                                        {t('home:journey.reason_1_description')}
                                    </div>
                                    <div className='homepage-journey__group_content___left__item___content__viewmore'>
                                        <Button
                                            title={t('common:read_more')}
                                            type='primary'
                                            href={getV1Url('/futures')}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div
                                className='homepage-journey__group_content___left__item'
                                style={{ marginBottom: 26 }}
                            >
                                <div className='homepage-journey__group_content___left__item___icon'>
                                    <img
                                        src={getS3Url(
                                            '/images/screen/homepage/master_revenue.png'
                                        )}
                                        width={width >= 1366 ? '52' : '44'}
                                        height={width >= 1366 ? '52' : '44'}
                                    />
                                </div>
                                <div className='homepage-journey__group_content___left__item___content'>
                                    <div className='homepage-journey__group_content___left__item___content__title'>
                                        {t('home:journey.reason_2')}
                                    </div>
                                    <div className='homepage-journey__group_content___left__item___content__description'>
                                        {t('home:journey.reason_2_description')}
                                    </div>
                                    <div className='homepage-journey__group_content___left__item___content__viewmore'>
                                        {/*<Button title={null} type="primary" />*/}
                                    </div>
                                </div>
                            </div>
                            <div className='homepage-journey__group_content___left__item'>
                                <div className='homepage-journey__group_content___left__item___icon'>
                                    <img
                                        src={getS3Url(
                                            '/images/screen/homepage/token_saving_cost.png'
                                        )}
                                        width={width >= 1366 ? '52' : '44'}
                                        height={width >= 1366 ? '52' : '44'}
                                    />
                                </div>
                                <div className='homepage-journey__group_content___left__item___content'>
                                    <div className='homepage-journey__group_content___left__item___content__title'>
                                        {t('home:journey.reason_3')}
                                    </div>
                                    <div className='homepage-journey__group_content___left__item___content__description'>
                                        {t('home:journey.reason_3_description')}
                                    </div>
                                    <div className='homepage-journey__group_content___left__item___content__viewmore'>
                                        <Button
                                            title={t('common:read_more')}
                                            type='primary'
                                            href='https://launchpad.nami.exchange'
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className='homepage-journey__group_content___left__item'>
                                <div className='homepage-journey__group_content___left__item___icon'>
                                    <img
                                        src={getS3Url(
                                            '/images/screen/homepage/crypto_knowledge.png'
                                        )}
                                        width={width >= 1366 ? '52' : '44'}
                                        height={width >= 1366 ? '52' : '44'}
                                    />
                                </div>
                                <div className='homepage-journey__group_content___left__item___content'>
                                    <div className='homepage-journey__group_content___left__item___content__title'>
                                        {t('home:journey.reason_4')}
                                    </div>
                                    <div className='homepage-journey__group_content___left__item___content__description'>
                                        {t('home:journey.reason_4_description')}
                                    </div>
                                    <div className='homepage-journey__group_content___left__item___content__viewmore'>
                                        <Button
                                            title={t('common:read_more')}
                                            type='primary'
                                            href='https://explained.nami.exchange/'
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='homepage-journey__group_content___right'>
                            <img
                                src={getS3Url(
                                    '/images/screen/homepage/journey_graphics2.png'
                                )}
                                alt='Nami Exchange'
                            />
                        </div>
                    </div>
                </div>
            </section>

            <section
                id='nami_exchange_download_app'
                className='homepage-app_intro'
            >
                <div className='homepage-app_intro___wrapper mal-container'>
                    <div className='homepage-app_intro___content'>
                        <div className='homepage-app_intro___content___title'>
                            {t('home:intro_app.title_1')}
                            <br />
                            {t('home:intro_app.title_2')}
                        </div>
                        <div className='homepage-app_intro___content___description'>
                            {t('home:intro_app.description')}
                        </div>
                        <div className='homepage-app_intro___content___button__group'>
                            <div
                                onClick={() =>
                                    window.open(
                                        'https://apps.apple.com/app/id1480302334',
                                        '_blank'
                                    )
                                }
                            >
                                <img
                                    src={getS3Url(
                                        '/images/screen/homepage/app_store_light.png'
                                    )}
                                    alt='Nami Exchange'
                                />
                            </div>
                            <div
                                onClick={() =>
                                    window.open(
                                        'https://play.google.com/store/apps/details?id=com.namicorp.exchange',
                                        '_blank'
                                    )
                                }
                            >
                                <img
                                    src={getS3Url(
                                        '/images/screen/homepage/play_store_light.png'
                                    )}
                                    alt='Nami Exchange'
                                />
                            </div>
                            <div
                                onClick={() =>
                                    parentState && parentState({ showQR: true })
                                }
                            >
                                {theme && theme !== THEME_MODE.LIGHT ? (
                                    <img
                                        src={getS3Url('/images/icon/ic_qr.png')}
                                        alt='Nami Exchange'
                                    />
                                ) : (
                                    <img
                                        src={getS3Url(
                                            '/images/screen/homepage/qr_light.png'
                                        )}
                                        alt='Nami Exchange'
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                    <div className='homepage-app_intro___graphics'>
                        <img
                            className='homepage-app_intro___mb_graphics'
                            src={getS3Url(
                                `/images/screen/homepage/mobile_dual_ip_${
                                    theme === THEME_MODE.LIGHT
                                        ? 'light'
                                        : 'dark'
                                }.png`
                            )}
                            alt='Nami Exchange'
                        />
                        <img
                            className='homepage-app_intro___desktop_graphics'
                            src={getS3Url(
                                `/images/screen/homepage/dual_ip_${
                                    theme === THEME_MODE.LIGHT
                                        ? 'light'
                                        : 'dark'
                                }.png`
                            )}
                            alt='Nami Exchange'
                        />
                    </div>
                    {theme && theme === THEME_MODE.LIGHT && (
                        <img
                            className='homepage-app_intro___graphics__backward'
                            src={getS3Url(
                                '/images/screen/homepage/corner_right.png'
                            )}
                            alt='Nami Exchange'
                        />
                    )}
                </div>
            </section>

            <section className='homepage-trade3step'>
                <div className='homepage-trade3step___wrapper'>
                    <div className='homepage-trade3step___title'>
                        {t('home:trade3step.title')}
                    </div>

                    <div className='homepage-trade3step___step___wrapper'>
                        <div className='homepage-trade3step___step___item'>
                            <div className='homepage-trade3step___step___item___inner'>
                                <div
                                    className={`homepage-trade3step___step___item__label ${
                                        stepCount === 0
                                            ? 'text-teal transition-all duration-300 ease-in-out'
                                            : ''
                                    }`}
                                >
                                    01
                                </div>
                                <div className='homepage-trade3step___step___item__sublabel'>
                                    {t('home:trade3step.step_1')}
                                </div>
                            </div>
                            <div className='homepage-trade3step__vertial_dot_line' />
                            <div className='homepage-trade3step__horizontal_dot_line' />
                        </div>
                        <div className='homepage-trade3step___step___item'>
                            <div className='homepage-trade3step___step___item___inner'>
                                <div
                                    className={`homepage-trade3step___step___item__label ${
                                        stepCount === 1
                                            ? 'text-teal transition-all duration-300 ease-in-out'
                                            : ''
                                    }`}
                                >
                                    02
                                </div>
                                <div className='homepage-trade3step___step___item__sublabel'>
                                    {t('home:trade3step.step_2')}
                                </div>
                            </div>
                            <div className='homepage-trade3step__vertial_dot_line' />
                            <div className='homepage-trade3step__horizontal_dot_line' />
                        </div>
                        <div className='homepage-trade3step___step___item'>
                            <div className='homepage-trade3step___step___item___inner'>
                                <div
                                    className={`homepage-trade3step___step___item__label ${
                                        stepCount === 2
                                            ? 'text-teal transition-all duration-300 ease-in-out'
                                            : ''
                                    }`}
                                >
                                    03
                                </div>
                                <div className='homepage-trade3step___step___item__sublabel'>
                                    {t('home:trade3step.step_3')}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='homepage-trade3step___create_account'>
                        <Button
                            title={t('common:create_account')}
                            type='primary'
                            href={getLoginUrl('sso', 'register')}
                        />
                        <div className='homepage-trade3step___create_account___pr'>
                            {t('home:trade3step.chill_a_bit')}
                        </div>
                    </div>
                </div>
            </section>

            <section className='homepage-whynami'>
                <div className='homepage-whynami___wrapper mal-container'>
                    <div className='homepage-whynami___title'>
                        {t('home:why_nami.title')}
                        {width < 992 && <br />}
                        <span className='text-dominant'> Nami Exchange ?</span>
                    </div>
                    <div className='homepage-whynami___description'>
                        {t('home:why_nami.description')}
                    </div>

                    <div className='homepage-whynami___reason__group'>
                        <div className='homepage-whynami___reason__item'>
                            <img
                                src={getS3Url(
                                    '/images/screen/homepage/registered_people.png'
                                )}
                                width='52'
                                height='52'
                            />
                            <div className='homepage-whynami___reason__item___title'>
                                {t('home:why_nami.reason_1')}
                            </div>
                            <div className='homepage-whynami___reason__item___description'>
                                {t('home:why_nami.reason_1_description')}
                            </div>
                        </div>

                        <div className='homepage-whynami___reason__item'>
                            <img
                                src={getS3Url(
                                    '/images/screen/homepage/investment_diversity.png'
                                )}
                                width='52'
                                height='52'
                            />
                            <div className='homepage-whynami___reason__item___title'>
                                {t('home:why_nami.reason_2')}
                            </div>
                            <div className='homepage-whynami___reason__item___description'>
                                {t('home:why_nami.reason_2_description')}
                            </div>
                        </div>

                        <div className='homepage-whynami___reason__item'>
                            <img
                                src={getS3Url(
                                    '/images/screen/homepage/fee_saving.png'
                                )}
                                width='52'
                                height='52'
                            />
                            <div className='homepage-whynami___reason__item___title'>
                                {t('home:why_nami.reason_3')}
                            </div>
                            <div className='homepage-whynami___reason__item___description'>
                                {t('home:why_nami.reason_3_description')}
                            </div>
                        </div>

                        <div className='homepage-whynami___reason__item'>
                            <img
                                src={getS3Url(
                                    '/images/screen/homepage/effective_support.png'
                                )}
                                width='52'
                                height='52'
                            />
                            <div className='homepage-whynami___reason__item___title'>
                                {t('home:why_nami.reason_4')}
                            </div>
                            <div className='homepage-whynami___reason__item___description'>
                                {t('home:why_nami.reason_4_description')}
                                {/*Luôn có nhân viên hỗ trợ trực tiếp<br/>*/}
                                {/*đa ngôn ngữ 24/7*/}
                            </div>
                        </div>
                    </div>

                    <div className='homepage-whynami___reason__group__btn___group'>
                        {/*<Button title={t('navbar:menu.about')} target="_blank"*/}
                        {/*        type="primary" href="https://ico.nami.trade/#nami-team"/>*/}
                    </div>
                </div>
            </section>

            <HomeCurrentActivity />

            <section className='homepage-community'>
                <div className='homepage-community___wrapper mal-container'>
                    <div className='homepage-community___title'>
                        {t('home:community.title')}
                    </div>
                    <div className='homepage-community___description'>
                        {width >= 992 ? (
                            <>
                                {t('home:community.description_desktop1')}
                                <br />
                                {t('home:community.description_desktop2')}
                            </>
                        ) : (
                            <>{t('home:community.description_mobile')}</>
                        )}
                    </div>
                    <div className='homepage-community___channel__group'>
                        <Link href='https://www.facebook.com/namifutures'>
                            <a
                                className='homepage-community___channel__group___item'
                                target='_blank'
                            >
                                <div className='homepage-community___channel__group___item__icon'>
                                    <img
                                        src={getS3Url(
                                            '/images/icon/ic_facebook.png'
                                        )}
                                        width='44'
                                        height='44'
                                    />
                                </div>
                                <div className='homepage-community___channel__group___item__label'>
                                    Facebook
                                </div>
                            </a>
                        </Link>
                        <Link href='https://www.facebook.com/groups/nami.exchange'>
                            <a
                                className='homepage-community___channel__group___item'
                                target='_blank'
                            >
                                <div className='homepage-community___channel__group___item__icon'>
                                    <img
                                        src={getS3Url(
                                            '/images/icon/ic_facebook.png'
                                        )}
                                        width='44'
                                        height='44'
                                    />
                                </div>
                                <div className='homepage-community___channel__group___item__label'>
                                    Facebook Group
                                </div>
                            </a>
                        </Link>
                        <Link href='https://t.me/namitrade'>
                            <a
                                className='homepage-community___channel__group___item'
                                target='_blank'
                            >
                                <div className='homepage-community___channel__group___item__icon'>
                                    <img
                                        src={getS3Url(
                                            '/images/icon/ic_telegram.png'
                                        )}
                                        width='44'
                                        height='44'
                                    />
                                </div>
                                <div className='homepage-community___channel__group___item__label'>
                                    Telegram Global
                                </div>
                            </a>
                        </Link>
                        <Link href='https://t.me/namitradevn'>
                            <a
                                className='homepage-community___channel__group___item'
                                target='_blank'
                            >
                                <div className='homepage-community___channel__group___item__icon'>
                                    <img
                                        src={getS3Url(
                                            '/images/icon/ic_telegram.png'
                                        )}
                                        width='44'
                                        height='44'
                                    />
                                </div>
                                <div className='homepage-community___channel__group___item__label'>
                                    Telegram
                                </div>
                            </a>
                        </Link>
                        <Link href='https://twitter.com/NamiTrade'>
                            <a
                                className='homepage-community___channel__group___item'
                                target='_blank'
                            >
                                <div className='homepage-community___channel__group___item__icon'>
                                    <img
                                        src={getS3Url(
                                            '/images/icon/ic_twitter.png'
                                        )}
                                        width='44'
                                        height='44'
                                    />
                                </div>
                                <div className='homepage-community___channel__group___item__label'>
                                    Twitter
                                </div>
                            </a>
                        </Link>
                        <Link href='https://www.reddit.com/r/NAMIcoin'>
                            <a
                                className='homepage-community___channel__group___item'
                                target='_blank'
                            >
                                <div className='homepage-community___channel__group___item__icon'>
                                    <img
                                        src={getS3Url(
                                            '/images/icon/ic_reddit.png'
                                        )}
                                        width='44'
                                        height='44'
                                    />
                                </div>
                                <div className='homepage-community___channel__group___item__label'>
                                    Reddit
                                </div>
                            </a>
                        </Link>
                        <Link href='https://nami.io'>
                            <a
                                className='homepage-community___channel__group___item'
                                target='_blank'
                            >
                                <div className='homepage-community___channel__group___item__icon'>
                                    <img
                                        src={getS3Url(
                                            '/images/icon/ic_globe.png'
                                        )}
                                        width='44'
                                        height='44'
                                    />
                                </div>
                                <div className='homepage-community___channel__group___item__label'>
                                    Blog
                                </div>
                            </a>
                        </Link>
                        <Link
                            href={`https://www.coingecko.com/${language}/${
                                language === LANGUAGE_TAG.VI
                                    ? 'ty_gia'
                                    : 'coins'
                            }/nami-corporation-token`}
                        >
                            <a className='homepage-community___channel__group___item'>
                                <div className='homepage-community___channel__group___item__icon'>
                                    <img
                                        src={getS3Url(
                                            '/images/icon/ic_coingecko.png'
                                        )}
                                        width='44'
                                        height='44'
                                    />
                                </div>
                                <div className='homepage-community___channel__group___item__label'>
                                    CoinGecko
                                </div>
                            </a>
                        </Link>
                    </div>
                </div>
            </section>
        </>
    )
}

export default HomeAdditional
