import qs from 'qs';
import { get } from 'lodash';
import { TRADING_MODE } from 'redux/actions/const';
import GhostContentAPI from '@tryghost/content-api';
import { slugify } from '@tryghost/string';
import algoliasearch from 'algoliasearch';

export const ___DEV___ = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'dev'

export const SECRET_STRING = '******'

export const log = {
    d: (...arg) => {
        ___DEV___ && console.log('%cnamidev-DEBUG: ', 'color: purple;font-weight: bold', ...arg)
    },
    i: (...arg) => {
        ___DEV___ && console.log('%cnamidev-INFO: ', 'color: green;font-weight: bold', ...arg)
    },
    e: (...arg) => {
        ___DEV___ && console.log('%cnamidev-ERROR: ', 'color: red;font-weight: bold', ...arg)
    },
    w: (...arg) => {
        ___DEV___ && console.log('%cnamidev-WARNING: ', 'color: orange;font-weight: bold', ...arg)
    }
}


const NEXT_PUBLIC_ALGOLIA_APP_ID = 'DO34AS45G2'
const NEXT_PUBLIC_ALGOLIA_API_KEY = '1a7ec3ba79285ba40cb8547135e7d297'
const NEXT_PUBLIC_ALGOLIA_INDEX_NAME = 'blog_nami'

const algoliaClient = algoliasearch(NEXT_PUBLIC_ALGOLIA_APP_ID, NEXT_PUBLIC_ALGOLIA_API_KEY)
export const algoliaIndex = algoliaClient.initIndex(NEXT_PUBLIC_ALGOLIA_INDEX_NAME)

export function buildLogoutUrl() {
    let currentUrl = window.location.href
    currentUrl = currentUrl.replace('/vi', '/')
    const params = {
        redirect: currentUrl
    }
    return `${process.env.NEXT_PUBLIC_APP_URL}/logout?${qs.stringify(params)}`
}

export function isNumeric(val) {
    return (
        (typeof val === 'string' &&
            !!val && !isNaN(+val)
        )
        || typeof val === 'number'
    )
}

export function marketWatchToFavorite(favList = [], tradingMode = TRADING_MODE.EXCHANGE, marketWatch, isFutureDataOrigin = false) {
    if (!favList || !favList.length || !marketWatch) return []

    if (tradingMode === TRADING_MODE.EXCHANGE) {
        return Array.isArray(marketWatch) && marketWatch.length && marketWatch.filter(m => favList.includes(`${m?.bi}_${m?.qi}`))
    }
    if (tradingMode === TRADING_MODE.FUTURES) {
        const result = []
        if (isFutureDataOrigin) {
            return Array.isArray(marketWatch) && marketWatch.length && marketWatch.filter(m => favList.includes(`${m?.b}_${m?.q}`))
        } else {
            favList.forEach(f => result.push(marketWatch[f.replace('_', '')]))
        }
        return result
    }
}

export function initMarketWatchItem(pair, debug = false) {
    const _ = {
        symbol: get(pair, 's', null),     // this.symbol = source.s;
        lastPrice: get(pair, 'p', null), // this.lastPrice = +source.p;
        lastPrice24h: get(pair, 'ld', null), // this.lastPrice24h = +source.ld;
        high: get(pair, 'h', null), // this.high = +source.h;
        low: get(pair, 'l', null), // this.low = +source.l;
        high1h: get(pair, 'hh', null), // this.high1h = +source.hh;
        low1h: get(pair, 'lh', null), // this.low1h = +source.lh;
        totalExchangeVolume: get(pair, 'vb', null), // this.totalExchangeVolume = source.vb;
        volume24h: get(pair, 'vq', null),  // this.volume24h = source.vq;
        quoteAsset: get(pair, 'q', null),
        quoteAssetId: get(pair, 'qi', null),
        baseAsset: get(pair, 'b'),
        baseAssetId: get(pair, 'bi', null),
        up: get(pair, 'u', false), // this.up = source.u;
        lastHistoryId: get(pair, 'li', null),  // this.lastHistoryId = source.li;
        supply: get(pair, 'sp', null), // this.supply = source.sp;
        label: get(pair, 'lbl', null) // this.label = source.lbl;
    }
    debug && log.d('ExchangePair', _)
    return _
}

export function getMarketAvailable(assetCode, marketWatch) {
    if (!(assetCode || !marketWatch)) return

    const markets = []
    marketWatch?.forEach(pair => pair?.b === assetCode && markets.push(pair))
    return markets
}

export function initFuturesMarketWatchItem(pair, debug = false) {
    const lcp = get(pair, 'lcp', null)

    const _ = {
        baseAsset: get(pair, 'b', null), // exchangeCurrency: FuturesCurrency.fromName(source.b),
        quoteAsset: get(pair, 'q', null),  // baseCurrency: FuturesCurrency.fromName(source.q),
        ask: get(pair, 'ap', null), // ask: source.ap,
        bid: get(pair, 'bp', null), // bid: source.bp,
        lastPrice: get(pair, 'p', null), // lastPrice: source.p,
        markPrice: get(pair, 'mp', null), // markPrice: source.mp,
        lastPrice24h: get(pair, 'ld', null), // lastPrice24h: source.ld,
        high: get(pair, 'h', null), // high: source.h,
        low: get(pair, 'l', null), // low: source.l,
        volume24h: get(pair, 'vb', null), // volume24h: source.vb,
        up: get(pair, 'u', null), // up: source.u,
        label: get(pair, 'lbl', null), // label: source.lbl,
        placeCurrency: get(pair, 'pa', null), // placeCurrency: FuturesCurrency.fromName(source.pa),
        lastChangePercentage: isNumeric(lcp) ? lcp * 100 : 0, // lastChangePercentage: isNumeric(source.lcp) ?
                                                              // +source.lcp * 100 : 0,
        hideInMarketWatch: get(pair, 'hide_in_market_watch', null) // hideInMarketWatch: source.hide_in_market_watch,
    }
    debug && log.d('FuturesPair: ', _)
    return _
}

