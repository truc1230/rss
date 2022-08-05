import React, { useRef, useState } from 'react';
import Modal from 'components/common/ReModal';
import Button from 'components/common/Button';
import { useTranslation } from 'next-i18next';
import { API_CLOSE_ALL_ORDER } from 'redux/actions/apis';
import fetchApi from 'utils/fetch-api';
import { ApiStatus } from 'redux/actions/const';

const CloseAllOrders = () => {
    const { t } = useTranslation()
    const [showModalDelete, setShowModalDelete] = useState(false);
    const type = useRef(null);

    const onDeleteMode = (mode) => {
        type.current = mode;
        setShowModalDelete(true);
    }

    const onConfirm = async () => {
        try {
            const { status, data, message } = await fetchApi({
                url: API_CLOSE_ALL_ORDER,
                options: { method: 'POST' },
                params: {
                    type: type.current
                },
            })
            if (status === ApiStatus.SUCCESS) {
                showNotification(
                    {
                        message: t('futures:close_all:close_all_success'),
                        title: t('commom:success'),
                        type: 'success'
                    },
                    1800,
                    'bottom',
                    'bottom-right'
                )
            } else {
                showNotification(
                    {
                        message: message,
                        title: t('commom:failed'),
                        type: 'failure'
                    },
                    1800,
                    'bottom',
                    'bottom-right'
                )
            }
        } catch (e) {
            console.log(e)
        } finally {
            setShowModalDelete(false);
        }
    }

    const getMessage = () => {
        switch (type.current) {
            case 'ALL':
                return t('futures:close_all:close_all_modal')
            case 'PROFIT':
                return t('futures:close_all:close_profit_modal')
            case 'LOSS':
                return t('futures:close_all:close_loss_modal')
            case 'PENDING':
                return t('futures:close_all:close_pending_modal')
            case 'ACTIVE':
                return t('futures:close_all:close_active_modal')
            default:
                return t('futures:close_all:close_all_modal')
        }
    }

    return (
        <>
            <Modal
                isVisible={showModalDelete}
                onBackdropCb={() => setShowModalDelete(false)}
            >
                <div className="w-[390px]">
                    <div className="text-center text-xl font-bold capitalize">
                        {t('futures:close_all:close_all_title')}
                    </div>
                    <div className="mt-3 text-center text-lg">
                        {getMessage()}
                    </div>
                    <div className="mt-4 w-full flex flex-row items-center justify-center">
                        <Button
                            title={t('common:cancel')} type="default"
                            componentType="button"
                            style={{ width: '48%' }}
                            className="mr-[10px]"
                            onClick={() => setShowModalDelete(false)} />
                        <Button
                            title={t('common:confirm')} type="primary"
                            componentType="button"
                            style={{ width: '48%' }}
                            onClick={onConfirm} />
                    </div>
                </div>
            </Modal>
            {/*<Popover className="relative float-right h-[max-content]">*/}
            {/*    {({ open, close }) => (*/}
            {/*        <>*/}
            {/*            <Popover.Button >*/}
            {/*                <div className="px-[8px] capitalize flex items-center py-[1px] mr-2 text-xs font-medium cursor-pointer hover:opacity-80 rounded-md">*/}
            {/*                    {t('futures:close_all:close_all_title')}*/}
            {/*                    <ChevronDown size={16} className="ml-1" />*/}
            {/*                </div>*/}
            {/*            </Popover.Button>*/}
            {/*            <Transition*/}
            {/*                as={Fragment}*/}
            {/*                enter="transition ease-out duration-200"*/}
            {/*                enterFrom="opacity-0 translate-y-1"*/}
            {/*                enterTo="opacity-100 translate-y-0"*/}
            {/*                leave="transition ease-in duration-150"*/}
            {/*                leaveFrom="opacity-100 translate-y-0"*/}
            {/*                leaveTo="opacity-0 translate-y-1"*/}
            {/*            >*/}
            {/*                <Popover.Panel className="absolute left-0 z-50 bg-white">*/}
            {/*                    <div className="min-w-[134px] pl-[12px] py-[8px] shadow-onlyLight font-medium text-xs flex flex-col">*/}
            {/*                        <span onClick={() => onDeleteMode('ALL')} className={`text-darkBlue py-[1px] my-[2px] hover:text-teal cursor-pointer`}>{t('futures:close_all:close_all')}</span>*/}
            {/*                        <span onClick={() => onDeleteMode('PROFIT')} className={`text-darkBlue py-[1px] my-[2px] hover:text-teal cursor-pointer`}>{t('futures:close_all:close_profit')}</span>*/}
            {/*                        <span onClick={() => onDeleteMode('LOSS')} className={`text-darkBlue py-[1px] my-[2px] hover:text-teal cursor-pointer`}>{t('futures:close_all:close_loss')}</span>*/}
            {/*                        <span onClick={() => onDeleteMode('PENDING')} className={`text-darkBlue py-[1px] my-[2px] hover:text-teal cursor-pointer`}>{t('futures:close_all:close_pending')}</span>*/}
            {/*                        <span onClick={() => onDeleteMode('ACTIVE')} className={`text-darkBlue py-[1px] my-[2px] hover:text-teal cursor-pointer`}>{t('futures:close_all:close_active')}</span>*/}
            {/*                    </div>*/}
            {/*                </Popover.Panel>*/}
            {/*            </Transition>*/}
            {/*        </>*/}
            {/*    )}*/}
            {/*</Popover>*/}
        </>
    );
};

export default CloseAllOrders;
