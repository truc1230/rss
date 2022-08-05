import React, { Fragment, useMemo, useState } from 'react';
import classNames from 'classnames';
import { Popover, Transition } from '@headlessui/react';
import { ChevronDown } from 'react-feather';
import { useTranslation } from 'next-i18next';

export const FilterTradeOrder = ({ label = '', options = [], value = '', onChange, allowSearch }) => {
    const currentOption = useMemo(() => options.find(o => o.value === value), [value])
    const [strSearch, setStrSearch] = useState('');
    const { t } = useTranslation();

    const Option = ({ value: optionValue, label: optionLabel, disabled, close }) => {
        return <span
            className={
                classNames(`text-txtSecondary dark:text-txtSecondary-dark py-[1px] my-[2px] hover:text-teal cursor-pointer`, {
                    '!text-txtPrimary !dark:text-txtPrimary-dark': optionValue === value,
                    '!pointer-events-none': disabled
                })
            }
            onClick={() => {
                if (optionValue === value) {
                    onChange('')
                } else {
                    onChange(optionValue)
                }
                close()
            }}
        >{optionLabel || optionValue}</span>
    }


    const dataFilter = useMemo(() => {
        return strSearch ? options.filter(item => (item.value.toLowerCase() + ' ' + item.label).indexOf(strSearch.toLowerCase()) !== -1) : options;
    }, [options, strSearch])


    return <Popover className="relative">
        {({ open, close }) => (
            <>
                <Popover.Button >
                    <div onClick={() => setStrSearch('')}
                        className="px-[8px] flex items-center py-[1px] mr-2 text-xs font-medium cursor-pointer hover:opacity-80 rounded-md text-txtSecondary dark:text-txtSecondary-dark">
                        {currentOption?.label || currentOption?.value || label}
                        <ChevronDown size={16} className="ml-1" />
                    </div>
                </Popover.Button>
                <Transition
                    as={Fragment}
                    enter="transition ease-out duration-200"
                    enterFrom="opacity-0 translate-y-1"
                    enterTo="opacity-100 translate-y-0"
                    leave="transition ease-in duration-150"
                    leaveFrom="opacity-100 translate-y-0"
                    leaveTo="opacity-0 translate-y-1"
                >
                    <Popover.Panel className="absolute z-50 bg-white dark:bg-bgPrimary-dark">
                        <div
                            className="max-h-[204px] overflow-y-auto px-[12px] py-[8px] shadow-onlyLight font-medium text-xs flex flex-col">
                            {allowSearch &&
                                <div className="relative flex items-center py-1 rounded-md bg-gray-5 dark:bg-darkBlue-3 border border-transparent hover:border-dominant mt-[12px]">
                                    <input
                                        onChange={e => setStrSearch(e.target.value)}
                                        className="px-[10px] flex-grow text-sm w-full font-medium text-left "
                                        placeholder={t('common:search')}
                                    />
                                </div>
                            }
                            {dataFilter.map(option => {
                                return <Option key={option.value} value={option.value} label={option.label} close={close} />
                            })}
                        </div>
                    </Popover.Panel>
                </Transition>
            </>
        )}
    </Popover>
}
