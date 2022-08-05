import { Listbox, Transition } from '@headlessui/react';
import { Fragment, useEffect, useState } from 'react';
import { IconArrowDown } from '../Icons';

const Select = ({ options = [], onChange, loading, error }) => {
    const [selectedValue, setSelectedValue] = useState();
    const handleChangeValue = (value) => {
        setSelectedValue(value);
        onChange(value);
    };
    useEffect(() => {
        setSelectedValue(options?.[0]);
        onChange(options?.[0]);
    }, [loading]);
    return (
        <Listbox value={selectedValue} onChange={handleChangeValue} disabled={loading}>
            {({ open }) => (
                <>
                    <div className="relative mt-1">
                        <Listbox.Button
                            className={`relative w-full form-control form-control-lg border text-left !flex items-center justify-between ${error && 'border !border-red'}`}
                        >
                            <span className="block truncate">{selectedValue?.label}</span>
                            <span
                                className="flex items-center pl-2 pointer-events-none"
                            >
                                <IconArrowDown />
                            </span>
                        </Listbox.Button>
                        <Transition
                            show={open}
                            as={Fragment}
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <Listbox.Options
                                static
                                className="absolute w-full mt-1 overflow-auto text-base bg-white rounded shadow-xl max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-10"
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
                                                <span
                                                    className={`${selected ? 'font-semibold' : 'font-normal'} block truncate`}
                                                >
                                                    {option.label}
                                                </span>
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
export default Select;
