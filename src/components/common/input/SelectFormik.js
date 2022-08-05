import { Listbox, Transition } from '@headlessui/react';
import Image from 'next/image';
import { Fragment, useEffect, useMemo, useState } from 'react';
import { getS3Url } from 'src/redux/actions/utils';
import { IconArrowDown } from '../Icons';

const SelectFormik = ({ options = [], loading, onChange, initValue, type }) => {
    const [selectedValue, setSelectedValue] = useState();
    const handleChangeValue = (value) => {
        setSelectedValue(value);
        onChange(value);
    };

    useEffect(() => {
        if (initValue) {
            setSelectedValue(initValue);
        } else {
            const value = options?.[0];
            setSelectedValue(value);
        }
    }, [initValue, loading]);

    const isCountrySelect = useMemo(() => {
        return type === 'country';
    }, [type]);

    const isPhoneCountrySelect = useMemo(() => {
        return type === 'phone_country';
    }, [type]);

    return (
        <Listbox value={selectedValue} onChange={handleChangeValue} disabled={loading}>
            {({ open }) => (
                <>
                    <div className={(isCountrySelect || isPhoneCountrySelect) ? 'relative' : 'relative mt-1'}>

                        {
                            (isCountrySelect || isPhoneCountrySelect) ? (
                                <Listbox.Button className={`relative !flex flex-row items-center justify-between w-full min-w-max h-full py-2 px-3 text-left bg-white ${isPhoneCountrySelect ? 'rounded-tl-md rounded-bl-md border-r' : 'form-control form-control-lg border rounded'} cursor-pointer border-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-orange-300 focus-visible:ring-offset-2 focus-visible:border-indigo-500 sm:text-sm`}>
                                    <div className="flex items-center">
                                        <Image src={getS3Url(selectedValue?.flag)} width={27} height={18} />
                                        <span className={`block truncate ${isPhoneCountrySelect ? 'uppercase' : ''} ml-2`}>{isPhoneCountrySelect ? selectedValue?.code : selectedValue?.name}</span>
                                    </div>
                                    <span
                                        className="flex items-center pl-2 pointer-events-none"
                                    >
                                        <IconArrowDown />
                                    </span>
                                </Listbox.Button>
                            ) : (
                                <Listbox.Button
                                    className="relative w-full form-control form-control-lg border text-left !flex items-center justify-between"
                                >
                                    <span className="block truncate">{selectedValue?.label || selectedValue?.name}</span>
                                    <span
                                        className="flex items-center pl-2 pointer-events-none"
                                    >
                                        <IconArrowDown />
                                    </span>
                                </Listbox.Button>
                            )
                        }
                        <Transition
                            show={open}
                            as={Fragment}
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <Listbox.Options
                                static
                                className={`absolute ${isPhoneCountrySelect ? 'w-[300px]' : 'w-full'} mt-1 overflow-auto text-base bg-white rounded shadow-xl max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-10`}
                            >
                                {options.map((option, index) => (
                                    <Listbox.Option
                                        key={index}
                                        className={({ active }) => `${active ? 'text-white bg-teal-700' : ''} cursor-pointer select-none relative px-4 py-3 rounded-lg`}
                                        value={option}
                                    >
                                        {({
                                            selected,
                                            active,
                                        }) => (
                                            <>
                                                {
                                                    (isCountrySelect || isPhoneCountrySelect) ? (
                                                        <div className="flex items-center">
                                                            <Image src={getS3Url(option?.flag)} width={27} height={18} />
                                                            <span className="block truncate ml-2">{option?.label}</span>
                                                        </div>
                                                    ) : (
                                                        <span
                                                            className={`${selected ? 'font-semibold' : 'font-normal'} block truncate`}
                                                        >
                                                            {(isCountrySelect || isPhoneCountrySelect) && <Image src={getS3Url(option?.flag)} width={27} height={18} />} {option.label}
                                                        </span>
                                                    )
                                                }
                                                {selected ? (<span
                                                    className={`${active ? 'text-teal-600' : 'text-white'} absolute inset-y-0 left-0 flex items-center pl-3`}
                                                />) : null}
                                            </>
                                        )}
                                    </Listbox.Option>
                                ))}
                            </Listbox.Options>
                        </Transition>
                    </div>
                </>
            )}
        </Listbox>
    );
};
export default SelectFormik;
