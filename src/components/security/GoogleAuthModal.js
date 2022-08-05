import { Transition } from '@headlessui/react';
import find from 'lodash/find';
import { useTranslation } from 'next-i18next';
import { useEffect, useMemo, useState } from 'react';
import Countdown from 'react-countdown';
import { QRCode } from 'react-qrcode-logo';
import { useDispatch } from 'react-redux';
import { IconArrowLeft, IconClose, IconLoading, IconSecurityGoogleAuthenticator } from 'src/components/common/Icons';
import * as Error from 'src/redux/actions/apiError';
import { SECURITY_VERIFICATION } from 'src/redux/actions/const';
import { getCheckPassCode, verifyCheckPassCode } from 'src/redux/actions/user';
import { useComponentVisible } from 'src/utils/customHooks';
import showNotification from 'src/utils/notificationService';

const GoogleAuthModalWrapper = ({ user,
    closeModal,
    authType,
    securityMethods,
    email,
    phone,
    currentPassword,
    newPassword,
    googleSecretKey,
    googleSecretKeyQr,
    checkPassId,
    confirmSecure }) => {
    const { isComponentVisible, setIsComponentVisible } = useComponentVisible(true);

    useEffect(() => {
        if (!isComponentVisible) {
            setTimeout(closeModal, 200);
        }

        return clearTimeout(closeModal, 200);
    }, [isComponentVisible]);

    return (
        <div className="fixed w-full h-full z-30 flex items-center justify-center top-0 left-0 bg-[rgba(0,0,0,0.4)]">
            <GoogleAuthModal
                user={user}
                closeModal={closeModal}
                authType={authType}
                securityMethods={securityMethods}
                email={email}
                phone={phone}
                currentPassword={currentPassword}
                newPassword={newPassword}
                googleSecretKey={googleSecretKey}
                googleSecretKeyQr={googleSecretKeyQr}
                checkPassId={checkPassId}
                confirmSecure={confirmSecure}
                isComponentVisible={isComponentVisible}
                setIsComponentVisible={setIsComponentVisible}
            />
        </div>
    );
};

