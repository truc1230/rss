import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { IconShowPassword } from '../Icons';

const InputPassword = ({ id, name, onChange, value, initValue }) => {
    const [isHide, setIsHide] = useState(true);
    const { t } = useTranslation();
    return (
        <div className="relative flex flex-row">
            <input
                id={id}
                name={name}
                type={isHide ? 'password' : 'text'}
                className="border border-[#E1E2ED] rounded focus:outline-none py-[10px] pl-4 pr-14 text-sm text-[#02083D] w-full"
                placeholder={t('profile:set_password_placeholder')}
                onChange={onChange}
                value={value}
            />
            <div className="absolute top-3 right-4 cursor-pointer" onClick={() => setIsHide(!isHide)}>
                <IconShowPassword />
            </div>
        </div>
    );
};

export default InputPassword;
