import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { getS3Url } from 'redux/actions/utils';
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';

const TableNoData = ({ bgColor, width, className = '', title, isMobile }) => {
    const [currentTheme] = useDarkMode()
    const { t } = useTranslation();
    const isDark = currentTheme === THEME_MODE.DARK;
    return (
        <div className={`flex items-center justify-center flex-col md:py-[3rem] ${bgColor && bgColor} ${width && width} ${className}`}>
            <Image src={getS3Url(`/images/icon/icon-search-folder${isDark ? '_dark' : ''}.png`)} width={isMobile ? 130 : 80} height={isMobile ? 130 : 80} />
            <div className="text-xs text-black-400 mt-2">{title ?? t('common:no_data')}</div>
        </div>
    );
};

export default TableNoData;
