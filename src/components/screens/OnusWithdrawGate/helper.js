import qs from 'qs';
export const WalletCurrency = {
    ATS: 148,
    NAC: 1,
    USDT: 22,
    VNDC: 72,
    KAI: 84,
    ONUS: 86,
    WHC: 88,
    SFO: 187,
    NAMI: 1,
    NAO: 447,
}

export const getAvailableToken = (currency, balance) => {
    return balance && balance[currency]
        ? balance[currency].value - balance[currency].locked_value
        : 0
}

export function getCurrencyDescription(currency) {
    currency = +currency
    switch (currency) {
        case WalletCurrency.VNDC:
            return 'VNDC'
        case WalletCurrency.KAI:
            return 'KardiaChain Token'
        case WalletCurrency.NAMI:
            return 'Nami Corporation'
        case WalletCurrency.NAC:
            return 'NAMI Coin'
        case WalletCurrency.ATS:
            return 'Attlas Exchange'
        case WalletCurrency.ONUS:
            return 'ONUS'
        case WalletCurrency.WHC:
            return 'WhiteHub'
        case WalletCurrency.SFO:
            return 'SFO Token'
        default:
            return ''
    }
}

export const getTimeStampRange = (start, end) => {
    if (!start || !end) return null
    const current = Date.now()
    return current >= start && current <= end
}

export function getTokenIcon(currency, size) {
    if (currency) {
        return size ? (
            <img src={getTokenIconSrc(currency)} alt='' width={size} />
        ) : (
            <img src={getTokenIconSrc(currency)} alt='' />
        )
    }
    return null
}

export function getTokenIconSrc(currency) {
    if (currency) {
        return getS3Url(`/images/coins/64/${currency}.png`)
    }
    return null
}

export function getS3Url(url) {
    return (process.env.NEXT_PUBLIC_CDN + '/nami.exchange' || '') + url
}

export function currencyToText(currency) {
    currency = +currency
    switch (currency) {
        case WalletCurrency.NAC:
            return 'NAMI'
        default:
            for (let currencyText in WalletCurrency) {
                if (
                    currencyText &&
                    WalletCurrency.hasOwnProperty(currencyText) &&
                    WalletCurrency[currencyText] === currency
                ) {
                    return currencyText
                }
            }
            return ''
    }
}

export function buildNamiExchangeAppLink(
    rootLink = process.env.NEXT_PUBLIC_APP_LINK_HREF
) {
    const referralCode =
        sessionStorage && sessionStorage.getItem('refCode')
            ? sessionStorage.getItem('refCode')
            : ''
    console.log('--refcode', referralCode)
    const data = {
        $tradeUrl: window.location.href,
        $referralCode: referralCode,
    }
    return rootLink + '?' + qs.stringify(data)
}

export function emitEventData(data = {}) {
    window.ReactNativeWebView &&
        window.ReactNativeWebView.postMessage(JSON.stringify(data))
}

export const handleLogin = (isApp) => {
    if (isApp) {
        emitEventData({ action: 'signin' })
    } else {
        window.location.href = getLoginUrl('nami')
    }
}
