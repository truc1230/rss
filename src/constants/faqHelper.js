import { ghost } from 'utils';

export const CatsKey = {
    AccountFunctions: 'acc_func',
    Tutorial: 'tutorial',
    NamiToken: 'nami_token',
    DepWdlCrypto: 'dep_wdl_crypto',
    SpotTrading: 'spot_trading',
    FuturesTrading: 'futures_trading',
    Swap: 'swap',
    TokenPrediction: 'token_prediction',
    Finance: 'finance_product',
    Others: 'others',
    BusinessPartner: 'business_partner',
    NewTokenListing: 'new_token_listing',
    NamiNews: 'nami_news',
    Announcement: 'announcements',
    Event: 'events',
    DailyStaking: 'daily_staking',
}

export const SupportCategories = {
    faq: {
        vi: [
            {
                id: CatsKey.AccountFunctions,
                title: 'Chức năng tài khoản',
                slug: 'faq-vi-chuc-nang-tai-khoan',
                displaySlug: 'chuc-nang-tai-khoan',
                description: 'Các câu hỏi về tài khoản và cài đặt thông tin tài khoản',
                iconUrl: '',
                subCats: [
                    {
                        id: 'reg_new_acc',
                        title: 'Đăng ký tài khoản và Mật khẩu',
                        slug: 'faq-vi-dang-ky-tai-khoan-va-mat-khau',
                        displaySlug: 'dang-ky-tai-khoan-va-mat-khau'
                    },
                    {
                        id: 'user_kyc',
                        title: 'Xác minh danh tính (KYC)',
                        slug: 'faq-vi-xac-minh-danh-tinh-kyc',
                        displaySlug: 'xac-minh-danh-tinh-kyc'
                    },
                    {
                        id: 'two_fa',
                        title: 'Xác thực hai lớp',
                        slug: 'faq-vi-xac-thuc-hai-lop',
                        displaySlug: 'xac-thuc-hai-lop'
                    },
                    {
                        id: 'email_prob',
                        title: 'Các vấn đề về email',
                        slug: 'faq-vi-cac-van-de-ve-email',
                        displaySlug: 'cac-van-de-ve-email',
                    },
                    {
                        id: 'referral_freshman',
                        title: 'Chương trình Giới thiệu người dùng mới',
                        slug: 'faq-vi-chuong-trinh-gioi-thieu-nguoi-dung-moi',
                        displaySlug: 'chuong-trinh-gioi-thieu-nguoi-dung-moi',
                    },
                    {
                        id: 'rw_center',
                        title: 'Trung tâm quà tặng',
                        slug: 'faq-vi-trung-tam-qua-tang',
                        displaySlug: 'trung-tam-qua-tang',
                    },
                    {
                        id: 'wallet_prob',
                        title: 'Ví',
                        slug: 'faq-vi-vi',
                        displaySlug: 'vi'
                    }
                ]
            },
            {
                id: CatsKey.Tutorial,
                title: 'Hướng dẫn chung',
                slug: 'faq-vi-huong-dan-chung',
                displaySlug: 'huong-dan-chung',
                description: 'Các câu hỏi tổng quát',
                iconUrl: '',
                subCats: []
            },
            {
                id: CatsKey.NamiToken,
                title: 'Token NAMI',
                slug: 'faq-vi-token-nami',
                displaySlug: 'token-nami',
                description: 'Thông tin về token NAMI',
                iconUrl: 'Thông tin về token NAMI',
                subCats: []
            },
            {
                id: CatsKey.DepWdlCrypto,
                title: 'Nạp/Rút tiền mã hoá',
                slug: 'faq-vi-nap-rut-tien-ma-hoa',
                displaySlug: 'nap-rut-tien-ma-hoa',
                description: 'Hướng dẫn chi tiết về nạp rút tiền mã hóa',
                iconUrl: '',
                subCats: [
                    {
                        id: 'how_to_dep_wdl',
                        title: 'Hướng dẫn nạp/rút chung',
                        slug: 'faq-vi-huong-dan-nap-rut-chung',
                        displaySlug: 'huong-dan-nap-rut-chung'
                    },
                    {
                        id: 'how_to_dep',
                        title: 'Hướng dẫn nạp tiền mã hoá',
                        slug: 'faq-vi-huong-dan-nap-tien-ma-hoa',
                        displaySlug: 'huong-dan-nap-tien-ma-hoa'
                    },
                    {
                        id: 'how_to_wdl',
                        title: 'Hướng dẫn rút tiền mã hoá',
                        slug: 'faq-vi-huong-dan-rut-tien-ma-hoa',
                        displaySlug: 'huong-dan-rut-tien-ma-hoa'
                    },
                ]
            },
            {
                id: CatsKey.SpotTrading,
                title: 'Giao dịch Spot',
                slug: 'faq-vi-giao-dich-spot',
                displaySlug: 'giao-dich-spot',
                description: 'Hướng dẫn về giao dịch Spot trên Nami Exchange',
                iconUrl: '',
                subCats: []
            },
            {
                id: CatsKey.Swap,
                title: 'Quy đổi',
                slug: 'faq-vi-quy-doi',
                displaySlug: 'quy-doi',
                description: 'Các thông tin về sản phẩm Quy đổi',
                iconUrl: '',
                subCats: []
            },
            {
                id: CatsKey.TokenPrediction,
                title: 'Token dự đoán',
                slug: 'faq-vi-token-prediction',
                displaySlug: 'token-prediction',
                description: 'Các thông tin liên quan đến Token Dự đoán - sản phẩm đột phá mới của Nami Exchange',
                iconUrl: ''
            },
            {
                id: CatsKey.FuturesTrading,
                title: 'Giao dịch Futures',
                slug: 'faq-vi-giao-dich-futures',
                displaySlug: 'giao-dich-futures',
                description: 'Hướng dẫn về giao dịch Futures trên Nami Exchange',
                iconUrl: '',
                subCats: [
                    {
                        id: 'vndc_futures',
                        title: 'VNDC Futures',
                        slug: 'faq-vi-vndc-futures',
                        displaySlug: 'vndc-futures',
                        description: 'Hướng dẫn về giao dịch Futures trên Nami Exchange',
                    },
                    {
                        id: 'usdt_futures',
                        title: 'USDT Futures',
                        slug: 'faq-vi-usdt-futures',
                        displaySlug: 'usdt-futures',
                        description: 'Hướng dẫn về giao dịch USDT Futures',
                    },
                ]
            },
            // {
            //     id: CatsKey.Finance,
            //     title: 'Sản phẩm tài chính',
            //     slug: 'faq-vi-san-pham-tai-chinh',
            //     displaySlug: 'san-pham-tai-chinh',
            //     description: 'Các thông tin về nhóm sản phẩm tài chính trên Nami Exchange',
            //     iconUrl: '',
            //     subCats: [
            //         {
            //             id: 'nami_farming',
            //             title: 'Nami Farming',
            //             slug: 'faq-vi-nami-farming',
            //             displaySlug: 'nami-farming'
            //         },
            //         {
            //             id: 'nami_staking',
            //             title: 'Nami Staking',
            //             slug: 'faq-vi-nami-staking',
            //             displaySlug: 'nami-staking'
            //         },
            //         {
            //             id: 'nami_launchpad',
            //             title: 'Nami Launchpad',
            //             slug: 'faq-vi-nami-launchpad',
            //             displaySlug: 'nami-launchpad'
            //         }
            //     ]
            // },
            {
                id: CatsKey.DailyStaking,
                title: 'Nhận lãi ngày (Daily Staking)',
                slug: 'faq-vi-daily-staking',
                displaySlug: 'daily-staking',
                description: 'Chương trình trả lãi ngày với lãi suất năm 12.79% với VNDC và 6% với USDT',
                iconUrl: ''
            },
            {
                id: CatsKey.Others,
                title: 'Chuyên mục khác',
                slug: 'faq-vi-chuyen-muc-khac',
                displaySlug: 'chuyen-muc-khac',
                description: 'Thông tin về điều khoản sử dụng sản phẩm dịch vụ',
                iconUrl: '',
                subCats: [
                    {
                        id: 'rules_condition',
                        title: 'Điều khoản và điều kiện',
                        slug: 'faq-vi-dieu-khoan-va-dieu-kien',
                        displaySlug: 'dieu-khoan-va-dieu-kien'
                    }
                ]
            },
            {
                id: CatsKey.BusinessPartner,
                title: 'Hợp tác kinh doanh',
                slug: 'faq-vi-hop-tac-kinh-doanh',
                displaySlug: 'hop-tac-kinh-doanh',
                description: 'Thông tin liên hệ và cách thức hợp tác phát triển kinh doanh',
                iconUrl: ''
            }
        ],
        en: [
            {
                id: CatsKey.AccountFunctions,
                title: 'Account Functions',
                slug: 'faq-en-account-functions',
                displaySlug: 'account-functions',
                description: 'Information about accounts and account settings',
                iconUrl: '',
                subCats: [
                    {
                        id: 'reg_new_acc',
                        title: 'Register Account and Password',
                        slug: 'faq-en-register-account-and-password',
                        displaySlug: 'register-account-and-password'
                    },
                    {
                        id: 'user_kyc',
                        title: 'Identity Verification (KYC)',
                        slug: 'faq-en-identity-verification-kyc',
                        displaySlug: 'identity-verification-kyc'
                    },
                    {
                        id: 'two_fa',
                        title: 'Two-factor Authentication',
                        slug: 'faq-en-two-factor-authentication',
                        displaySlug: 'two-factor-authentication'
                    },
                    {
                        id: 'email_prob',
                        title: 'Email Issues',
                        slug: 'faq-en-email-issues',
                        displaySlug: 'email-issues',
                    },
                    {
                        id: 'referral_freshman',
                        title: 'Referral Program',
                        slug: 'faq-en-introducing-new-users',
                        displaySlug: 'introducing-new-users',
                    },
                    {
                        id: 'rw_center',
                        title: 'Reward Center',
                        slug: 'faq-en-reward-center',
                        displaySlug: 'reward-center',
                    },
                    {
                        id: 'wallet_prob',
                        title: 'Wallet',
                        slug: 'faq-en-wallet',
                        displaySlug: 'wallet'
                    }
                ]
            },
            {
                id: CatsKey.Tutorial,
                title: 'Tutorials',
                slug: 'faq-en-tutorials',
                displaySlug: 'tutorials',
                description: 'General questions',
                iconUrl: ''
            },
            {
                id: CatsKey.NamiToken,
                title: 'NAMI Token',
                slug: 'faq-en-nami-token',
                displaySlug: 'nami-token',
                description: 'Information about the NAMI token',
                iconUrl: ''
            },
            {
                id: CatsKey.DepWdlCrypto,
                title: 'Crypto Deposit/Withdrawal',
                slug: 'faq-en-crypto-deposit-withdrawal',
                displaySlug: 'crypto-deposit-withdrawal',
                description: 'Detailed instructions for depositing and withdrawing cryptocurrencies',
                iconUrl: '',
                subCats: [
                    {
                        id: 'how_to_dep_wdl',
                        title: 'Deposit/Withdraw Guide',
                        slug: 'faq-en-deposit-withdraw-guide',
                        displaySlug: 'deposit-withdraw-guide'
                    },
                    {
                        id: 'how_to_dep',
                        title: 'Crypto Deposit',
                        slug: 'faq-en-crypto-deposit',
                        displaySlug: 'crypto-deposit'
                    },
                    {
                        id: 'how_to_wdl',
                        title: 'Crypto Withdrawal',
                        slug: 'faq-en-crypto-withdrawal',
                        displaySlug: 'crypto-withdrawal'
                    },
                ]
            },
            {
                id: CatsKey.SpotTrading,
                title: 'Spot Trading',
                slug: 'faq-en-spot-trading',
                displaySlug: 'spot-trading',
                description: 'Guide to spot trading on Nami Exchange',
                iconUrl: ''
            },
            {
                id: CatsKey.Swap,
                title: 'Swap',
                slug: 'faq-en-swap',
                displaySlug: 'swap',
                description: 'Information about Swap product on Nami Exchange',
                iconUrl: ''
            },
            {
                id: CatsKey.TokenPrediction,
                title: 'Token Prediction',
                slug: 'faq-en-token-prediction',
                displaySlug: 'token-prediction',
                description: "Information about Token Prediction - Nami Exchange's new breakthrough product",
                iconUrl: ''
            },
            {
                id: CatsKey.FuturesTrading,
                title: 'Futures Trading',
                slug: 'faq-en-futures-trading',
                displaySlug: 'futures-trading',
                description: 'Guide to Trading Futures on Nami Exchange',
                iconUrl: '',
                subCats: [
                    {
                        id: 'vndc_futures',
                        title: 'VNDC Futures',
                        slug: 'faq-en-vndc-futures',
                        displaySlug: 'vndc-futures'
                    },
                    {
                        id: 'usdt_futures',
                        title: 'USDT Futures',
                        slug: 'faq-en-usdt-futures',
                        displaySlug: 'usdt-futures'
                    },
                ]
            },
            // {
            //     id: CatsKey.Finance,
            //     title: 'Finance',
            //     slug: 'faq-en-finance',
            //     displaySlug: 'finance',
            //     description: 'Information about financial products on Nami Exchange',
            //     iconUrl: '',
            //     subCats: [
            //         {
            //             id: 'nami_farming',
            //             title: 'Nami Farming',
            //             slug: 'faq-en-nami-farming',
            //             displaySlug: 'nami-farming'
            //         },
            //         {
            //             id: 'nami_staking',
            //             title: 'Nami Staking',
            //             slug: 'faq-en-nami-staking',
            //             displaySlug: 'nami-staking'
            //         },
            //         {
            //             id: 'nami_launchpad',
            //             title: 'Nami Launchpad',
            //             slug: 'faq-en-nami-launchpad',
            //             displaySlug: 'nami-launchpad'
            //         }
            //     ]
            // },
            {
                id: CatsKey.DailyStaking,
                title: 'Daily Staking',
                slug: 'faq-en-daily-staking',
                displaySlug: 'daily-staking',
                description: 'Information about Daily Staking program with APY 12.79% for VNDC and 6% for USDT',
                iconUrl: ''
            },
            {
                id: CatsKey.Others,
                title: 'Other topics',
                slug: 'faq-en-other-topics',
                displaySlug: 'other-topics',
                description: 'Information about Terms of use of products and services',
                iconUrl: '',
                subCats: [
                    {
                        id: 'rules_condition',
                        title: 'Nami Terms of Use',
                        slug: 'faq-en-nami-terms-of-use',
                        displaySlug: 'nami-terms-of-use'
                    }
                ]
            },
            {
                id: CatsKey.BusinessPartner,
                title: 'Business Cooperation',
                slug: 'faq-en-business-cooperation',
                displaySlug: 'business-cooperation',
                description: 'Contact information and methods to cooperate for business development',
                iconUrl: ''
            }
        ]
    },
    announcements: {
        vi: [
            {
                id: CatsKey.NewTokenListing,
                title: 'Token mới Niêm yết ',
                slug: 'noti-vi-token-moi-niem-yet',
                displaySlug: 'token-moi-niem-yet',
                description: 'Thông báo niêm yết các cặp giao dịch mới trên Nami Exchange',
                iconUrl: ''
            },
            {
                id: CatsKey.NamiNews,
                title: 'Tin tức về Nami',
                slug: 'noti-vi-tin-tuc-ve-nami',
                displaySlug: 'tin-tuc-ve-nami',
                description: 'Các thông tin cập nhật về Nami Corp. và Nami Exchange',
                iconUrl: ''
            },
            {
                id: CatsKey.Announcement,
                title: 'Thông báo',
                slug: 'noti-vi-thong-bao',
                displaySlug: 'thong-bao',
                description: 'Các thông báo bảo trì, cập nhật trạng thái giao dịch',
                iconUrl: ''
            },
            {
                id: CatsKey.Event,
                title: 'Sự kiện',
                slug: 'noti-vi-su-kien',
                displaySlug: 'su-kien',
                description: 'Thông tin về các chương trình khuyến mại, airdrop, các chương trình tặng thưởng người dùng',
                iconUrl: ''
            }
        ],
        en: [
            {
                id: CatsKey.NewTokenListing,
                title: 'New Listings',
                slug: 'noti-en-new-cryptocurrency-listing',
                displaySlug: 'new-cryptocurrency-listing',
                description: 'Listing announcements',
                iconUrl: ''
            },
            {
                id: CatsKey.NamiNews,
                title: 'Nami News',
                slug: 'noti-en-nami-news',
                displaySlug: 'nami-news',
                description: 'Latest news about Nami Corp. and Nami Exchange',
                iconUrl: ''
            },
            {
                id: CatsKey.Announcement,
                title: 'Announcement',
                slug: 'noti-en-announcement',
                displaySlug: 'announcement',
                description: 'Announcement about maintenance, update of trading status...',
                iconUrl: ''
            },
            {
                id: CatsKey.Event,
                title: 'Events',
                slug: 'noti-en-events',
                displaySlug: 'events',
                description: 'Articles related to promotions, marketing.',
                iconUrl: ''
            }
        ]
    }
}

