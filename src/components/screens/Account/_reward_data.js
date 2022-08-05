export const REWARD_TYPE = {
    PROMOTION: 'PROMOTION',
    TRADING: 'TRADING'
}

export const REWARD_STATUS = {
    NOT_AVAILABLE: 'NOT_AVAILBLE',
    AVAILABLE: 'AVAILABLE'
}

export const TASK_STATUS = {
    NOT_AVAILABLE: 'NOT_AVAILBLE',
    READY: 'READY',
    COMING_SOON: 'COMING_SOON',
    PROGRESSING: 'PROGRESSING',
    COMPLETED: 'COMPLETED'
}

export const TASK_PROPS_TYPE = {
    MULTISTEP: 'MULTISTEP',
    REACH_TARGET: 'REACH_TARGET'
}

export const STEP_TYPE = {
    PENDING: 'PENDING',
    FINISHED: 'FINISHED'
}

export const TASK_ACTIONS = {
    USER: {
        KYC: 'KYC',
        WITHDRAW: 'WITHDRAW',
        DEPOSIT: 'DEPOSIT',
        TRANSFER: 'TRANSFER',
    },
    TRADE: {
        SPOT: {
            BUY: 'BUY',
            SELL: 'SELL',
            SWAP: 'SWAP',
        },
        FUTURES: {
            BUY: 'BUY',
            SELL: 'SELL',
            COPY_TRADE: 'COPY_TRADE'
        }
    },
    EARN: {
        STAKE: 'STAKE',
        FARM: 'FARM',
    },
    CLAIM: 'CLAIM'
}

export const CLAIM_STATUS = {
    NOT_AVAILABLE: 'NOT_AVAILABLE',
    AVAILABLE: 'AVAILABLE',
    CLAIMED: 'CLAIMED',
}

