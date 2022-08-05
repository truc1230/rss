import { memo } from 'react';
import Switcher from 'components/common/Switcher';
import classNames from 'classnames';

const ToggleItem = memo(({ label, active, onChange, className }) => {
    return (
        <div
            className={classNames(
                'flex items-center justify-between',
                className
            )}
        >
            <div className='font-medium text-sm'>{label}</div>
            <Switcher active={active} onChange={onChange} />
        </div>
    )
})

export default ToggleItem
