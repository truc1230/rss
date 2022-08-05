export const EPS = 0.00000001;

export const LOCAL_STORAGE_KEY = {
    THEME: 'theme',
};

const TokenConfigNetwork = {
    BITCOIN: 'Bitcoin',
    BITCOIN_FUTURE: 'BitcoinFuture',
    BINANCE_CHAIN: 'BinanceChain',
    TOMO_CHAIN: 'TomoChain',
    ETHEREUM: 'Ethereum',
    TRON_NETWORK: 'TRON_NETWORK',
    KARDIA_CHAIN: 'KARDIA_CHAIN',
    ETHEREUM_CLASSIC: 'ETHEREUM_CLASSIC',
    VITE_CHAIN: 'VITE_CHAIN',
    BINANCE_SMART_CHAIN: 'BINANCE_SMART_CHAIN',
    THETA: 'THETA',
};

export const TokenConfigV1 = {
    Network: TokenConfigNetwork,
    NetworkInt: {
        [TokenConfigNetwork.ETHEREUM]: 1,
        [TokenConfigNetwork.BINANCE_CHAIN]: 2,
        [TokenConfigNetwork.TRON_NETWORK]: 3,
        [TokenConfigNetwork.TOMO_CHAIN]: 4,
        [TokenConfigNetwork.ETHEREUM_CLASSIC]: 5,
        [TokenConfigNetwork.KARDIA_CHAIN]: 6,
        [TokenConfigNetwork.BITCOIN]: 7,
        [TokenConfigNetwork.VITE_CHAIN]: 8,
        [TokenConfigNetwork.BINANCE_SMART_CHAIN]: 9,
        [TokenConfigNetwork.THETA]: 10,
    },
    Type: {
        BITCOIN: 'BITCOIN',
        BITCOIN_FUTURE: 'BITCOIN_FUTURE',
        ERC20: 'ERC20',
        TomoChain: 'TomoChain',
        TRC20: 'TRC20',
        TRC21: 'TRC21',
        BEP2: 'BEP2',
        TRON_NATIVE: 'TRON_NATIVE',
        ETHEREUM_CLASSIC: 'ETHEREUM_CLASSIC',
        KARDIA_CHAIN_NATIVE: 'KARDIA_CHAIN_NATIVE',
        VITE_CHAIN_TOKEN: 'VITE_CHAIN_TOKEN',
        BEP20: 'BEP20',
        THETA_TOKEN: 'THETA_TOKEN',
    },
    HashRegex: {
        FIAT: '',
        ERC20: '^(0x)[0-9A-Fa-f]{40}$',
        BEP2: '^(bnb1)[0-9a-z]{38}$',
        BEP2MEMO: '^[0-9A-Za-z\\-_]{1,120}$',
        BEP20: '^(0x)[0-9A-Fa-f]{40}$',
        TRC20: '^T[1-9A-HJ-NP-Za-km-z]{33}$',
        BITCOIN: '^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$|^(bc1)[0-9A-Za-z]{39,59}$',
        TomoChain: '^(0x)[0-9A-Fa-f]{40}$',
        THETA_TOKEN: '^(0x)[0-9A-Fa-f]{40}$',
        VITE_CHAIN_TOKEN: '^(vite_)[a-z0-9]{50}$',
        VITEMEMO: '\\w{0,120}',
    },
};

export const TRADING_MODE = {
    EXCHANGE: 1,
    FUTURES: 2,
};

export const customModalStyles = {
    content: {
        top: '0%',
        left: '2%',
        right: '2%',
        bottom: 'auto',
        padding: 0,
        background: 'transparent',
        border: 'none',
        overflow: 'inherit',
        width: 'auto',
        overlay: { zIndex: 1000000 },
    },
    overlay: {
        zIndex: 9999,
        background: 'rgba(0,0,0,0.8)',
    },
};
export const UserPrefs = {
    OPENING_CHARTS: 'opening_charts',
    CONFIRM_CLOSING_ORDER: 'confirm_closing_order',
};

export const MetamaskError = {
    CHECKING: 'checking',
    WRONG_NETWORK: 'wrong_network',
    NOT_INSTALLED: 'not_installed',
    NO_ACCOUNT: 'no_account',
    UNKNOWN_ERROR: 'unknown_error',
};

