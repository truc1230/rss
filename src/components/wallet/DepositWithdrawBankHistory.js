import { useTranslation } from 'next-i18next';
import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import fetchAPI from 'utils/fetch-api';
import { ApiStatus, StatusBankTransfer } from 'src/redux/actions/const';
import { formatPrice, formatTime } from 'src/redux/actions/utils';
import DataTable from 'react-data-table-component';
import TableNoData from 'src/components/common/table.old/TableNoData';
import TableLoader from 'src/components/loader/TableLoader';
import { tableStyle } from 'src/config/tables';
import { Dialog, Transition } from '@headlessui/react';
import DetailDepositBank from 'src/components/wallet/DetailDepositBank';
import StatusWithdraw from 'src/components/wallet/StatusWithdraw';
import Link from 'next/link';

const DepositWithdrawBankHistory = ({ id }) => {
    const { t } = useTranslation();
    const [history, setHistory] = useState([]);
    const [open, setOpen] = useState(false);
    const [order, setOrder] = useState({});
    const [loadingHistory, setLoadingHistory] = useState(false);
    const cancelButtonRef = useRef();
    const getDepositHistory = async () => {
        setLoadingHistory(true);
        const { data, status } = await fetchAPI({
            url: '/api/v1/deposit/deposit_withdraw_history',
            options: {
                method: 'GET',
            },
            params: {
                transactionType: 'bank-transfer',
            },
        });
        if (status === ApiStatus.SUCCESS) {
            setHistory(data);
            setLoadingHistory(false);
        }
    };
    useEffect(() => {
        getDepositHistory();
    }, [id]);

    const customStyles = {
        ...tableStyle,
        rows: {
            style: {
                borderBottom: 'none !important',
                cursor: 'pointer',
                '&:hover': {
                    background: '#F6F9FC',
                },
            },
        },
    };
    const columns = useMemo(() => [
        {
            name: t('common:time'),
            selector: 'time',
            omit: false,
            width: '150px',
            cell: (row) => <span data-tag="allowRowEvents">{formatTime(row.createdAt)}</span>,
        },
        {
            name: t('common:transaction_id'),
            selector: 'transactionId',
            cell: (row) => <span data-tag="allowRowEvents">{row.transactionIds?.[0]}</span>,
        },
        {
            name: t('common:transaction_type'),
            selector: 'coin',
            cell: (row) => <span data-tag="allowRowEvents">{row.type === 1 ? t('deposit') : t('withdraw')}</span>,
        },
        {
            name: t('common:amount'),
            selector: 'amount',
            cell: (row) => <span data-tag="allowRowEvents">{`${formatPrice(row.amount, 2)} VNDC`}</span>,
        },
        {
            name: t('common:status'),
            selector: 'status',
            right: true,
            cell: (row) => <span data-tag="allowRowEvents"><StatusWithdraw status={row.status} /></span>,
        },
    ], []);
    const openModal = (_order) => {
        if (_order.status === StatusBankTransfer.Success || _order.status === StatusBankTransfer.Declined) {
            return;
        }
        setOpen(true);
        setOrder(_order);
    };
    const closeModal = (forceUpdate) => {
        setOpen(false);
        if (forceUpdate) {
            getDepositHistory();
        }
    };
    return (
        <div className="card bg-white rounded-3xl mb-8 lg:max-w-[825px] mx-auto">
            <div className="card-header">
                <div className="card-header-text">
                    {t('wallet:withdraw_deposit_history')}
                </div>
                <div className="card-header-actions">
                    <Link href="/wallet/history">
                        <span className="text-sm text-teal-700 font-bold cursor-pointer">
                            {t('wallet:all')}
                        </span>
                    </Link>
                </div>
            </div>
            <div className="card-body">
                <DataTable
                    data={history}
                    columns={columns}
                    customStyles={customStyles}
                    noHeader
                    fixedHeader
                    fixedHeaderScrollHeight="300px"
                    dense
                    noDataComponent={<TableNoData />}
                    progressPending={loadingHistory}
                    progressComponent={<TableLoader />}
                    onRowClicked={openModal}
                    data-tag="allowRowEvents"
                    pagination
                />
            </div>
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
                                className="inline-block w-full my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl"
                            >
                                <DetailDepositBank order={order} onClose={closeModal} />
                            </div>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
};

export default DepositWithdrawBankHistory;