export function subscribeExchangeSocket(socket, arr = [], statusCb) {
    if (!Array.isArray(arr) || !arr.length) return
    if (!socket) {
        statusCb && statusCb(!!socket)
    } else {
        arr.forEach(item => {
            const payload = get(item, 'payload', null)
            const socketString = get(item, 'socketString', null)
            if (payload && socketString) socket.emit(`subscribe:${socketString}`, `${payload}`)
        })
        statusCb && statusCb(!!socket)
    }
}

export const unsubscribeExchangeSocket = (socket, symbol) => {
    if (!socket) return
    socket.emit('unsubscribe:all', symbol)
}

export const sparkLineBuilder = (symbol, color) => {
    return `${process.env.NEXT_PUBLIC_PRICE_API_URL}/api/v1/chart/sparkline?symbol=${symbol}&broker=NAMI_SPOT&color=%23${color?.replace('#', '')}`
}

export const ghost = new GhostContentAPI(
    {
        url: process.env.NEXT_PUBLIC_BLOG_API_URL,
        key: process.env.NEXT_PUBLIC_BLOG_API_CONTENT_KEY,
        version: 'v3'
    }
)

const CATEGORIES_IGRONED = ['noti', 'faq', 'en', 'vi']

export const getSupportCategories = async (language = 'vi') => {
    const allTags = await ghost.tags.browse({ limit: 'all', fields: 'slug,name,id,description' })
    // console.log('namidev ', allTags)
    if (allTags) {
        const announcementCategories = allTags?.map(o => ({
            id: o?.id,
            name: o?.name,
            iconUrl: o?.feature_image || '/images/screen/support/ic_command.png',
            slug: o?.slug,
            displaySlug: o?.slug?.replace(`noti-${language}-`, ''),
            description: o?.description
        }))
            ?.filter(f => !CATEGORIES_IGRONED.includes(f.slug) && f.slug.startsWith(`noti-${language}`))
        const faqCategories = allTags?.map(o => ({
            id: o?.id,
            name: o?.name,
            iconUrl: o?.feature_image || '/images/screen/support/ic_command.png',
            slug: o?.slug,
            displaySlug: o?.slug?.replace(`faq-${language}-`, ''),
            description: o?.description
        }))
            ?.filter(f => !CATEGORIES_IGRONED.includes(f.slug) && f.slug.startsWith(`faq-${language}`))

        return {
            announcementCategories,
            faqCategories
        }
    }
}

export const getSupportArticles = async (tag, language) => {
    const options = {
        limit: 'all',
        include: 'tags'
    }
    const filter = []
    if (tag) filter.push(`tag:${tag}`)
    if (language === 'vi') {
        filter.push('tags:-en')
    } else {
        filter.push('tags:en')
    }
    options.filter = filter.join('+')
    return await ghost.posts.browse(options)
}

export const getLastedArticles = async (tag = '', limit = 10, language = 'vi', isHighlighted = false) => {
    const filter = []
    const options = {
        limit: limit,
        include: 'tags',
        order: 'published_at DESC'
    }
    const lang = language === 'vi' ? '-en' : 'en'

    if (tag) {
        filter.push(`tags:${lang}+tags:${tag}`)
    } else {
        filter.push(`tags:${lang}`)
    }

    if (isHighlighted) {
        filter.push('featured:true')
    }

    options.filter = filter.join('+')
    return await ghost.posts.browse(options)
}

export const getArticle = async (slug) => await ghost.posts.read({ slug })

export const articlesIndexKey = 'support-search-indexed'

export const indexingArticles = async (language) => {
    const result = await ghost.posts.browse(
        {
            limit: 'all',
            order: 'published_at DESC',
            fields: 'id,title,slug',
            filter: `tags:${language === 'en' ? 'en' : '-en'}`
        }
    )

    // store { [id]: slug }
    const indexer = result.reduce((a, v) => ({...a, [v?.id]: v.slug}), {})
    localStorage.setItem(articlesIndexKey, JSON.stringify(indexer))
}

export const querySupportArticles = async (tag, keyword = '', language = 'vi', currentPage, limit = 15) => {
    // console.log('namidev-DEBUG: PRE CHECK ___ ', tag, keyword, language, currentPage, limit)
    const localIndex = localStorage.getItem(articlesIndexKey)
    const filter = []

    let cat
    if (tag === 0) cat = 'faq'
    if (tag === 1) cat = 'noti'
    if (tag === 2) cat = undefined

    if (tag) {
        filter.push(`tags:${cat}`)
    }
    language === 'en' ? filter.push(`tags:en`) : filter.push(`tags:-en`)

    if (localIndex) {
        const indexedDb = JSON.parse(localIndex)
        const queryTags = Object.values(indexedDb).filter(o => o.includes(slugify(keyword)))

        filter.push(`tags:${queryTags.join('+tags:')}`)

        const options = {
            limit,
            filter: filter.join('+')
        }

        // console.log('namidev check id query ', filter.join('+'))

        const query = await ghost.posts.browse(options)
        // console.log('namidev-DEBUG: Query Options => ', options.filter)
        // console.log('namidev-DEBUG: Query articles => ', query)
    }
}

export function wait(timeout) {
    return new Promise(resolve => setTimeout(resolve, timeout))
}