export const NavigationMode = {
    MOBILE: 'mobile',
    DESKTOP: 'desktop',
};

export const STARRED_CURRENCY = 'STARRED_CURRENCY';

export const EVENT_WEEKEND = 'Happy Weekend';
export const EVENT_TET_TRADING = 'TET Trading';

export const WalletAction = {
    DEPOSIT: 'DEPOSIT',
    WITHDRAW: 'WITHDRAW',
    HISTORY: 'HISTORY',
    BALANCE: 'BALANCE',
};

export const SocialSocketEvent = {
    NOTIFICATION: 'notification',
};

export const SOCIAL_USERNAME_REXEXP = /^[a-zA-Z][a-zA-Z0-9]{5,14}$/;
export const SOCIAL_USERNAME_IN_TEXT =
    /([^a-zA-Z0-9$]?)(@[a-zA-Z][a-zA-Z0-9]{5,14})([^a-zA-Z0-9$]?)/gm;
export const REGEX_URL =
    /(https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-z]{2,6})\b([-a-zA-Z0-9@:%_+.~#?&/=]*)/gm;

export const ChartBroker = {
    NAMI_FUTURE: 'NamiFuture',
};
export const TradingViewSupportTimezone = [
    { timezone: 'Pacific/Honolulu', offset: -600 },
    { timezone: 'America/Juneau', offset: -480 },
    { timezone: 'America/Phoenix', offset: -420 },
    { timezone: 'America/El_Salvador', offset: -360 },
    { timezone: 'America/Chicago', offset: -300 },
    { timezone: 'America/Caracas', offset: -270 },
    { timezone: 'America/New_York', offset: -240 },
    { timezone: 'America/Sao_Paulo', offset: -180 },
    { timezone: 'Etc/UTC', offset: 0 },
    { timezone: 'Europe/London', offset: 60 },
    { timezone: 'Europe/Paris', offset: 120 },
    { timezone: 'Europe/Athens', offset: 180 },
    { timezone: 'Europe/Moscow', offset: 240 },
    { timezone: 'Asia/Tehran', offset: 270 },
    { timezone: 'Asia/Ashkhabad', offset: 300 },
    { timezone: 'Asia/Kolkata', offset: 330 },
    { timezone: 'Asia/Kathmandu', offset: 345 },
    { timezone: 'Asia/Almaty', offset: 360 },
    { timezone: 'Asia/Bangkok', offset: 420 },
    { timezone: 'Asia/Singapore', offset: 480 },
    { timezone: 'Asia/Tokyo', offset: 540 },
    { timezone: 'Australia/Adelaide', offset: 570 },
    { timezone: 'Australia/Brisbane', offset: 600 },
    { timezone: 'Pacific/Norfolk', offset: 690 },
    { timezone: 'Pacific/Auckland', offset: 720 },
    { timezone: 'Pacific/Chatham', offset: 765 },
    { timezone: 'Pacific/Fakaofo', offset: 780 },
];

export const ApiResultRegister = {
    EMAIL_NOT_VALID: 'email_not_valid',
    PASSWORD_NOT_VALID: 'password_not_valid',
    TEMPORARY_EMAIL: 'temporary_email',
    EMAIL_EXISTED: 'email_existed',
};

export const ApiResultLogin = {
    USERNAME_NOT_FOUND: 'username_not_found',
    EMAIL_NOT_FOUND: 'email_not_found',
    WRONG_PASSWORD: 'wrong_password',
};

export const VerifyEmail = {
    SUCCESS: 'success',
    FAILED: 'failed',
};

export const ApiResultForgetPassword = {
    EMAIL_NOT_REGISTERED: 'email_not_registered',
    OTP_UNAVAILABLE: 'otp_unavailable',
    PASSWORD_INVALID: 'password_invalid',
};

export const ApiResultSetUsername = {
    EXISTED: 'username_existed',
    HAS_BEEN_SET: 'username_already_set',
    INVALID: 'invalid',
    MISSING_DATA: 'missing_data',
};

export const TotalPrize = {
    DOGE: 41000,
    XLM: 1000,
};

export const ApiResultConvertTokenToETH = {
    INVALID_TOKEN: 'invalid_token',
    INVALID_AMOUNT: 'invalid_amount',
    INSUFFICIENT: 'insufficient',

    ETH_NOT_ENOUGH_TO_CONVERT: 'eth_not_enough_to_convert',
    UNKNOWN_ERROR: 'unknown_error',
};

export const ApiResultWithdrawETH = {
    INVALID_ADDRESS: 'invalid_address',
    INVALID_AMOUNT: 'invalid_amount',
    INVALID_CURRENCY: 'invalid_currency',
    INSUFFICIENT: 'insufficient',
    NOT_REACHED_MIN_WITHDRAW_IN_USD: 'not_reached_min_withdraw_in_usd',
    NOT_ENOUGH_FEE: 'not_enough_fee',
    MEMO_TOO_LONG: 'memo_too_long',
    INVALID_OTP: 'invalid_otp',
    MISSING_OTP: 'missing_otp',

    UNKNOWN_ERROR: 'unknown_error',
};

export const WithdrawalStatus = {
    PENDING: 1,
    COMPLETED: 2,
    REJECTED: 3,
    WAITING_FOR_CONFIRMATIONS: 4,
    WAITING_FOR_BALANCE: 5,
};

export const NotificationStatus = {
    EMITTED: 0,
    READ: 1,
    DELETED: 2,
};

export const NotificationCategory = {
    DEFAULT: 0,
    COMPLETE_TASK: 1,
    COMPLETE_SPIN_LEVEL: 2,
    CHAT_MENTION: 3,
    INVITE_ROOM: 4,
    REWARD_CHALLENGE_ROOM: 5,
    CHALLENGE_ROOM_REMIND: 6,
    DEPOSIT_REBATE: 7,
    WELCOME_MESSAGE: 8,
    MARKET_EXCHANGE: 9,
    CHALLENGE_MODE_SURVIVAL: 10,
    WAVES_BUY_NAMI: 12,
    DEPOSIT_ERC20: 14,
};

export const ChallengeRoomStatus = {
    ALL: -1,
    PENDING: 0,
    STARTED: 1,
    ENDED: 2,
};

export const UserChallengeRoomStatus = {
    JOINED: 1,
    EXITED: 0,
    STOP_PLAY: 2,
};

export const ChallengeRoomType = {
    MAIN_GAME: 1,
    CHALLENGE_GAME: 2,
    // End game reward 1 ETH
    MODE_1E: 3,
    // End game reward SPIN
    MODE_SPIN: 4,
    // End game reward coin
    MODE_PET_CRYPTO: 5,
    MODE_CUSTOM: 6,
    MODE_ALTCOIN: 7,
    MODE_RACING: 8,
    MODE_SURVIVAL: 9,
    CHALLENGE_SURVIVAL: 10,
};

export const UserRole = {
    ADMIN: 1,
    VERIFIER: 2,
    MASTER_IB: 3,
    IB: 4,
    USER: 5,
    // Has role to create challenge survival room
    LEVEL_1: 6,

    CHAT_SUPPORTER: 10,
};

export const ApiResultDeleteChat = {
    MISSING_DATA: 'missing_data',
    PERMISSION_DENIED: 'permission_denied',
    UNKNOWN_ERROR: 'unknown_error',
};

export const MarketType = {
    BUY: 1,
    SELL: 2,
    CLOSE: 3,
};

export const ExchangeHistoryAction = {
    MATCH_ORDER: 1,
    CLOSE_ORDER: 2,
    MATCH_MARKET_ORDER: 3,
    UPDATE_ORDER: 4,
};

export const ExchangeStatus = {};
export const ExchangeOrderStatus = {
    ALL: 0,
    PENDING: 1,
    SUCCESS: 2,
    CLOSED: 3,
    FAILED: 4,
};
export const ExchangeHistoryStatus = {
    MATCH_ORDER_SUCCESSFULLY: 1,
    USER_BACK_ETH: 2,
    FORCE_BACK_ETH: 3,
};

export const ExchangeType = {
    BUY: 1,
    SELL: 2,
    CLOSE: 3,
};

export const ExchangeSellerFee = {
    LEVEL_1: 5, // Volume < 100$
    LEVEL_2: 5, // Volume > 100$
};

export const ExchangeOrderResult = {
    NO_ACTION: null,
    PENDING: 'PENDING',
    SUCCESS: 'SUCCESS',
    INVALID_USER: 'INVALID_USER',
    INVALID_INPUT: 'INVALID_INPUT',
    NOT_FOUND_ORDER: 'NOT_FOUND_ORDER',
    NOT_ENOUGH_NAC: 'NOT_ENOUGH_NAC',
    NOT_ENOUGH_ETH: 'NOT_ENOUGH_ETH',
    NOT_ENOUGH_CURRENCY: 'NOT_ENOUGH_CURRENCY',
    INVALID_TIME_BACK_ETH: 'INVALID_TIME_BACK_ETH',
    UNKNOWN_ERROR: 'UNKNOWN_ERROR',
};

export const ExchangeMode = {
    MARKET: 1,
    LIMIT: 2,
    STOP_LIMIT: 3,
};

export const ExchangeStopLimitType = {
    GREATER_OR_EQUAL: 1,
    LESS_OR_EQUAL: 2,
};
export const DepositStatus = {
    PENDING: 0,
    COMPLETED: 1,
    WAITING_FOR_BLOCK_CONFIRMATION: 2,
    BLOCK_DENIED: 3,
    CONFIRMED_WAIT_TO_DEPOSIT: 4,
};

export const DepWdlStatus = {
    Pending: 1,
    Success: 2,
    Declined: 3,
    DepositedWaitingForConfirmation: 4,
    TransferredWaitingForConfirmation: 5,
    WithdrawWaitingForBalance: 6, // When user withdraws, switches to this status when Nami's withdrawal wallet is not enough money
    WithdrawWaitingForApproval: 7, // Admin verify
};

export const ChatResult = {
    CHAT_ANGRY: 'chat_angry',
    SPAM: 'spam',
    UNKNOWN_ERROR: 'unknown_error',
};

export const LoginButtonPosition = {
    WEB_HEADER: 'web_header',
    WEB_MODAL: 'web_modal',
    WEB_MIDDLE: 'web_middle',
    WEB_BANNER_HOME: 'web_banner_home',
    MOBILE_HEADER: 'mobile_header',
    MOBILE_MODAL: 'mobile_modal',
    MOBILE_MIDDLE: 'mobile_middle',
};

export const TfaResult = {
    ERR_MISMATCH_STATE: 'err_mismatch_state',
    AUTHENTICATOR_SECRET_INVALID: 'authenticator_secret_invalid',
    AUTHENTICATOR_SECRET_EXPIRED: 'authenticator_secret_expired',
    INVALID_OTP: 'invalid_otp',
};

export const TokenConfig = {
    Network: {
        BITCOIN: 'Bitcoin',
        BITCOIN_FUTURE: 'BitcoinFuture',
        BINANCE_CHAIN: 'BinanceChain',
        TOMO_CHAIN: 'TomoChain',
        ETHEREUM: 'Ethereum',
        TRON_NETWORK: 'TRON_NETWORK',
        KARDIA_CHAIN: 'KARDIA_CHAIN',
    },
    Type: {
        BITCOIN: 'BITCOIN',
        BITCOIN_FUTURE: 'BITCOIN_FUTURE',
        ERC20: 'ERC20',
        TomoChain: 'TomoChain',
        TRC20: 'TRC20',
        TRC21: 'TRC21',
        BEP2: 'BEP2',
        TRON_NATIVE: 'TRON_NATIVE',
        ETHEREUM_CLASSIC: 'ETHEREUM_CLASSIC',
        KARDIA_CHAIN_NATIVE: 'KARDIA_CHAIN_NATIVE',
        VITE_CHAIN_TOKEN: 'VITE_CHAIN_TOKEN',
        BEP20: 'BEP20',
        THETA_TOKEN: 'THETA_TOKEN',
    },
};

export const BuyBackTicket = {
    Status: {
        PENDING: 0,
        REGISTED_SELL: 1,
        SOLD_SUCCESSFULLY: 2,
        FAIL: 3,
    },
};

export const SymbolTradingStatus = {
    PRE_TRADING: 'PRE_TRADING',
    TRADING: 'TRADING',
    END_OF_DAY: 'END_OF_DAY',
    HALT: 'HALT',
    BREAK: 'BREAK',
};

export const DefaultExchangeSymbolConfig = {
    status: SymbolTradingStatus.TRADING,
    min_price: 0.00000001,
    max_price: 1000000,
    tick_size: 0.00000001,
    step_size: 0.00000001,
    min_qty: 0.00000001,
    max_qty: 900000,
    min_notional: 15,
};

export const ThemeMode = {
    DARK: 'DARK',
    LIGHT: 'LIGHT',
};

export const DefaultThemeMode = ThemeMode.LIGHT;

export const SpecialMode = {
    NORMAL: 0,
    ECO: 1,
};

export const WalletType = {
    SPOT: 'SPOT',
    MARGIN: 'MARGIN',
    FUTURES: 'FUTURES',
    P2P: 'P2P',
    POOL: 'POOL',
    BROKER: 'BROKER',
    EARN: 'EARN',
    ONUS: 'ONUS',
};

export const EarnWalletType = {
    STAKING: 'stake',
    FARMING: 'farm',
};

export const WalletTypeReducerKey = {
    [WalletType.SPOT]: 'SPOT',
    [WalletType.MARGIN]: 'MARGIN',
    [WalletType.FUTURES]: 'FUTURES',
    [WalletType.P2P]: 'P2P',
    [WalletType.POOL]: 'POOL',
    [WalletType.BROKER]: 'BROKER',
    [WalletType.EARN]: 'EARN',
};

export const WalletTypeName = {
    [WalletType.SPOT]: 'Main Account',
    [WalletType.MARGIN]: '',
    [WalletType.FUTURES]: 'Futures Account',
    [WalletType.P2P]: '',
    [WalletType.POOL]: '',
};

export const ApiStatus = {
    SUCCESS: 'ok',
    ERROR: 'error',
};

export const PublicSocketEvent = {
    SPOT_RECENT_TRADE_ADD: 'spot:recent_trade:add',
    SPOT_DEPTH_UPDATE: 'spot:depth:update',
    SPOT_TICKER_UPDATE: 'spot:ticker:update',

    FUTURES_DEPTH_UPDATE: 'futures:depth:update',
    FUTURES_TICKER_UPDATE: 'futures:ticker:update',
    FUTURES_MINI_TICKER_UPDATE: 'futures:mini_ticker:update',
    FUTURES_MARK_PRICE_UPDATE: 'futures:mark_price:update',
    // FUTURES_RECENT_TRADE_ADD: 'futures:recent_trade:add',

    IEO_PERCENTAGE_UPDATE: 'ieo:project_update',
    IEO_TICKET_STATUS_UPDATE: 'ieo:buy_response',
    CALCULATE_WITHDRAW_FEE: 'calculate_withdrawal_fee',
};

export const ExchangeOrderEnum = {
    StopLimitType: {
        GREATER_OR_EQUAL: 1,
        LESS_OR_EQUAL: 2,
    },
    Side: {
        BUY: 'BUY',
        SELL: 'SELL',
    },
    Status: {
        NEW: 'NEW',
        PARTIALLY_FILLED: 'PARTIALLY_FILLED',
        FILLED: 'FILLED',
        CANCELED: 'CANCELED',
        FAILED: 'FAILED',
    },
    Type: {
        MARKET: 'MARKET',
        LIMIT: 'LIMIT',
        STOP_LIMIT: 'STOP_LIMIT',
    },

    QuantityMode: {
        QUANTITY: 'QUANTITY',
        QUOTE_QUANTITY: 'QUOTE_QUANTITY',
    },
    NotificationType: {
        PLACE_ORDER: 'PLACE_ORDER',
        CLOSE_ORDER: 'CLOSE_ORDER',
    },
    LiquidityStatus: {
        HOLD: 'HOLD',
        TRANSFERRED: 'TRANSFERRED',
        TRANSFERRED_ERROR: 'TRANSFERRED_ERROR',
    },
    Result: {
        INVALID_USER: 'INVALID_USER',
        INVALID_INPUT: 'INVALID_INPUT',
        INVALID_LIMIT_PRICE: 'INVALID_LIMIT_PRICE',

        NOT_FOUND_ORDER: 'NOT_FOUND_ORDER',
        NOT_ENOUGH_BASE_ASSET: 'NOT_ENOUGH_BASE_ASSET',
        NOT_ENOUGH_QUOTE_ASSET: 'NOT_ENOUGH_QUOTE_ASSET',
        STOP_LIMIT_INVALID_STOP_PRICE: 'STOP_LIMIT_INVALID_STOP_PRICE',
        STOP_LIMIT_UNKNOWN_LAST_PRICE: 'STOP_LIMIT_UNKNOWN_LAST_PRICE',
        STOP_LIMIT_INVALID_MIN_TOTAL: 'STOP_LIMIT_INVALID_MIN_TOTAL',
        BROKER_ERROR: 'BROKER_ERROR',
        ORDER_TYPE_NOT_SUPPORT: 'ORDER_TYPE_NOT_SUPPORT',
        UNKNOWN_ERROR: 'UNKNOWN_ERROR',
        INVALID_SYMBOL: 'INVALID_SYMBOL',
        INVALID_SIDE: 'INVALID_SIDE',
        INVALID_TYPE: 'INVALID_TYPE',
        INVALID_QUANTITY: 'INVALID_QUANTITY',
        TOO_MUCH_ORDERS: 'TOO_MUCH_ORDERS',
        INSTRUMENTS_DO_NOT_MATCH: 'INSTRUMENTS_DO_NOT_MATCH',
        INSTRUMENT_NOT_LISTED_FOR_TRADING_YET:
            'INSTRUMENT_NOT_LISTED_FOR_TRADING_YET',
        INVALID_PRICE: 'INVALID_PRICE',
        INVALID_TICK_SIZE: 'INVALID_TICK_SIZE',
        INVALID_STEP_SIZE: 'INVALID_STEP_SIZE',
        INVALID_MIN_NOTIONAL: 'INVALID_MIN_NOTIONAL',
    },
    Filter: {
        PRICE_FILTER: 'PRICE_FILTER',
        PERCENT_PRICE: 'PERCENT_PRICE',
        LOT_SIZE: 'LOT_SIZE',
        MIN_NOTIONAL: 'MIN_NOTIONAL',
        ICEBERG_PARTS: 'ICEBERG_PARTS',
        MARKET_LOT_SIZE: 'MARKET_LOT_SIZE',
        MAX_NUM_ORDERS: 'MAX_NUM_ORDERS',
        MAX_NUM_ALGO_ORDERS: 'MAX_NUM_ALGO_ORDERS',
    },
};

export const FuturesOrderEnum = {

    GroupStatus: {
        OPENING: 0,
        HISTORY: 1,
    },
    Status: {
        PENDING: 0,
        ACTIVE: 1,
        CLOSED: 2,
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
    SpecialMode: {
        NORMAL: 0,
        ONLY_LIMIT: 1,
    },
    // 30 60 90 120 -> Step 100
    LiquidityBroker: {
        BINANCE: 'BINANCE',
        BITMEX: 'BITMEX',
        NAMI: 'NAMI',
    },
    CloseAllOrderType: {
        ALL: 'ALL',
        PROFIT: 'PROFIT',
        LOSS: 'LOSS',
        PENDING: 'PENDING',
        ACTIVE: 'ACTIVE',
    },

};

export const ExchangeFilterDefault = {
    PRICE_FILTER: {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000001',
        maxPrice: '100000.00000000',
        tickSize: '0.00010000',
    },
    LOT_SIZE: {
        filterType: 'LOT_SIZE',
        minQty: '0.00000001',
        maxQty: '900000.00000000',
        stepSize: '0.01000000',
    },
    MIN_NOTIONAL: {
        filterType: 'MIN_NOTIONAL',
        minNotional: '10.00000000',
        applyToMarket: true,
        avgPriceMins: 5,
    },
};

export const SpotFeePercentage = {
    NORMAL: 0.0012,
};

export const SpotMarketPriceBias = {
    NORMAL: 0.2 / 100,
};

export const StatusBankTransfer = {
    Pending: 1,
    Success: 2,
    Declined: 3,
    DepositedWaitingForConfirmation: 4,
    TransferredWaitingForConfirmation: 5,
};

export const QueryWalletType = {
    spot: 'SPOT',
    broker: 'BROKER',
    earn: 'EARN',
};

export const WithdrawResult = {
    InvalidAsset: 'invalid_asset',
    WithdrawDisabled: 'withdraw_disabled',
    UnsupportedAddress: 'unsupported_address',
    InvalidAddress: 'invalid_address',
    AmountTooSmall: 'amount_too_small',
    AmountExceeded: 'amount_exceeded',
    NotEnoughBalance: 'not_enough_balance',
    Unknown: 'unknown_error',
};

export const CategoryList = {
    DEPOSIT: 'DEPOSIT', // offchain
    DEPOSIT_ON_CHAIN: 'DEPOSIT_ON_CHAIN',
    DEPOSIT_CHARGE_BACK: 'DEPOSIT_CHARGE_BACK',
    DEPOSIT_FEE: 'DEPOSIT_FEE',
    WITHDRAW: 'WITHDRAW', // offchain
    WITHDRAW_ON_CHAIN: 'WITHDRAW_ON_CHAIN',
    WITHDRAW_CHARGE_BACK: 'WITHDRAW_CHARGE_BACK',
    WITHDRAW_FEE: 'WITHDRAW_FEE',
    TRANSFER_INTERNAL: 'TRANSFER_INTERNAL',
    TRANSFER_INTERNAL_FEE: 'TRANSFER_INTERNAL_FEE',
    SPOT_LOCK: 'SPOT_LOCK',
    SPOT_PLACE_ORDER: 'SPOT_PLACE_ORDER',
    SPOT_MATCH_ORDER: 'SPOT_MATCH_ORDER',
    SPOT_CLOSE_ORDER: 'SPOT_CLOSE_ORDER',
    SPOT_FEE: 'SPOT_FEE',
    SPOT_COMMISSION_BROKER: 'SPOT_COMMISSION_BROKER',
    SWAP_PLACE_ORDER: 'SWAP_PLACE_ORDER',
    SWAP_FEE: 'SWAP_FEE',
    STAKE_REWARD: 'STAKE_REWARD',
    ATTLAS_MEMBERSHIP: 'ATTLAS_MEMBERSHIP',
};

export const LAYOUT_VERSION = '1.0.8';
export const LS_KEYS = {
    SPOT_LAYOUT: `spot:layouts__${LAYOUT_VERSION}`,
    SPOT_LAYOUT_ON_SIDEBAR: `spot:isOnSidebar:layouts__${LAYOUT_VERSION}`,
    SPOT_ON_SIDEBAR: `spot:isOnSidebar__${LAYOUT_VERSION}`,
    SPOT_MAX_CHART: `spot:maxChart__${LAYOUT_VERSION}`,
};

export const OLD_LS_KEYS = [
    'spot:layouts',
    'spot:isOnSidebar:layouts',
    'spot:layouts__1.0.1',
    'spot:isOnSidebar:layouts__1.0.1',
    'spot:maxChart',
    'spot:isOnSidebar',
    'spot:maxChart',
    'spot:layouts__1.0.2',
    'spot:isOnSidebar:layouts__1.0.2',
    'spot:isOnSidebar__1.0.2',
    'spot:maxChart__1.0.2',
    'spot:layouts__1.0.3',
    'spot:isOnSidebar:layouts__1.0.3',
    'spot:isOnSidebar__1.0.3',
    'spot:maxChart__1.0.3',
    'spot:layouts__1.0.5',
    'spot:isOnSidebar:layouts__1.0.5',
    'spot:isOnSidebar__1.0.5',
    'spot:maxChart__1.0.5',
    'spot:layout__1.0.5',
    'nami-tv__1.0.4',
    'nami-tv__1.0.5',
    'spot:layouts__1.0.6',
    'spot:isOnSidebar:layouts__1.0.6',
    'spot:isOnSidebar__1.0.6',
    'spot:maxChart__1.0.6',
    'spot:layout__1.0.6',
    'spot:layouts__1.0.7',
    'spot:isOnSidebar:layouts__1.0.7',
    'spot:isOnSidebar__1.0.7',
    'spot:maxChart__1.0.7',
    'spot:layout__1.0.7',
];

export const KYC_STATUS = {
    NO_KYC: 0,
    PENDING_APPROVAL: 1,
    APPROVED: 2,
    ADVANCE_KYC: 3,
    APPROVED_PENDING_APPROVAL_ADVANCE: 4, // cập nhật thêm số cmnd + ảnh mặt
    PENDING_APPROVAL_ADVANCE: 5, // user kyc từ đầu cập nhật hết
};

export const SECURITY_VERIFICATION = {
    CHANGE_PASSWORD: 0,
    CHANGE_PHONE: 1,
    CHANGE_EMAIL: 2,
    ENABLE_GA_VERIFICATION: 3,
    ENABLE_EMAIL_VERIFICATION: 4,
    ENABLE_PHONE_VERIFICATION: 5,
    CHANGE_NAME: 6,
    CHANGE_USERNAME: 7,
    WITHDRAW_ONCHAIN: 8,
};

export const DOWNLOAD_APP_LINK = {
    IOS: 'https://apps.apple.com/us/app/id1480302334',
    ANDROID:
        'https://play.google.com/store/apps/details?id=com.namicorp.exchange',
};

export const CATEGORY_SPOT_SIGNAL = {
    ALL: 'nami_cat_all',
    SIGNAL: 'nami_cat_signal',
};

export const SPOT_LAYOUT_MODE = {
    SIMPLE: 'simple',
    PRO: 'pro',
    FULLSCREEN: 'fullscreen',
};

export const ORDER_BOOK_MODE = {
    BIDS: 'bids',
    ASKS: 'asks',
    ALL: 'all',
};

export const UserSocketEvent = {
    UPDATE_DEPOSIT_HISTORY: 'user:update_deposit_history',
    UPDATE_WITHDRAW_HISTORY: 'user:update_withdraw_history',
    EXCHANGE_UPDATE_RATE: 'exchange:update_rate',
    EXCHANGE_UPDATE_RATE_PAIR: 'exchange:update_rate_pair',
    EXCHANGE_UPDATE_INFOR: 'exchange:update_infor',

    EXCHANGE_UPDATE_OPENING_ORDER: 'exchange:update_opening_order',
    EXCHANGE_UPDATE_HISTORY_ORDER: 'exchange:update_history_order',
    EXCHANGE_UPDATE_ORDER: 'exchange:update_order',

    EXCHANGE_PLACE_MARKET_ORDER_RESULT: 'exchange:place_market_order_result',
    UPDATE_BALANCE: 'user:update_balance',
    FUTURES_OPEN_ORDER: 'future:update_opening_order',

};

export const EarnOrder_Status = {
    SAVING: 1,
    FINISHED: 2,
    CANCELLED: 0,
};

export const ChartMode = {
    SPOT: 'SPOT',
    FUTURES: 'FUTURES',
};

export const DefaultFuturesFee = {
    Nami: 0.1 / 100,
    NamiFrameOnus: 0.06 / 100,
};

export const TransactionCategory = {
    FUTURE_INSURANCE_FUND: 608,
    FUTURE_PROMOTION: 609,
    DEPOSIT: 4,
    VNDC_DIRECT_WITHDRAW: 723,
    VNDC_DIRECT_WITHDRAW_FEE: 724,

    FUTURE_PLACE_ORDER_FEE: 600,
    FUTURE_PLACE_ORDER_MARGIN: 601,
    FUTURE_CLOSE_ORDER_PROFIT: 602,
    FUTURE_SWAP: 603,
    FUTURE_REFERRAL_COMMISION: 604,
    FUTURE_VNDC_FEE_PROMOTE: 605,
    FUTURE_VNDC_LIQUIDATE_FEE: 606,

    FUTURE_COPY_TRADE_PROFIT_TO_MASTER: 662,
    PAY_INTEREST_STAKE_TRANSACTION: 1019,
};
