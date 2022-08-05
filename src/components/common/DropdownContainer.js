import React from 'react';
import { createPopper } from '@popperjs/core';

const DropdownContainer = ({ children, toggleButton }) => {
    // dropdown props
    const [dropdownPopoverShow, setDropdownPopoverShow] = React.useState(false);
    const btnDropdownRef = React.createRef();
    const popoverDropdownRef = React.createRef();
    const openDropdownPopover = () => {
        createPopper(btnDropdownRef.current, popoverDropdownRef.current, {
            placement: 'bottom-start',
        });
        setDropdownPopoverShow(true);
    };
    const closeDropdownPopover = () => {
        setDropdownPopoverShow(false);
    };
    // bg colors
    const bgColor = 'bg-blueGray-700';
    return (
        <>
            <div className="flex flex-wrap">
                <div className="w-full sm:w-6/12 md:w-4/12 px-4">
                    <div className="relative inline-flex align-middle w-full">
                        <button
                            className={
                                'text-white font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-xl outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 ' +
                                bgColor
                            }
                            type="button"
                            ref={btnDropdownRef}
                            onClick={() => {
                                // eslint-disable-next-line no-unused-expressions
                                dropdownPopoverShow
                                    ? closeDropdownPopover()
                                    : openDropdownPopover();
                            }}
                        >
                            Dropdown
                        </button>
                        <div
                            ref={popoverDropdownRef}
                            className={
                                (dropdownPopoverShow ? 'block ' : 'hidden ') +
                                'white' +
                                'text-base z-50 float-left py-2 list-none text-left rounded shadow-xl mt-1'
                            }
                            style={{ minWidth: '12rem' }}
                        >
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default DropdownContainer;
