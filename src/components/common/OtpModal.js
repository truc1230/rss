import useWindowSize from 'hooks/useWindowSize'
import classNames from 'classnames'
import OtpInput from 'react-otp-input'
import Modal from './ReModal'

import { BREAK_POINTS } from 'constants/constants'

const OtpModal = ({
    isVisible,
    label,
    value,
    onChange,
    placeholder = '',
    numberOnly = true,
    otpLength = 6,
    renderUpper,
    renderLower,
    className,
}) => {
    const { width } = useWindowSize()

    return (
        <Modal
            isVisible={isVisible}
            containerClassName={classNames(
                'p-[32px] !translate-y-0 sm:min-w-[0px] rounded-[12px]',
                className
            )}
        >
            <div className={classNames({ 'mb-[32px]': !!renderUpper })}>
                {typeof renderUpper === 'function'
                    ? renderUpper()
                    : renderUpper}
            </div>
            {label && <div className='font-medium text-sm max-w-lg'>{label}</div>}
            <OtpInput
                value={value}
                onChange={(otp) => onChange(otp)}
                numInputs={otpLength}
                placeholder={placeholder.repeat(otpLength)}
                isInputNum={numberOnly}
                containerStyle='mt-4 w-full justify-between'
                inputStyle='!w-[40px] !h-[40px] sm:!w-[58.3px] mr-1.5 sm:mr-2 sm:!h-[58.3px] font-bold text-lg sm:text-2xl border border-divider dark:border-divider-dark rounded-[10px] sm:rounded-[13.72px] selection:bg-transparent focus:!border-dominant placeholder:font-medium placeholder:text-txtSecondary dark:placeholder:text-txtSecondary-dark'
            />
            <div className={classNames({ 'mt-4': !!renderLower })}>
                {typeof renderLower === 'function'
                    ? renderLower()
                    : renderLower}
            </div>
        </Modal>
    )
}

export default OtpModal
