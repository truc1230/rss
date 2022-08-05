import { useTranslation } from 'next-i18next';
import Portal from 'components/hoc/Portal';
import classNames from 'classnames';
import Market from 'components/screens/Mobile/Market/Market';
import React, { Fragment, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { Transition } from '@headlessui/react';

function useOutsideAlerter(ref, cb) {
    useEffect(() => {
        /**
         * Alert if clicked on outside of element
         */
        function handleClickOutside(event, cb) {
            if (ref.current && !ref.current.contains(event.target)) {
                cb()
            }
        }
        // Bind the event listener
        document.addEventListener("mousedown", (event) => handleClickOutside(event, cb));
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref, cb]);
}


const ModelMarketMobile = ({ visible, onClose, pair, pairConfig }) => {
    const router = useRouter()
    const { t } = useTranslation(['common'])
    const wrapperRef = useRef(null);

    const handleOutside = () => {

        if (visible && onClose) {
            onClose()
        }
    }
    useOutsideAlerter(wrapperRef, handleOutside.bind(this));

    useEffect(() => {
        onClose()
    }, [router])



    return (
        <Portal portalId='PORTAL_MODAL'>
            <Transition
                key={`Transition_mobile_market}`}
                show={visible}
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 -translate-x-full"
                enterTo="opacity-100 translate-x-0"
                leave="transition ease-in duration-200"
                leaveFrom="opacity-100 translate-x-0"
                leaveTo="opacity-0 -translate-x-full"
            >
                <div
                    className={classNames(
                        'flex flex-col absolute top-0 left-0 h-full w-full z-[20] bg-onus-bgModal2/[0.7]',
                    )}
                >
                    <div ref={wrapperRef} className='flex-1 w-[calc(100%-48px)] min-h-0  '>
                        <Market pairConfig={pairConfig} isRealtime={true} pair={pair} />
                    </div>


                </div>
            </Transition>

        </Portal>
    )
}

export default ModelMarketMobile
