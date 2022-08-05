import classNames from 'classnames';
import Setting from 'components/svg/Setting';
import useDarkMode from 'hooks/useDarkMode';
import colors from 'styles/colors';

const GridLayoutSettings = ({ className }) => {
    const [currentTheme, onThemeSwitch] = useDarkMode()

    return (
        <div className={classNames('ml-4 relative group', className)}>
            <Setting
                size={20}
                color={currentTheme === 'dark' ? colors.white : colors.darkBlue}
            />
            <div className='pt-7 absolute right-0 top-full '>
                <div className='bg-red'>AAAAA</div>
            </div>
        </div>
    )
}

export default GridLayoutSettings
