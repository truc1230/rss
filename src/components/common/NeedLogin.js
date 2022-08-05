import { useMemo } from 'react';
import { useTranslation } from 'next-i18next';
import { LANGUAGE_TAG } from 'hooks/useLanguage';
import { getLoginUrl } from 'redux/actions/utils';
import { UserDeleteOutlined } from '@ant-design/icons';

const NeedLogin = ({ message, addClass }) => {
    const { i18n: { language } } = useTranslation()

    const _message = useMemo(() => {
        if (!message) {
            if (language === LANGUAGE_TAG.EN) {
                return 'Login Now'
            } else {
                return 'Đăng nhập ngay'
            }
        }
        return message
    }, [message, language]);


    return (
        <div className={addClass ? 'relative w-full h-full ' + addClass : 'relative w-full h-full '}>
            <div className="flex flex-col items-center justify-center text-txtSecondary dark:text-txtSecondary-dark">
                {/*<Key size={50} color={colors.teal}/>*/}
                <UserDeleteOutlined style={{ fontSize: 58 }}/>
                <a href={getLoginUrl('sso', 'login')} className="mt-4 rounded-md bg-dominant text-white text-sm px-4 py-2">
                    {_message}
                </a>
            </div>
        </div>
    )
}

export default NeedLogin