const GoogleAuthModal = ({
    user,
    authType,
    securityMethods,
    email,
    phone,
    currentPassword,
    newPassword,
    googleSecretKey,
    googleSecretKeyQr,
    checkPassId,
    confirmSecure,
    isComponentVisible,
    setIsComponentVisible,
}) => {
    console.log(user, email, phone);
    const { t, i18n } = useTranslation();

    const [step, setStep] = useState((
        authType === SECURITY_VERIFICATION.CHANGE_PHONE
        || authType === SECURITY_VERIFICATION.CHANGE_PASSWORD
        || authType === SECURITY_VERIFICATION.CHANGE_EMAIL
        || authType === SECURITY_VERIFICATION.WITHDRAW_ONCHAIN
    ) ? 3 : 0);
    const [authCodeGoogle, setAuthCodeGoogle] = useState(googleSecretKey || '');
    const [authCodeEmail, setAuthCodeEmail] = useState('');
    const [authCodePhone, setAuthCodePhone] = useState('');
    const [isLoadingEmail, setIsLoadingEmail] = useState(false);
    const [isLoadingPhone, setIsLoadingPhone] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [validateAuthCodeGoogle, setValidateAuthCodeGoogle] = useState('');
    const [isShow, setIsShow] = useState(false);
    const [isCopied, setIsCopied] = useState(false);

    const dispatch = useDispatch();

    useEffect(() => {
        if (authCodeGoogle.length === 0) {
            setAuthCodeGoogle(googleSecretKey);
        }
    }, [googleSecretKey]);

    useEffect(() => {
        setTimeout(setIsShow(isComponentVisible), 200);
        return clearTimeout(setIsShow(isComponentVisible), 200);
    }, [isComponentVisible]);

    const hideInfo = (type, info) => {
        if (type === 'email') {
            if (!info) return '-';
            return info.replace(/(.{2})(.*)(?=@)/,
                (gp1, gp2, gp3) => {
                    for (let i = 0; i < gp3.length; i++) {
                    // eslint-disable-next-line no-param-reassign
                        gp2 += '*';
                    } return gp2;
                });
        }
        if (type === 'phone_number') {
            if (!info) return '-';
            const firstPart = info.substring(0, 3);
            const middlePart = info.substring(3, 7);
            const lastPart = info.slice(7);

            let hiddenPart = '';

            for (let i = 0; i < middlePart.length; i++) {
                hiddenPart += '*';
            }
            return firstPart + hiddenPart + lastPart;
        }
        return null;
    };

    const handleCopy = (data) => {
        try {
            window.navigator.clipboard.writeText(data);
            setIsCopied(true);
        } catch (err) {
            console.log(err);
        }
    };

    const handleClipboard = () => {
        window.navigator.clipboard.readText()
            .then(text => {
                setAuthCodeGoogle(text);
            })
            .catch(err => {
                console.error('Failed to read clipboard contents: ', err);
            });
    };

    const renderErrorNotification = (errorCode) => {
        const error = find(Error, { code: errorCode });
        const description = error
            ? t(`error:${error.message}`)
            : 'COMMON_ERROR';
        return showNotification({ message: `(${errorCode}) ${description}`, title: t('common:failure'), type: 'failure' });
    };

    const handleSendCode = async ({ method }) => {
        if (method?.toLowerCase() === 'email') {
            setIsLoadingEmail(true);
        }
        if (method?.toLowerCase() === 'phone') {
            setIsLoadingPhone(true);
        }
        const result = await dispatch(await getCheckPassCode({ checkpassId: checkPassId, method }));
        if (result) {
            return renderErrorNotification(result);
        }
    };

    const handleSubmit = async () => {
        await setIsVerifying(true);
        let methods = [];
        if (securityMethods && securityMethods.length > 0) {
            securityMethods.forEach(method => {
                if (method?.name.toLowerCase() === 'email') {
                    methods = [...methods, { 'name': 'Email', 'code': authCodeEmail }];
                }
                if (method?.name.toLowerCase() === 'phone') {
                    methods = [...methods, { 'name': 'Phone', 'code': authCodePhone }];
                }
                if (method?.name.toLowerCase() === 'totp') {
                    methods = [...methods, { 'name': 'Totp', 'code': validateAuthCodeGoogle }];
                }
                return null;
            });
        }
        const result = await dispatch(await verifyCheckPassCode({
            checkpassId: checkPassId,
            methods,
        }));
        await setIsVerifying(false);
        if (result) {
            return renderErrorNotification(result);
        }
        await setIsShow(false);
        return confirmSecure(authType);
    };

    const handleClose = () => {
        setIsComponentVisible(false);
    };

    const renderCountDownEmail = useMemo(() => (
        <Countdown
            date={Date.now() + 59000} // countdown 60s
            renderer={({ formatted: { seconds } }) => `(${seconds})`}
            onComplete={() => setIsLoadingEmail(false)}
        />
    ), [isLoadingEmail]);

    const renderCountDownPhone = useMemo(() => {
        return (
            <Countdown
                date={Date.now() + 59000}
                renderer={({ formatted: { seconds } }) => `(${seconds})`}
                onComplete={() => setIsLoadingPhone(false)}
            />
        );
    }, [isLoadingPhone]);

    const renderVerificationStep = () => {
        if (authType === SECURITY_VERIFICATION.CHANGE_PHONE || authType === SECURITY_VERIFICATION.CHANGE_PASSWORD || authType === SECURITY_VERIFICATION.CHANGE_EMAIL || authType === SECURITY_VERIFICATION.WITHDRAW_ONCHAIN) {
            return (
                <div className="mt-[27px]">
                    {
                        securityMethods.map?.(method => {
                            if (method?.name.toLowerCase() === 'email') {
                                return (
                                    <div className="mb-6" key={method?.name}>
                                        <p className="mb-2 text-[12px] text-[#02083D]" style={{ lineHeight: '18px' }}>{t('profile:sending_to_email')} {hideInfo('email', email || user?.email)}</p>
                                        <div className="relative flex flex-row items-center ">
                                            <input
                                                type="text"
                                                className="w-full border border-[#E1E2ED] rounded focus:outline-none py-[10px] pl-4 pr-24 text-[#02083D] text-sm"
                                                onChange={e => setAuthCodeEmail(e.target.value)}
                                                value={authCodeEmail}
                                                placeholder={t('profile:enter_verification_code')}
                                            />
                                            {isLoadingEmail
                                                ? (
                                                    <button type="button" disabled={isLoadingEmail} className="absolute top-2 right-4 cursor-not-allowed mt-[0.5px]">
                                                        <span className="text-[12px] text-[#00C8BC] font-bold">{t('profile:sent_code')} {isLoadingEmail ? renderCountDownEmail : null}
                                                        </span>
                                                    </button>
                                                )
                                                : (
                                                    <button
                                                        type="button"
                                                        disabled={isLoadingEmail}
                                                        className="absolute top-2 right-4 cursor-pointer mt-[0.5px]"
                                                        onClick={() => handleSendCode({ method: method?.name })}
                                                    >
                                                        <span className="text-[12px] text-[#00C8BC] font-bold">{t('profile:send_code')}</span>
                                                    </button>
                                                )}
                                        </div>
                                    </div>
                                );
                            }
                            if (method?.name.toLowerCase() === 'phone') {
                                return (
                                    <div className="mb-6" key={method?.name}>
                                        <p className="mb-2 text-[12px] text-[#02083D]" style={{ lineHeight: '18px' }}>{t('profile:sending_to_phone')} {hideInfo('phone_number', phone || user?.phone)}</p>
                                        <div className="relative flex flex-row items-center ">
                                            <input
                                                type="text"
                                                className="w-full border border-[#E1E2ED] rounded focus:outline-none py-[10px] pl-4 pr-20 text-[#02083D] text-sm truncate"
                                                onChange={e => setAuthCodePhone(e.target.value)}
                                                value={authCodePhone}
                                                placeholder={t('profile:enter_verification_code')}
                                            />
                                            {isLoadingPhone
                                                ? (
                                                    <button type="button" disabled={isLoadingPhone} className="absolute top-2 right-4 cursor-not-allowed mt-[0.5px]">
                                                        <span className="text-[12px] text-[#00C8BC] font-bold">{t('profile:sent_code')} {isLoadingPhone ? renderCountDownPhone : null}
                                                        </span>
                                                    </button>
                                                )
                                                : (
                                                    <button
                                                        type="button"
                                                        disabled={isLoadingPhone}
                                                        className="absolute top-2 right-4 cursor-pointer mt-[0.5px]"
                                                        onClick={() => handleSendCode({ method: method?.name })}
                                                    >
                                                        <span className="text-[12px] text-[#00C8BC] font-bold">{t('profile:send_code')}</span>
                                                    </button>
                                                )}
                                        </div>
                                    </div>
                                );
                            }
                            return (
                                <div className="mb-6" key={method?.name}>
                                    <p className="mb-2 text-[12px] text-[#02083D]" style={{ lineHeight: '18px' }}>{t('profile:google_auth')}</p>
                                    <div className="relative flex flex-row items-center ">
                                        <input
                                            type="text"
                                            className="w-full border border-[#E1E2ED] rounded focus:outline-none py-[10px] pl-4 pr-20 text-[#02083D] text-sm truncate"
                                            onChange={e => setAuthCodeGoogle(e.target.value)}
                                            value={authCodeGoogle}
                                            placeholder={t('profile:enter_verification_code')}
                                        />
                                        <div className="absolute top-2 right-4 cursor-pointer mt-[0.5px]" onClick={handleClipboard}>
                                            <span className="text-[12px] text-[#00C8BC] font-bold">{t('common:paste')}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    }
                    <button
                        type="submit"
                        disabled={isVerifying}
                        onClick={handleSubmit}
                        className={`${isVerifying ? 'cursor-not-allowed' : 'cursor-pointer'} mt-[102px] bg-[rgba(64,33,208,1)] w-full px-[36px] py-[11px] rounded text-white font-bold text-sm flex flex-row items-center justify-center`}
                    >
                        { isVerifying && <IconLoading color="#FFFFFF" />} <span className="ml-2">{t('common:verify')}</span>
                    </button>
                </div>
            );
        }
        if (authType === SECURITY_VERIFICATION.ENABLE_GA_VERIFICATION) {
            return (
                <div className="mt-[27px]">
                    <button
                        type="button"
                        className="inline-flex items-center text-sm text-[#8B8C9B]"
                        onClick={() => setStep(step - 1)}
                    ><span className="mr-3"><IconArrowLeft /></span>{t('common:back')}
                    </button>
                    {
                        securityMethods.map?.(method => {
                            if (method?.name.toLowerCase() === 'totp') {
                                return (
                                    <div className="mb-[102px]" key={method?.name}>
                                        <p className="mb-2 text-[12px] text-[#02083D]" style={{ lineHeight: '18px' }}>{t('profile:google_auth')}</p>
                                        <div className="relative flex flex-row items-center ">
                                            <input
                                                type="text"
                                                className="w-full border border-[#E1E2ED] rounded focus:outline-none py-[10px] pl-4 pr-20 text-[#02083D] text-sm truncate"
                                                onChange={e => setValidateAuthCodeGoogle(e.target.value)}
                                                value={validateAuthCodeGoogle}
                                                placeholder={t('profile:enter_verification_code')}
                                            />
                                            <div className="absolute top-2 right-4 cursor-pointer mt-[0.5px]" onClick={handleClipboard}>
                                                <span className="text-[12px] text-[#00C8BC] font-bold">{t('common:paste')}</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            }
                            if (method?.name.toLowerCase() === 'email') {
                                return (
                                    <div className="mt-10 mb-6" key={method?.name}>
                                        <p className="mb-2 text-[12px] text-[#02083D]" style={{ lineHeight: '18px' }}>{t('profile:sending_to_email')} {hideInfo('email', email || user?.email)}</p>
                                        <div className="relative flex flex-row items-center ">
                                            <input
                                                type="text"
                                                className="w-full border border-[#E1E2ED] rounded focus:outline-none py-[10px] pl-4 pr-24 text-[#02083D] text-sm"
                                                onChange={e => setAuthCodeEmail(e.target.value)}
                                                value={authCodeEmail}
                                                placeholder={t('profile:enter_verification_code')}
                                            />
                                            {isLoadingEmail
                                                ? (
                                                    <button type="button" disabled={isLoadingEmail} className="absolute top-2 right-4 cursor-not-allowed mt-[0.5px]">
                                                        <span className="text-[12px] text-[#00C8BC] font-bold">{t('profile:sent_code')} {isLoadingEmail ? renderCountDownEmail : null}
                                                        </span>
                                                    </button>
                                                )
                                                : (
                                                    <button
                                                        type="button"
                                                        disabled={isLoadingEmail}
                                                        className="absolute top-2 right-4 cursor-pointer mt-[0.5px]"
                                                        onClick={() => handleSendCode({ method: method?.name })}
                                                    >
                                                        <span className="text-[12px] text-[#00C8BC] font-bold">{t('profile:send_code')}</span>
                                                    </button>
                                                )}
                                        </div>
                                    </div>
                                );
                            }
                            if (method?.name.toLowerCase() === 'phone') {
                                return (
                                    <div className="mb-6" key={method?.name}>
                                        <p className="mb-2 text-[12px] text-[#02083D]" style={{ lineHeight: '18px' }}>{t('profile:sending_to_phone')} {hideInfo('phone_number', phone || user?.phone)}</p>
                                        <div className="relative flex flex-row items-center ">
                                            <input
                                                type="text"
                                                className="w-full border border-[#E1E2ED] rounded focus:outline-none py-[10px] pl-4 pr-20 text-[#02083D] text-sm truncate"
                                                onChange={e => setAuthCodePhone(e.target.value)}
                                                value={authCodePhone}
                                                placeholder={t('profile:enter_verification_code')}
                                            />
                                            {isLoadingPhone
                                                ? (
                                                    <button type="button" disabled={isLoadingPhone} className="absolute top-2 right-4 cursor-not-allowed mt-[0.5px]">
                                                        <span className="text-[12px] text-[#00C8BC] font-bold">{t('profile:sent_code')} {isLoadingPhone ? renderCountDownPhone : null}
                                                        </span>
                                                    </button>
                                                )
                                                : (
                                                    <button
                                                        type="button"
                                                        disabled={isLoadingPhone}
                                                        className="absolute top-2 right-4 cursor-pointer mt-[0.5px]"
                                                        onClick={() => handleSendCode({ method: method?.name })}
                                                    >
                                                        <span className="text-[12px] text-[#00C8BC] font-bold">{t('profile:send_code')}</span>
                                                    </button>
                                                )}
                                        </div>
                                    </div>
                                );
                            }
                            return null;
                        })
                    }
                    <a
                        href={`https://attlas.zendesk.com/hc/${i18n.language}`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <button
                            type="button"
                            onClick={() => {}}
                            className="w-full bg-transparent px-[36px] py-[11px] font-bold text-sm text-[#00C8BC]"
                        >{t('profile:reset_google_auth')}
                        </button>
                    </a>
                    <button
                        type="submit"
                        disabled={isVerifying}
                        onClick={handleSubmit}
                        className={`${isVerifying ? 'cursor-not-allowed' : 'cursor-pointer'} bg-[rgba(64,33,208,1)] w-full px-[36px] py-[11px] rounded text-white font-bold text-sm flex flex-row items-center justify-center`}
                    >
                        { isVerifying && <IconLoading color="#FFFFFF" />} <span className="ml-2">{t('common:verify')}</span>
                    </button>
                </div>
            );
        }
        return null;
    };

    const renderStep = () => {
        switch (step) {
            case 0: {
                return (
                    <>
                        <div className="flex flex-row items-center justify-center mt-20 mb-[60px]">
                            <IconSecurityGoogleAuthenticator size={80} />
                        </div>
                        <p className="text-center text-sm text-[#52535C] mb-[182px]">{t('profile:google_auth_landing_title')}</p>
                        <button
                            type="button"
                            onClick={() => setStep(step + 1)}
                            className="w-full rounded bg-[#00C8BC] px-[36px] py-[11px] font-bold text-sm text-white"
                        >{t('profile:google_auth_landing_btn')}
                        </button>
                    </>
                );
            }
            case 1: {
                return (
                    <div className="mt-[27px]">
                        <button
                            type="button"
                            className="inline-flex items-center text-sm text-[#8B8C9B]"
                            onClick={() => setStep(step - 1)}
                        ><span className="mr-3"><IconArrowLeft /></span>{t('common:back')}
                        </button>
                        <p className="mt-4 mb-5 text-lg text-[#020B3D] text-center" style={{ fontWeight: 500 }}>{t('profile:scan_qr_title')}</p>
                        <div className="flex items-center justify-center">
                            {googleSecretKeyQr.length > 0 && <QRCode
                                value={googleSecretKeyQr}
                                size={160}
                                ecLevel="L"
                            />}
                        </div>
                        <div className="flex flex-row items-center justify-between my-6">
                            <hr className="w-full" />
                            <p className="mx-[10px] uppercase text-[#8B8C9B] text-[12px]" style={{ lineHeight: '18px' }}>{t('profile:or')}</p>
                            <hr className="w-full" />
                        </div>
                        <p className="text-sm text-[#52535C] text-center">{t('profile:scan_qr_subtitle')}</p>
                        <div className="relative flex flex-row items-center mt-6 mb-4">
                            <input
                                type="text"
                                className="w-full border border-[#E1E2ED] rounded focus:outline-none py-[10px] pl-4 pr-20 text-[#02083D] text-sm truncate"
                                // onChange={e => setAuthCodeGoogle(e.target.value)}
                                disabled
                                value={authCodeGoogle}
                            />
                            <div className="absolute top-2 right-4 cursor-pointer mt-[0.5px]" onClick={() => handleCopy(authCodeGoogle)}>
                                <span className="text-[12px] text-[#00C8BC] font-bold">{isCopied ? t('common:copied') : t('common:copy')}</span>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => { setStep(step + 1); setIsCopied(false); }}
                            className="w-full rounded bg-[#00C8BC] px-[36px] py-[11px] font-bold text-sm text-white"
                        >{t('common:continue')}
                        </button>
                    </div>
                );
            }
            case 2: {
                return (
                    <div className="mt-[27px]">
                        <button
                            type="button"
                            className="inline-flex items-center text-sm text-[#8B8C9B]"
                            onClick={() => setStep(step - 1)}
                        ><span className="mr-3"><IconArrowLeft /></span>{t('common:back')}
                        </button>
                        <p className="text-sm text-[#52535C] mt-11">{t('profile:recovery_key_title')}</p>
                        <div className="relative flex flex-row items-center mt-6 mb-4">
                            <input
                                type="text"
                                className="w-full border border-[#E1E2ED] rounded focus:outline-none py-[10px] pl-4 pr-20 text-[#02083D] text-sm truncate"
                                value={authCodeGoogle}
                                disabled
                            />
                            <div className="absolute top-2 right-4 cursor-pointer mt-[0.5px]" onClick={() => handleCopy(authCodeGoogle)}>
                                <span className="text-[12px] text-[#00C8BC] font-bold">{isCopied ? t('common:copied') : t('common:copy')}</span>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => { setStep(step + 1); setIsCopied(false); }}
                            className="w-full rounded bg-[#00C8BC] mt-[226px] px-[36px] py-[11px] font-bold text-sm text-white"
                        >{t('common:continue')}
                        </button>
                    </div>
                );
            }
            case 3: {
                return (
                    <div className="mt-[27px]">
                        {renderVerificationStep()}
                    </div>
                );
            }
            default: {
                return null;
            }
        }
    };

    const renderTitle = () => {
        if (authType === SECURITY_VERIFICATION.CHANGE_PHONE) {
            return t('profile:confirm_change_phone_title');
        }
        if (authType === SECURITY_VERIFICATION.CHANGE_PASSWORD) {
            return t('profile:confirm_change_password_title');
        }
        if (authType === SECURITY_VERIFICATION.CHANGE_EMAIL) {
            return t('profile:confirm_change_email_title');
        }
        if (authType === SECURITY_VERIFICATION.WITHDRAW_ONCHAIN) {
            return t('wallet:withdraw_onchain');
        }
        return t('profile:confirm_google_auth_title');
    };

    return (
        <Transition
            show={isShow}
            as="div"
            enter="transform transition duration-[400ms]"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="transform duration-400 transition ease-in-out"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-90"
        >
            <div className="relative bg-white w-[400px] px-5 pt-6 pb-10 rounded-[12px] box-border border border-[#EEF2FA]" style={{ boxShadow: '0px 16px 24px rgba(7, 12, 61, 0.04)' }}>
                <p className="text-xl font-bold">{renderTitle()}</p>
                <div className="absolute top-[32.33px] right-[24.33px] cursor-pointer" onClick={handleClose}>
                    <IconClose />
                </div>
                {renderStep()}
            </div>
        </Transition>
    );
};

export default GoogleAuthModalWrapper;
