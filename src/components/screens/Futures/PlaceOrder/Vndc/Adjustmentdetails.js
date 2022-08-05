import React, { memo, useEffect, useMemo, useState } from 'react';
import Modal from 'components/common/ReModal';
import { API_ORDER_DETAIL } from 'redux/actions/apis';
import fetchApi from 'utils/fetch-api';
import { ApiStatus } from 'redux/actions/const';
import { ArrowRight, X } from 'react-feather';
import { formatNumber, formatTime } from 'redux/actions/utils';
import Skeletor from 'src/components/common/Skeletor';
import TableNoData from 'components/common/table.old/TableNoData';
import { useTranslation } from 'next-i18next';

const Adjustmentdetails = memo(({ onClose, rowData, isMobile }) => {
    const { t } = useTranslation();
    const [dataSource, setDataSource] = useState([])
    const [loading, setLoading] = useState(false);

    useEffect(async () => {
        setLoading(true)
        try {
            const { status, data, message } = await fetchApi({
                url: API_ORDER_DETAIL,
                options: { method: 'GET' },
                params: {
                    orderId: rowData.displaying_id
                },
            })
            if (status === ApiStatus.SUCCESS) {
                setDataSource(data?.futuresorderlogs ?? [])
            }
        } catch (e) {
            console.log(e)
        } finally {
            setLoading(false)
        }
    }, [])


    const getValue = (number) => {
        return formatNumber(number, 0, 0, true) + ' VNDC';
    }

    const renderModify = (metadata, key) => {
        let value = null;
        switch (key) {
            case 'price':
                value = metadata?.modify_price ?
                    <div className="flex items-center py-[4px]">
                        {getValue(metadata?.modify_price?.before)}
                        &nbsp;<ArrowRight size={14} />&nbsp;
                        {getValue(metadata?.modify_price?.after)} </div> : getValue(metadata?.price)
                return value;
            case 'take_profit':
                value = metadata?.modify_tp ?
                    <div className="flex items-center py-[4px]">
                        {getValue(metadata?.modify_tp?.before)}
                        &nbsp;<ArrowRight size={14} />&nbsp;
                        {getValue(metadata?.modify_tp?.after)} </div> : null
                return value;
            case 'stop_loss':
                value = metadata?.modify_sl ?
                    <div className="flex items-center py-[4px]">
                        {getValue(metadata?.modify_sl?.before)}
                        &nbsp;<ArrowRight size={14} />&nbsp;
                        {getValue(metadata?.modify_sl?.after)} </div> : null
                return value;

            default:
                return value;
        }
    }

    const classMobile = useMemo(() => {
        return window.innerWidth < 330 ? 'w-[300px]' : 'w-[340px]';
    }, [])

    return (
        <Modal
            isVisible={true}
            onBackdropCb={() => onClose()}
            containerClassName={`top-[50%] ${isMobile ? classMobile : 'w-[390px]'}`}
        >
            <div>
                <div className="flex items-center justify-between font-bold capitalize">
                    {t('futures:order_history:adjustment_detail')}
                    <X
                        size={20}
                        strokeWidth={1}
                        className='cursor-pointer'
                        onClick={onClose}
                    />
                </div>

                <div className="mt-3 text-center text-lg">
                    {loading ? <>
                        <div className="flex items-center justify-between ">
                            <label className="text-gray-1"><Skeletor width={100} /></label>
                            <div className="font-medium flex items-center justify-between"><Skeletor width={50} className="mr-[20px]" />  <Skeletor width={50} /></div>
                        </div>
                        <div className="flex items-center justify-between ">
                            <label className="text-gray-1"><Skeletor width={100} /></label>
                            <div className="font-medium flex items-center justify-between"><Skeletor width={50} className="mr-[20px]" />  <Skeletor width={50} /></div>
                        </div>
                        <div className="flex items-center justify-between ">
                            <label className="text-gray-1"><Skeletor width={100} /></label>
                            <div className="font-medium flex items-center justify-between"><Skeletor width={50} className="mr-[20px]" />  <Skeletor width={50} /></div>
                        </div>
                    </>
                        : dataSource.length > 0 ?
                            dataSource.map((item, index) => {
                                return (
                                    <div key={index} className="text-sm py-[10px] border-b border-divider dark:border-divider-dark last:border-0">
                                        <div className="flex items-center justify-between">
                                            <label className="text-gray-1">{t('common:time')}</label>
                                            <div className="font-medium">{formatTime(item?.createdAt, 'yyyy-MM-dd HH:mm:ss')}</div>
                                        </div>
                                        {item?.metadata?.modify_tp &&
                                            <div className="flex items-center justify-between ">
                                                <label className="text-gray-1">{t('futures:take_profit')}</label>
                                                <div className="font-medium">{renderModify(item?.metadata, 'take_profit')}</div>
                                            </div>
                                        }
                                        {item?.metadata?.modify_sl &&
                                            <div className="flex items-center justify-between ">
                                                <label className="text-gray-1">{t('futures:stop_loss')}</label>
                                                <div className="font-medium">{renderModify(item?.metadata, 'stop_loss')}</div>
                                            </div>
                                        }
                                        {item?.metadata?.modify_price &&
                                            <div className="flex items-center justify-between ">
                                                <label className="text-gray-1">{t('futures:price')}</label>
                                                <div className="font-medium">{renderModify(item?.metadata, 'price')}</div>
                                            </div>
                                        }
                                    </div>
                                )
                            })
                            :
                            <TableNoData />
                    }
                </div>
            </div>
        </Modal>
    );
}, () => { return true });

export default Adjustmentdetails;
