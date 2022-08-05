import { useRef, useState } from 'react';
import classNames from 'classnames';
import NumberFormat from 'react-number-format';

const INITIAL_STATE = {
    isFocus: false,
}

const TradingInput = ({
    containerClassName,
    label,
    labelClassName,
    inputClassName,
    renderTail = null,
    tailContainerClassName,
    validator = {},
    onusMode = false,
    ...inputProps
}) => {
    // ? Input state management
    const [state, set] = useState(INITIAL_STATE)
    const setState = (state) => set((prevState) => ({ ...prevState, ...state }))

    // ? Helper
    const inputRef = useRef()

    const focusInput = () => inputRef?.current?.focus()
    const onFocus = () => setState({ isFocus: true })
    const onInputBlur = () => setState({ isFocus: false })
    const isError = (isNaN(inputProps?.value) ? inputProps?.value : inputProps?.value && inputProps?.value >= 0) && Object.keys(validator)?.length && !validator?.isValid;
    return (
        <div
            className={classNames(
            `relative flex items-center px-[12px] py-2.5 rounded-md  border border-transparent ${onusMode ? 'hover:border-onus-green bg-onus-input': 'hover:border-base bg-gray-5 dark:bg-darkBlue-3'}`,
                { 'border-dominant': !onusMode && state.isFocus },
                { 'border-onus-green': onusMode && state.isFocus },
                { '!border-red': !onusMode && isError },
                { '!border-onus-red': onusMode && isError },
                containerClassName
            )}
        >
            {/* Label */}
            <div
                onClick={focusInput}
                className={classNames(
                    'text-txtSecondary dark:text-txtSecondary-dark font-medium text-xs cursor-default whitespace-nowrap',
                    labelClassName
                )}
            >
                {label || 'Label?'}
            </div>

            {(isError && state?.isFocus) ? (
                <div className='absolute right-0 -top-1 -translate-y-full z-50 flex flex-col items-center'>
                    <div className='px-2 py-1.5 rounded-md bg-gray-3 dark:bg-darkBlue-4 text-xs'>
                        {validator?.msg}
                    </div>
                    <div
                        className='w-[8px] h-[6px] bg-gray-3 dark:bg-darkBlue-4'
                        style={{
                            clipPath: 'polygon(50% 100%, 0 0, 100% 0)',
                        }}
                    />
                </div>
            ) : null}

            {/* Input  */}
            <NumberFormat
                thousandSeparator
                getInputRef={(ref) => (inputRef.current = ref)}
                type='text'
                className={classNames(
                    'ml-2 flex-grow text-sm font-medium text-right',
                    { 'mr-2': !!renderTail },
                    inputClassName
                )}
                onFocus={onFocus}
                onBlur={onInputBlur}
                {...inputProps}
            />

            {/* Tail */}
            <div className={classNames('', tailContainerClassName)}>
                {renderTail && renderTail()}
            </div>
        </div>
    )
}

export default TradingInput