export default [
    {
        // ? Reward summary
        id: 'new_user_journey_2022',
        status: REWARD_STATUS.AVAILABLE,
        type: REWARD_TYPE.PROMOTION,
        start_at: '2021-12-31T17:00:00.000Z', // if status is COMING_SOON
        expired_at: '2021-12-31T17:00:00.000Z',

        // ? Constraints (query in cms)
        // constraints: [
        //     { id: [18, 888] },
        //     { region: ['vn-vi'] }
        // ],

        // ? Basic info
        icon_url: '/images/icon/ic_exchange.png',
        url_reference: 'https://nami.io/0510/new-user-journey',

        title: {
            en: 'New User Journey',
            vi: 'Bắt đầu hành trình mới của bạn'
        },
        notes: {
            vi: [
                'Chỉ dành cho người dùng Việt Nam'
            ],
            en: [
                'For Vietnamese User only'
            ]
        },
        description: {
            vi: [
                'Complete your new user journey to claim free token for each task.'
            ],
            en: [
                'Complete your new user journey to claim free token for each task.'
            ]
        },

        // ? Total reward
        total_reward: {
            assetId: 72,
            value: 4e5
        },

        // ? Tasks
        tasks: {
            // Is claimable all ?
            claimable_all: false,

            // !Task list
            task_list: [

                // !NOTE: Task KYC
                {
                    // Task summary
                    task_id: 'completed_kyc',
                    task_status: TASK_STATUS.NOT_AVAILABLE,
                    start_at: '2021-12-31T17:00:00.000Z',
                    expired_at: '2021-12-31T17:00:00.000Z',

                    // ? Task constraints (query in cms)
                    // constraints: [
                    //     { id: [18, 888] },
                    //     { region: ['vn-vi'] },
                    //     { created_at: '' },
                    //     // ...
                    // ],

                    // Basic info
                    icon_url: '/images/icon/ic_news.png',
                    task_title: {
                        vi: 'Hoàn thành xác minh danh tính',
                        en: 'Complete KYC Progress'
                    },
                    description: 'https://nami.io/0510/complete-kyc-progress',

                    // Task props
                    task_props: {
                        type: TASK_PROPS_TYPE.MULTISTEP,
                        claim_status: CLAIM_STATUS.AVAILABLE,
                        metadata: {
                            steps: [
                                { type: null, vi: 'Chưa bắt đầu', en: 'Not started' },
                                { type: STEP_TYPE.PENDING, vi: 'Đang chờ duyệt', en: 'Verifying' },
                                { type: STEP_TYPE.FINISHED, vi: 'Hoàn tất', en: 'Finished' }
                            ],
                            current_step_index: 0,
                            actions: [
                                { type: TASK_ACTIONS.USER.KYC, en: 'KYC Now', vi: 'Xác minh ngay' },
                                { type: TASK_ACTIONS.CLAIM, en: 'Claim', vi: 'Nhận' }
                            ],
                        }
                    },

                    // Task reward
                    task_reward: {
                        assetId: 22,
                        value: 50
                    }
                },

                // !NOTE: Task Deposit 500,000 VNDC
                {
                    // Task summary
                    task_id: 'deposit_5e5_vndc',
                    task_status: TASK_STATUS.READY,
                    expired_at: '2021-12-31T17:00:00.000Z',

                    // ? Task constraints (query in cms)
                    // constraints: [
                    //     { id: [18, 888] },
                    //     { region: ['vn-vi'] },
                    //     { created_at: '' },
                    //     // ...
                    // ],

                    // Basic info
                    icon_url: '/images/icon/ic_wallet.png',
                    task_title: {
                        vi: 'Nạp 500,000 VNDC',
                        en: 'Deposit 500,000 VNDC'
                    },
                    description: {
                        vi: 'Nạp VNDC lên đến 500,000 VNDC vào tài khoản để hoàn thành nhiệm vụ và nhận phần thưởng.',
                        en: 'Deposit VNDC up to 500,000 VNDC to your account to complete tasks and earn rewards.',
                    },

                    // Task props
                    task_props: {
                        type: TASK_PROPS_TYPE.REACH_TARGET,
                        claim_status: CLAIM_STATUS.CLAIMED,
                        metadata: {
                            assetId: 72,
                            target: 500000,
                            reached: 500000,
                            actions: [
                                { type: TASK_ACTIONS.USER.DEPOSIT, en: 'Deposit', vi: 'Nạp' },
                                { type: TASK_ACTIONS.CLAIM, en: 'Claim', vi: 'Nhận' }
                            ],
                        }
                    },

                    // Task reward
                    task_reward: {
                        assetId: 72,
                        value: 30000
                    }
                },

                // !NOTE: Task Withdraw 500,000 VNDC
                {
                    // Task summary
                    task_id: 'withdraw_5e5_vndc',
                    task_status: TASK_STATUS.READY,
                    expired_at: '2021-12-31T17:00:00.000Z',

                    // ? Task constraints (query in cms)
                    // constraints: [
                    //     { id: [18, 888] },
                    //     { region: ['vn-vi'] },
                    //     { created_at: '' },
                    //     // ...
                    // ],

                    // Basic info
                    icon_url: '/images/icon/ic_wallet.png',
                    task_title: {
                        vi: 'Rút 500,000 VNDC',
                        en: 'Withdraw 500,000 VNDC'
                    },
                    description: {
                        vi: 'Rút VNDC lên đến 500,000 VNDC vào tài khoản để hoàn thành nhiệm vụ và nhận phần thưởng.',
                        en: 'Withdraw VNDC up to 500,000 VNDC to your account to complete tasks and earn rewards.',
                    },

                    // Task props
                    task_props: {
                        type: TASK_PROPS_TYPE.REACH_TARGET,
                        claim_status: CLAIM_STATUS.NOT_AVAILABLE,
                        metadata: {
                            assetId: 72,
                            target: 500000,
                            reached: 350000,
                            actions: [
                                { type: TASK_ACTIONS.USER.WITHDRAW, en: 'Withdraw', vi: 'Rút' },
                                { type: TASK_ACTIONS.CLAIM, en: 'Claim', vi: 'Nhận' }
                            ],
                        }
                    },

                    // Task reward
                    task_reward: {
                        assetId: 72,
                        value: 30000
                    }
                },
            ]
        }
    },
    {
        // ? Reward summary
        id: 'new_user_journey_2022_clone',
        status: REWARD_STATUS.AVAILABLE,
        type: REWARD_TYPE.PROMOTION,
        start_at: '2021-12-31T17:00:00.000Z', // if status is COMING_SOON
        expired_at: '2021-12-31T17:00:00.000Z',

        // ? Constraints (query in cms)
        // constraints: [
        //     { id: [18, 888] },
        //     { region: ['vn-vi'] }
        // ],

        // ? Basic info
        icon_url: '/images/icon/ic_exchange.png',
        url_reference: 'https://nami.io/0510/new-user-journey',

        title: {
            en: 'New User Journey',
            vi: 'Bắt đầu hành trình mới của bạn'
        },
        notes: {
            vi: [
                'Chỉ dành cho người dùng Việt Nam'
            ],
            en: [
                'For Vietnamese User only'
            ]
        },
        description: {
            vi: [
                'Complete your new user journey to claim free token for each task.'
            ],
            en: [
                'Complete your new user journey to claim free token for each task.'
            ]
        },

        // ? Total reward
        total_reward: {
            assetId: 72,
            value: 4e5
        },

        // ? Tasks
        tasks: {
            // Is claimable all ?
            claimable_all: false,

            // !Task list
            task_list: [

                // !NOTE: Task KYC
                {
                    // Task summary
                    task_id: 'completed_kyc',
                    task_status: TASK_STATUS.NOT_AVAILABLE,
                    start_at: '2021-12-31T17:00:00.000Z',
                    expired_at: '2021-12-31T17:00:00.000Z',

                    // ? Task constraints (query in cms)
                    // constraints: [
                    //     { id: [18, 888] },
                    //     { region: ['vn-vi'] },
                    //     { created_at: '' },
                    //     // ...
                    // ],

                    // Basic info
                    icon_url: '/images/icon/ic_news.png',
                    task_title: {
                        vi: 'Hoàn thành xác minh danh tính',
                        en: 'Complete KYC Progress'
                    },
                    description: 'https://nami.io/0510/complete-kyc-progress',

                    // Task props
                    task_props: {
                        type: TASK_PROPS_TYPE.MULTISTEP,
                        claim_status: CLAIM_STATUS.AVAILABLE,
                        metadata: {
                            steps: [
                                { type: null, vi: 'Chưa bắt đầu', en: 'Not started' },
                                { type: STEP_TYPE.PENDING, vi: 'Đang chờ duyệt', en: 'Verifying' },
                                { type: STEP_TYPE.FINISHED, vi: 'Hoàn tất', en: 'Finished' }
                            ],
                            current_step_index: 0,
                            actions: [
                                { type: TASK_ACTIONS.USER.KYC, en: 'KYC Now', vi: 'Xác minh ngay' },
                                { type: TASK_ACTIONS.CLAIM, en: 'Claim', vi: 'Nhận' }
                            ],
                        }
                    },

                    // Task reward
                    task_reward: {
                        assetId: 22,
                        value: 50
                    }
                },

                // !NOTE: Task Deposit 500,000 VNDC
                {
                    // Task summary
                    task_id: 'deposit_5e5_vndc',
                    task_status: TASK_STATUS.READY,
                    expired_at: '2021-12-31T17:00:00.000Z',

                    // ? Task constraints (query in cms)
                    // constraints: [
                    //     { id: [18, 888] },
                    //     { region: ['vn-vi'] },
                    //     { created_at: '' },
                    //     // ...
                    // ],

                    // Basic info
                    icon_url: '/images/icon/ic_wallet.png',
                    task_title: {
                        vi: 'Nạp 500,000 VNDC',
                        en: 'Deposit 500,000 VNDC'
                    },
                    description: {
                        vi: 'Nạp VNDC lên đến 500,000 VNDC vào tài khoản để hoàn thành nhiệm vụ và nhận phần thưởng.',
                        en: 'Deposit VNDC up to 500,000 VNDC to your account to complete tasks and earn rewards.',
                    },

                    // Task props
                    task_props: {
                        type: TASK_PROPS_TYPE.REACH_TARGET,
                        claim_status: CLAIM_STATUS.CLAIMED,
                        metadata: {
                            assetId: 72,
                            target: 500000,
                            reached: 500000,
                            actions: [
                                { type: TASK_ACTIONS.USER.DEPOSIT, en: 'Deposit', vi: 'Nạp' },
                                { type: TASK_ACTIONS.CLAIM, en: 'Claim', vi: 'Nhận' }
                            ],
                        }
                    },

                    // Task reward
                    task_reward: {
                        assetId: 72,
                        value: 30000
                    }
                },

                // !NOTE: Task Withdraw 500,000 VNDC
                {
                    // Task summary
                    task_id: 'withdraw_5e5_vndc',
                    task_status: TASK_STATUS.READY,
                    expired_at: '2021-12-31T17:00:00.000Z',

                    // ? Task constraints (query in cms)
                    // constraints: [
                    //     { id: [18, 888] },
                    //     { region: ['vn-vi'] },
                    //     { created_at: '' },
                    //     // ...
                    // ],

                    // Basic info
                    icon_url: '/images/icon/ic_wallet.png',
                    task_title: {
                        vi: 'Rút 500,000 VNDC',
                        en: 'Withdraw 500,000 VNDC'
                    },
                    description: {
                        vi: 'Rút VNDC lên đến 500,000 VNDC vào tài khoản để hoàn thành nhiệm vụ và nhận phần thưởng.',
                        en: 'Withdraw VNDC up to 500,000 VNDC to your account to complete tasks and earn rewards.',
                    },

                    // Task props
                    task_props: {
                        type: TASK_PROPS_TYPE.REACH_TARGET,
                        claim_status: CLAIM_STATUS.NOT_AVAILABLE,
                        metadata: {
                            assetId: 72,
                            target: 500000,
                            reached: 350000,
                            actions: [
                                { type: TASK_ACTIONS.USER.WITHDRAW, en: 'Withdraw', vi: 'Rút' },
                                { type: TASK_ACTIONS.CLAIM, en: 'Claim', vi: 'Nhận' }
                            ],
                        }
                    },

                    // Task reward
                    task_reward: {
                        assetId: 72,
                        value: 30000
                    }
                },
            ]
        }
    }
]
