export const EMPTY_VALUE = '--'

export const NAMI_FUTURES_EARNED_SHARE = 'NamiFutures_TakeProfit_'

export const ROOT_TOKEN = 'NAMI'

export const USER_DEVICE_STATUS = {
    NORMAL: 0, //
    REVOKED: 1, // Force logged out
    BANNED: 2, // Banned
    LOGGED_OUT: 3, // User logged out normally
    WAITING_FOR_AUTHORIZATION: 4, // Wait to be authorized
}

export const FUTURES_NUMBER_OF_CONTRACT = {
    longOrder: 1,
    shortOrder: -1,
}

export const ASSET_IGNORE = [
    'TURN_CHRISTMAS_2017',
    'TURN_CHRISTMAS_2017_FREE',
    'USDT_BINANCE_FUTURES',
    'SPIN_CONQUEST',
    'SPIN_BONUS',
    'SPIN_SPONSOR',
    'XBT_PENDING',
]

export const TERM_OF_SERVICE = {
    SWAP: '/',
}

export const BREAK_POINTS = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536,
}

export const FEE_STRUCTURES = {
    EXCHANGE: {
        DEDUCTION: 25,
        MAKER_TAKER: {
            MAKER: ['0.075000', '0.10000'],
            TAKER: ['0.075000', '0.10000'],
        },
    },
    FUTURES: {
        VNDC: {
            DEDUCTION: 13,
            MAKER_TAKER: {
                MAKER: ['0.087000', '0.10000'],
                TAKER: ['0.087000', '0.10000'],
            },
        },
        USDT: {
            DEDUCTION: 13,
            MAKER_TAKER: {
                MAKER: ['0.087000', '0.10000'],
                TAKER: ['0.087000', '0.10000'],
            },
        },
    },
}

export const FEE_TABLE = [
    {
        level: 0,
        vol_30d: '< 50 BTC',
        andor: 'or',
        nami_holding: 0,
        maker_taker: '0.1000% / 0.1000%',
        maker_taker_deducted: '0.07500% / 0.07500%',
    },
    {
        level: 1,
        vol_30d: '≥ 50 BTC',
        andor: 'or',
        nami_holding: 2e4,
        maker_taker: '0.07800% / 0.07900%',
        maker_taker_deducted: '0.05850% / 0.05925%',
    },
    {
        level: 2,
        vol_30d: '≥ 500 BTC',
        andor: 'or',
        nami_holding: 5e4,
        maker_taker: '0.07600% / 0.07800%',
        maker_taker_deducted: '0.05699% / 0.05850%',
    },
    {
        level: 3,
        vol_30d: '≥ 1500 BTC',
        andor: 'or',
        nami_holding: 1e5,
        maker_taker: '0.07300% / 0.07600%',
        maker_taker_deducted: '0.05475% / 0.05699%',
    },
    {
        level: 4,
        vol_30d: '≥ 4500 BTC',
        andor: 'or',
        nami_holding: 2e5,
        maker_taker: '0.07000% / 0.07300%',
        maker_taker_deducted: '0.05250% / 0.05475%',
    },
    {
        level: 5,
        vol_30d: '< 50 BTC',
        andor: 'or',
        nami_holding: 5e5,
        maker_taker: ' 0.06500% / 0.06999%',
        maker_taker_deducted: '0.04874% / 0.05250%',
    },
    {
        level: 6,
        vol_30d: '< 50 BTC',
        andor: 'or',
        nami_holding: 1e6,
        maker_taker: '0.06000% / 0.06500%',
        maker_taker_deducted: '0.04500% / 0.04874%',
    },
    {
        level: 7,
        vol_30d: '< 50 BTC',
        andor: 'or',
        nami_holding: 2e6,
        maker_taker: '0.05500% / 0.06000%',
        maker_taker_deducted: '0.04125% / 0.04500%',
    },
    {
        level: 8,
        vol_30d: '< 50 BTC',
        andor: 'or',
        nami_holding: 3e6,
        maker_taker: '0.05000% / 0.05500%',
        maker_taker_deducted: '0.03750% / 0.04125%',
    },
    {
        level: 9,
        vol_30d: '< 50 BTC',
        andor: 'or',
        nami_holding: 5e6,
        maker_taker: '0.04000% / 0.04500%',
        maker_taker_deducted: '0.03000% / 0.03375%',
    },
]

export const FUTURES_ORDER_STATUS = {
    PENDING: '',
    OPENING: ''
}

export const TEST_ID = ['Nami852TPE2694', 'Nami527EBA4688']

export const MIN_WALLET = 1e-10

export const PORTAL_MODAL_ID = 'PORTAL_MODAL'

export const LOCAL_STORAGE_KEY = {
    PreviousFuturesPair: 'previous_futures_pair',
    FuturesGridLayouts: 'futures_grid_layouts',
}

export const PRODUCT = {
    SPOT: 'Nami Spot',
    FUTURES: 'Nami Futures',
}

export const BINANCE_LEVERAGE_MARGIN = [
    {
        positionBracket: [
            0,
            50000
        ],
        maxLeverage: 125,
        rate: 125,
        amount: 0
    },
    {
        positionBracket: [
            50000,
            250000
        ],
        maxLeverage: 100,
        rate: 100,
        amount: 50
    },
    {
        positionBracket: [
            250000,
            1000000
        ],
        maxLeverage: 50,
        rate: 50,
        amount: 1300
    },
    {
        positionBracket: [
            1000000,
            7500000
        ],
        maxLeverage: 20,
        rate: 20,
        amount: 16300
    },
    {
        positionBracket: [
            7500000,
            40000000
        ],
        maxLeverage: 10,
        rate: 10,
        amount: 203800
    },
    {
        positionBracket: [
            40000000,
            100000000
        ],
        maxLeverage: 5,
        rate: 5,
        amount: 2203
    },
    {
        positionBracket: [
            100000000,
            200000000
        ],
        maxLeverage: 4,
        rate: 4,
        amount: 4703
    },
    {
        positionBracket: [
            200000000,
            400000000
        ],
        maxLeverage: 3,
        rate: 3,
        amount: 9703
    },
    {
        positionBracket: [
            400000000,
            600000000
        ],
        maxLeverage: 2,
        rate: 2,
        amount: 49703
    },
    {
        positionBracket: [
            600000000,
            1000000000
        ],
        maxLeverage: 1,
        rate: 1,
        amount: 199703
    }
]