export const getSupportCategoryIcons = (id) => {
    switch (id) {
        case CatsKey.AccountFunctions:
            return '/images/screen/support/ic_user.png'
        case CatsKey.Tutorial:
        case CatsKey.NamiNews:
        case CatsKey.Announcement:
        case CatsKey.Event:
            return '/images/screen/support/ic_book.png'
        case CatsKey.DepWdlCrypto:
            return '/images/screen/support/ic_dollar.png'
        case CatsKey.NamiToken:
            return '/images/screen/support/ic_nami_token.png'
        case CatsKey.SpotTrading:
        case CatsKey.TokenPrediction:
            return '/images/screen/support/ic_analytic.png'
        case CatsKey.FuturesTrading:
            return '/images/screen/support/ic_trend.png'
        case CatsKey.Swap:
        case CatsKey.NewTokenListing:
            return '/images/screen/support/ic_duo_dollar.png'
        case CatsKey.Finance:
        case CatsKey.DailyStaking:
            return '/images/screen/support/ic_wallet.png'
        case CatsKey.Others:
            return '/images/screen/support/ic_other.png'
        case CatsKey.BusinessPartner:
            return '/images/icon/ic_globe.png'
    }
}

export const getCategories = async () => {
    const cats = await ghost.tags.browse({ limit: 'all' })
}

export const appUrlHandler = (obj, isApp) => {
    if (!isApp) return obj
    return {
        ...obj,
        source: 'app'
    }
}
