import { useTranslation } from 'next-i18next';

export const VndcFutureOrderType = {
    GroupStatus: {
        OPENING: 0,
        HISTORY: 1,
    },
    Status: {
        PENDING: 0,
        ACTIVE: 1,
        CLOSED: 2,
        REQUESTING: 3,
    },
    Side: {
        BUY: 'Buy',
        SELL: 'Sell',
    },
    Type: {
        MARKET: 'Market',
        LIMIT: 'Limit',
        STOP: 'Stop',
    },
    ReasonCloseCode: {
        NORMAL: 0,
        HIT_SL: 1,
        HIT_TP: 2,
        LIQUIDATE: 3,
        HIT_LIMIT_CLOSE: 4,
    },
    BitmexTransferError: {
        PROCESS_SUCCESSFULLY: 0,
        PLACE_ORDER_WITHOUT_SL_TP: 1, // Dat duoc lenh chinh nhung khong dat duoc lenh SL, TP
        ACTIVE_ORDER_ERROR: 2, // Lenh Stop hoac Limit duoc active nhung khong dat duoc SL, TP
        HIT_SL_TP_ERROR: 3, // Hit SL hoac TP nhung khong dong duoc lenh con lai
    },
    PromoteProgram: {
        NORMAL: 0,
        LUCKY_MONEY_2020: 1,
        AIRDROP_VNDC: 2,
    },
};

export const getProfitVndc = (order, lastPrice = 0, isOnus) => {
    const { status, quantity, open_price, type, symbol, side, close_price } = order || {};
    if (!order || !symbol) return null;
    let { fee } = order;
    fee = fee || 0;
    let profitVNDC = 0;
    let closePrice = 0;
    // if (status === VndcFutureOrderType.Status.PENDING || status === VndcFutureOrderType.Status.PENDING) {
    //     return 0
    // }
    if (status === VndcFutureOrderType.Status.ACTIVE) {
        closePrice = lastPrice;
    } else if (status === VndcFutureOrderType.Status.CLOSED) {
        closePrice = close_price;
    } else {
        return 0;
    }
    if (isOnus) {
        fee += quantity * closePrice * (0.06 / 100);
    }
    try {
        let buyProfitVNDC = 0;
        buyProfitVNDC = quantity * (closePrice - open_price);
        profitVNDC = side === VndcFutureOrderType.Side.BUY ? buyProfitVNDC - fee : -buyProfitVNDC - fee;
    } catch (e) {
    }
    return profitVNDC;
};

export const renderCellTable = (key, rowData) => {
    const { t, i18n: { language } } = useTranslation();
    switch (key) {
        case 'side':
            return language === 'vi' ? rowData[key] === 'Sell' ? t('common:sell') : t('common:buy') : rowData[key];
            return;
        case 'type':
            return language === 'vi' ?
                (rowData[key] === 'Market' ? t('futures:market') : rowData[key] === 'Limit' ? t('futures:limit') : rowData[key]) : rowData[key];
        default:
    }
};
