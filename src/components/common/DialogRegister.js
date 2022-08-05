import { Fragment, useRef, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XCircle } from 'react-feather';
import { DOWNLOAD_APP_LINK } from 'src/redux/actions/const';
import { useTranslation } from 'next-i18next';
import { iconColor } from 'src/config/colors';
import { getS3Url } from 'redux/actions/utils';

const DialogRegister = (props, ref) => {
    const { t } = useTranslation();
    const cancelButtonRef = useRef();
    const [open, setOpen] = useState(true);
    const closeModal = () => {
        setOpen(false);
    };
    const openModal = () => {
        setOpen(true);
    };

    return (
        <Transition show={open} as={Fragment}>
            <Dialog
                as="div"
                className="fixed inset-0 z-10 overflow-y-auto"
                initialFocus={cancelButtonRef}
                static
                open={open}
                onClose={closeModal}
            >
                <div className="min-h-screen px-4 text-center">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Dialog.Overlay className="fixed inset-0 bg-black-800 bg-opacity-70" />
                    </Transition.Child>

                    {/* This element is to trick the browser into centering the modal contents. */}
                    <span
                        className="inline-block h-screen align-middle"
                        aria-hidden="true"
                    >
                        &#8203;
                    </span>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <div
                            className="inline-block w-full py-6 my-8 overflow-hidden text-left align-middle transition-all transform  shadow-xl "
                        >
                            <Dialog.Title className="">
                                <div className="flex justify-between items-center">
                                    <div
                                        className="text-xl font-medium leading-8 text-black-800"
                                    />
                                    <button className="btn btn-icon" type="button" onClick={closeModal}>
                                        <XCircle color={iconColor} size={24} />
                                    </button>
                                </div>
                            </Dialog.Title>
                            <div className="text-sm rounded-2xl bg-white">
                                <div className="bg-black-5 rounded-t-2xl py-4">
                                    <img src={getS3Url("/images/bg/dialog-register-header.svg")} alt="" className="mx-auto" />
                                </div>
                                <div className="px-6 py-8 text-center !font-bold">
                                    <div className="text-xl">Vui lòng tải ứng dụng</div>
                                    <div className="text-xl text-teal mb-[30px]">Nami Exchange</div>
                                    <div className="">
                                        <a href={DOWNLOAD_APP_LINK.IOS} target="_blank" className="btn btn-black w-full mb-2" type="button" rel="noreferrer">
                                            Tải qua Appstore
                                        </a>
                                        <a href={DOWNLOAD_APP_LINK.ANDROID} target="_blank" className="btn btn-primary w-full" type="button" rel="noreferrer">
                                            Tải qua Google Play
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    );
};

export default DialogRegister;
