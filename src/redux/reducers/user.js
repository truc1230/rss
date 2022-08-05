import * as types from '../actions/types';

export const initialState = {
    quoteAsset: null,
    kyc: {
        kycInfo: {
            loading: false,
            error: null,
            data: null,
        },
        country: {
            loading: false,
            error: null,
            data: null,
        },
    },
    onboarding: {
        status: true,
        questions: [],
    },
    referral: {},
    vip: null
};

export default (state = initialState, { type, payload }) => {
    switch (type) {
        case types.SET_QUOTE_ASSET:
            return { ...state, quoteAsset: payload };
        case types.GET_KYC_STATUS_REQUEST: {
            return {
                ...state,
                kyc: {
                    ...state.kyc,
                    kycInfo: {
                        ...state.kyc.kycInfo,
                        loading: true,
                    },
                },
            };
        }
        case types.GET_KYC_STATUS_SUCCESS: {
            return {
                ...state,
                kyc: {
                    ...state.kyc,
                    kycInfo: {
                        ...state.kyc.kycInfo,
                        loading: false,
                        data: payload,
                    },
                },
            };
        }
        case types.GET_KYC_STATUS_FAILURE: {
            return {
                ...state,
                kyc: {
                    ...state.kyc,
                    kycInfo: {
                        ...state.kyc.kycInfo,
                        loading: false,
                        error: payload,
                    },
                },
            };
        }
        case types.GET_KYC_COUNTRY_REQUEST: {
            return {
                ...state,
                kyc: {
                    ...state.kyc,
                    country: {
                        ...state.kyc.country,
                        loading: true,
                    },
                },
            };
        }
        case types.GET_KYC_COUNTRY_SUCCESS: {
            return {
                ...state,
                kyc: {
                    ...state.kyc,
                    country: {
                        ...state.kyc.country,
                        loading: false,
                        data: payload,
                    },
                },
            };
        }
        case types.GET_KYC_COUNTRY_FAILURE: {
            return {
                ...state,
                kyc: {
                    ...state.kyc,
                    country: {
                        ...state.kyc.country,
                        loading: false,
                        error: payload,
                    },
                },
            };
        }
        case types.SET_KYC_INFORMATION_FAILURE: {
            return {
                ...state,
                kyc: {
                    ...state.kyc,
                    kycInfo: {
                        ...state.kyc.kycInfo,
                        loading: false,
                        error: payload,
                    },
                },
            };
        }
        case types.SET_KYC_BANK_FAILURE: {
            return {
                ...state,
                kyc: {
                    ...state.kyc,
                    kycInfo: {
                        ...state.kyc.kycInfo,
                        loading: false,
                        error: payload,
                    },
                },
            };
        }
        case types.SET_KYC_IMAGE_FAILURE: {
            return {
                ...state,
                kyc: {
                    ...state.kyc,
                    kycInfo: {
                        ...state.kyc.kycInfo,
                        loading: false,
                        error: payload,
                    },
                },
            };
        }
        case types.SET_KYC_INFORMATION_SUCCESS: {
            return {
                ...state,
                kyc: {
                    ...state.kyc,
                    kycInfo: {
                        ...state.kyc.kycInfo,
                        loading: false,
                        error: null,
                    },
                },
            };
        }
        case types.SET_KYC_BANK_SUCCESS: {
            return {
                ...state,
                kyc: {
                    ...state.kyc,
                    kycInfo: {
                        ...state.kyc.kycInfo,
                        loading: false,
                        error: null,
                    },
                },
            };
        }
        case types.SET_KYC_IMAGE_FRONT_SUCCESS: {
            return {
                ...state,
                kyc: {
                    ...state.kyc,
                    kycInfo: {
                        ...state.kyc.kycInfo,
                        loading: false,
                        error: null,
                        data: {
                            ...state.kyc.kycInfo.data,
                            kycDocumentData: {
                                ...state.kyc.kycInfo.data.kycDocumentData,
                                metadata: {
                                    ...state.kyc.kycInfo.data?.kycDocumentData?.metadata,
                                    front: payload,
                                },
                            },
                        },
                    },
                },
            };
        }
        case types.SET_KYC_IMAGE_BACK_SUCCESS: {
            return {
                ...state,
                kyc: {
                    ...state.kyc,
                    kycInfo: {
                        ...state.kyc.kycInfo,
                        loading: false,
                        error: null,
                        data: {
                            ...state.kyc.kycInfo.data,
                            kycDocumentData: {
                                ...state.kyc.kycInfo.data.kycDocumentData,
                                metadata: {
                                    ...state.kyc.kycInfo.data?.kycDocumentData?.metadata,
                                    back: payload,
                                },
                            },
                        },
                    },
                },
            };
        }
        case types.SET_KYC_IMAGE_PASSPORT_SUCCESS: {
            return {
                ...state,
                kyc: {
                    ...state.kyc,
                    kycInfo: {
                        ...state.kyc.kycInfo,
                        loading: false,
                        error: null,
                        data: {
                            ...state.kyc.kycInfo.data,
                            kycDocumentData: {
                                ...state.kyc.kycInfo.data.kycDocumentData,
                                metadata: {
                                    ...state.kyc.kycInfo.data?.kycDocumentData?.metadata,
                                    front: payload,
                                },
                            },
                        },
                    },
                },
            };
        }
        case types.SET_KYC_IMAGE_SELFIE_SUCCESS: {
            return {
                ...state,
                kyc: {
                    ...state.kyc,
                    kycInfo: {
                        ...state.kyc.kycInfo,
                        loading: false,
                        error: null,
                        data: {
                            ...state.kyc.kycInfo.data,
                            kycDocumentData: {
                                ...state.kyc.kycInfo.data.kycDocumentData,
                                metadata: {
                                    ...state.kyc.kycInfo.data?.kycDocumentData?.metadata,
                                    portfolio: payload,
                                },
                            },
                        },
                    },
                },
            };
        }
        case types.GET_ONBOARDING_QUESTIONS_SUCCESS: {
            return {
                ...state,
                onboarding: {
                    ...state.onboarding,
                    questions: payload,
                },
            };
        }
        case types.OPEN_ONBOARDING_CASE_SUCCESS: {
            return {
                ...state,
                onboarding: {
                    status: true,
                    questions: [],
                },
            };
        }
        case types.GET_ONBOARDING_PROMOTION_STATUS_SUCCESS: {
            return {
                ...state,
                onboarding: {
                    ...state.onboarding,
                    status: payload,
                },
            };
        }
        // case types.SET_USER: {
        //     let status = 'DRAFT';
        //     if (payload?.kycStatus === 2) {
        //         status = 'APPROVED';
        //     }
        //     if (payload?.kycStatus === 1) {
        //         status = 'PENDING';
        //     }
        //     return {
        //         ...state,
        //         kyc: {
        //             ...state.kyc,
        //             kycInfo: {
        //                 ...state.kyc.kycInfo,
        //                 loading: false,
        //                 data: {
        //                     ...state.kyc.kycInfo.data,
        //                     kycAllStatus: status,
        //                 },
        //             },
        //         },
        //     };
        // }
        case types.GET_USER_REFERRAL_SUCCESS: {
            return {
                ...state,
                referral: payload,
            };
        }
        case types.SET_USER_REFERRAL_SUCCESS: {
            return {
                ...state,
                referral: {
                    refOfName: payload?.refUserName,
                    refOfId: payload?.refUserId,
                    editable: false,
                },
            };
        }
        case types.SET_THEME: {
            return {...state, theme: payload}
        }
        case types.SET_VIP: {
            return {...state, vip: payload}
        }
        default:
            return state;
    }
};
