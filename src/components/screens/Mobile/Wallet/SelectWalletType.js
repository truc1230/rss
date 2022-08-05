import React, { Fragment } from 'react';
import { Popover, Transition } from '@headlessui/react';
import { Check, ChevronDown } from 'react-feather';
import classNames from 'classnames';

export default function SelectWalletType({options = [], value, onChange}) {
    const selected = options.find((o) => o.value === value)
    return (
        <Popover className='relative'>
            {({open, close}) => (
                <>
                    <Popover.Button className='flex items-center justify-between border-b border-teal pb-4 w-full'>
                        <span className='text-sm font-semibold'>
                            {selected ? selected.label : '--'}
                        </span>
                        <ChevronDown
                            size={16}
                            className={classNames(
                                'text-txtSecondary dark:text-txtSecondary-dark transition-transform',
                                {
                                    'rotate-180': open,
                                }
                            )}
                        />
                    </Popover.Button>
                    <Transition
                        as={Fragment}
                        show={open}
                        enter='transition ease-out duration-200'
                        enterFrom='opacity-0 translate-y-1'
                        enterTo='opacity-100 translate-y-0'
                        leave='transition ease-in duration-150'
                        leaveFrom='opacity-100 translate-y-0'
                        leaveTo='opacity-0 translate-y-1'
                    >
                        <Popover.Panel className='absolute left-0 right-0 z-30 mt-3'>
                            <div className='overflow-hidden rounded-lg shadow-lg bg-gray-4 dark:bg-darkBlue-3'>
                                {options.map((op) => {
                                    return (
                                        <div
                                            key={op.value}
                                            className={classNames('flex justify-between items-center px-4 py-2 font-medium text-sm hover:bg-teal-opacity dark:hover:bg-darkBlue-4', {
                                                'cursor-not-allowed opacity-50': op.disabled
                                            })}
                                            onClick={() => {
                                                if (onChange && !op.disabled) {
                                                    onChange(op.value)
                                                }
                                                close()
                                            }}
                                        >
                                            <span>{op.label}</span>
                                            {selected?.value === op.value && (
                                                <Check
                                                    size={14}
                                                    className='dark:text-dominant'
                                                />
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        </Popover.Panel>
                    </Transition>
                </>
            )}
        </Popover>
    )
}
